import { api, clearSession, readMessage, USER_KEY } from "./api";

export interface AuthUser {
  id: number;
  userId?: number;
  name: string;
  username: string;
  role: string;
  isAdmin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  username: string;
  password: string;
}

export const normalizeRole = (value?: string): string =>
  (value ?? "USER").toUpperCase().replace(/^ROLE_/, "");

/** Reads the UserDTO out of a ResponseDTO (`dtos: [user]`). */
const readUser = (data: any): AuthUser | null => {
  const source = data?.dtos?.[0] ?? data?.user ?? data;

  if (!source || (!source.username && !source.role)) return null;

  const role = normalizeRole(source.role);

  return {
    id: source.id ?? source.userId,
    userId: source.userId,
    name: source.name ?? source.username,
    username: source.username,
    role,
    isAdmin: role === "ADMIN",
  };
};

export const saveUser = (user: AuthUser) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

/** GET /profile - the currently authenticated user. */
export const fetchProfile = async (): Promise<AuthUser> => {
  const response = await api.get("/profile");
  const user = readUser(response.data);

  if (!user) throw new Error("Profile response was empty");

  return user;
};

/** POST /login - the backend creates the session cookie. */
export const login = async (payload: LoginRequest): Promise<AuthUser> => {
  const response = await api.post("/login", payload);
  const user = readUser(response.data);

  if (!user) throw new Error("Login response was empty");

  return user;
};

/** POST /signup - creates the user only, it does not start a session. */
export const signup = async (payload: SignupRequest): Promise<string> => {
  const response = await api.post("/signup", payload);
  return readMessage(response.data, "Signup successful. Please log in.");
};

/** POST /logout - invalidates the session on the backend. */
export const logout = async (): Promise<void> => {
  try {
    await api.post("/logout");
  } catch {
    // The local state is cleared either way.
  }

  clearSession();
};
