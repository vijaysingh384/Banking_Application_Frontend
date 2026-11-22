import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import NavigationBar from "./components/NavigationBar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import AddUser from "./features/users/Adduser";
import AddAccount from "./features/account/Addaccount";
import Deposit from "./features/account/Deposit";
import Withdraw from "./features/account/Withdraw";
import GetLoan from "./features/loans/GetLoan";
import UsersList from "./features/users/Userslist";
import AccountsList from "./features/account/AccountList";
import LoansList from "./features/loans/Loanslist";
import TransferFund from "./features/account/TransferFund";

const Page = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/signup" element={<Page><Signup /></Page>} />
          <Route path="/logout" element={<Page><Logout /></Page>} />

          {/* Own profile, accounts and loans */}
          <Route
            path="/profile"
            element={
              <Page>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Page>
            }
          />

          {/* Customer banking actions */}
          <Route
            path="/deposit"
            element={
              <Page>
                <ProtectedRoute>
                  <Deposit />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="/withdraw"
            element={
              <Page>
                <ProtectedRoute>
                  <Withdraw />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="/loan"
            element={
              <Page>
                <ProtectedRoute>
                  <GetLoan />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="/transferfund"
            element={
              <Page>
                <ProtectedRoute>
                  <TransferFund />
                </ProtectedRoute>
              </Page>
            }
          />

          {/* Admin only */}
          <Route
            path="/users"
            element={
              <Page>
                <ProtectedRoute adminOnly>
                  <UsersList />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="/add-user"
            element={
              <Page>
                <ProtectedRoute adminOnly>
                  <AddUser />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="/accounts"
            element={
              <Page>
                <ProtectedRoute adminOnly>
                  <AccountsList />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="/add-account"
            element={
              <Page>
                <ProtectedRoute adminOnly>
                  <AddAccount />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="/loans"
            element={
              <Page>
                <ProtectedRoute adminOnly>
                  <LoansList />
                </ProtectedRoute>
              </Page>
            }
          />

          <Route
            path="*"
            element={
              <Page>
                <div className="text-center mt-20">
                  <h1 className="text-4xl font-bold">404</h1>
                  <p className="text-gray-500 mt-2">Page Not Found</p>
                </div>
              </Page>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
