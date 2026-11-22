import { useLocation } from "react-router-dom";
import PillNav from "./PillNav";
import { useAuth } from "../context/AuthContext";

const NavigationBar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const guestItems = [
    { label: "Home", href: "/" },
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/signup" },
  ];

  const customerItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
    { label: "Deposit", href: "/deposit" },
    { label: "Withdraw", href: "/withdraw" },
    { label: "Loan", href: "/loan" },
    { label: "Transfer", href: "/transferfund" },
    { label: "Logout", href: "/logout" },
  ];

  const adminItems = [
    { label: "Home", href: "/" },
    { label: "Users", href: "/users" },
    { label: "Add User", href: "/add-user" },
    { label: "Accounts", href: "/accounts" },
    { label: "Add Account", href: "/add-account" },
    { label: "Loans", href: "/loans" },
    { label: "Logout", href: "/logout" },
  ];

  const navItems = !user ? guestItems : user.isAdmin ? adminItems : customerItems;

  return (
    <PillNav
      logo="/bank-logo.svg"
      logoAlt="Banking System Logo"
      items={navItems}
      activeHref={location.pathname}
      baseColor="#ffffff"
      pillColor="#07080bff"
      hoveredPillTextColor="#0a0a0bff"
      pillTextColor="#d7dae2ff"
      initialLoadAnimation={true}
    />
  );
};

export default NavigationBar;
