import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    logout().finally(() => {
      if (active) navigate("/login", { replace: true });
    });

    return () => {
      active = false;
    };
  }, [logout, navigate]);

  return (
    <div className="text-center mt-20 text-lg font-semibold">
      Signing you out...
    </div>
  );
};

export default Logout;
