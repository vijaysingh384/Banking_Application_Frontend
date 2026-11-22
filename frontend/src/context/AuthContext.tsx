import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthUser,
  LoginRequest,
  SignupRequest,
  fetchProfile,
  login as loginRequest,
  logout as logoutRequest,
  readStoredUser,
  saveUser,
  signup as signupRequest,
} from "../services/auth";
import { clearSession } from "../services/api";

interface AuthContextValue {
  user: AuthUser | null;
  initializing: boolean;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  signup: (payload: SignupRequest) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    // Ask the backend who the session belongs to. This restores the login
    // after a refresh because the browser keeps sending the session cookie.
    const restoreSession = async () => {
      try {
        const profile = await fetchProfile();
        if (!active) return;
        saveUser(profile);
        setUser(profile);
      } catch {
        if (!active) return;
        clearSession();
        setUser(null);
      } finally {
        if (active) setInitializing(false);
      }
    };

    restoreSession();

    // Fired by the axios interceptor when the session is rejected.
    const handleLogout = () => setUser(null);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      active = false;
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const loggedIn = await loginRequest(payload);
    saveUser(loggedIn);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  // Signup does not create a session on the backend, so the user is sent to
  // the login page afterwards.
  const signup = useCallback(async (payload: SignupRequest) => {
    return signupRequest(payload);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};
