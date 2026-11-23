import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, readErrorMessage } from "../services/api";
import LoanStatusBadge from "../features/loans/LoanStatusBadge";

interface Account {
  id: number;
  userId: number;
  balance: number;
}

interface Loan {
  id: number;
  userId: number;
  accountId?: number;
  sanctionAmount: number;
  status?: string;
}

const Profile = () => {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    setError("");

    try {
      const [accountsResponse, loansResponse] = await Promise.all([
        api.get("/my/accounts"),
        api.get("/my/loans"),
      ]);

      setAccounts(accountsResponse.data.accountdtos ?? []);
      setLoans(loansResponse.data.loandtos ?? []);
    } catch (err) {
      console.error(err);
      setError(readErrorMessage(err, "Failed to load your accounts and loans."));
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance ?? 0),
    0
  );

  // Only approved loans count: a pending loan has not been paid out yet.
  const totalLoan = loans
    .filter((loan) => loan.status?.toUpperCase() === "APPROVED")
    .reduce((sum, loan) => sum + Number(loan.sanctionAmount ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Profile card */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-gray-500">Welcome back</p>
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.name}
            </h1>

            <div className="mt-3 space-y-1 text-gray-600">
              <p>
                <span className="font-semibold text-gray-700">Username: </span>
                {user?.username}
              </p>
              <p>
                <span className="font-semibold text-gray-700">User ID: </span>
                {user?.userId ?? user?.id}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Role: </span>
                <span className="uppercase text-blue-600 font-semibold">
                  {user?.role}
                </span>
              </p>
            </div>
          </div>

          <Link
            to="/logout"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Logout
          </Link>
        </div>
      </section>

      {/* Totals */}
      <section className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-500">Total Balance</p>
          <p className="text-3xl font-bold text-green-600">
            ₹ {totalBalance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-500">Approved Loan Amount</p>
          <p className="text-3xl font-bold text-indigo-600">
            ₹ {totalLoan.toLocaleString()}
          </p>
        </div>
      </section>

      {/* Quick actions */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/deposit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            Deposit
          </Link>

          <Link
            to="/withdraw"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Withdraw
          </Link>

          <Link
            to="/loan"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg transition"
          >
            Apply for Loan
          </Link>

          <Link
            to="/transferfund"
            className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-lg transition"
          >
            Transfer Funds
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="text-center text-lg font-semibold">
          Loading your accounts...
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <>
          {/* My accounts */}
          <section className="bg-white rounded-xl shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-700">My Accounts</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3">Account ID</th>
                    <th className="px-6 py-3">Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-6 text-gray-500">
                        No accounts linked to your profile yet.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account) => (
                      <tr
                        key={account.id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="px-6 py-4">{account.id}</td>
                        <td className="px-6 py-4 font-semibold text-green-600">
                          ₹ {Number(account.balance ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* My loans */}
          <section className="bg-white rounded-xl shadow-lg">
            <div className="border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-700">My Loans</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3">Loan ID</th>
                    <th className="px-6 py-3">Account</th>
                    <th className="px-6 py-3">Loan Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
                        You have not applied for a loan yet.
                      </td>
                    </tr>
                  ) : (
                    loans.map((loan) => (
                      <tr key={loan.id} className="border-b hover:bg-gray-100">
                        <td className="px-6 py-4">{loan.id}</td>
                        <td className="px-6 py-4">{loan.accountId ?? "-"}</td>
                        <td className="px-6 py-4 font-semibold text-indigo-600">
                          ₹ {Number(loan.sanctionAmount ?? 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <LoanStatusBadge status={loan.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Profile;
