import { useEffect, useState } from "react";
import { api, readErrorMessage, readMessage } from "../../services/api";
import LoanStatusBadge from "./LoanStatusBadge";

interface Loan {
  id: number;
  userId: number;
  accountId?: number;
  sanctionAmount: number;
  status?: string;
}

const LoansList = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get("/loans");

      setLoans(response.data.loandtos ?? []);
    } catch (err) {
      console.error(err);
      setError(readErrorMessage(err, "Failed to fetch loans."));
    } finally {
      setLoading(false);
    }
  };

  // POST /admin/loans/{id}/approve or /reject. Approving credits the loan
  // amount to the account the customer picked and records a transaction.
  const decide = async (loan: Loan, action: "approve" | "reject") => {
    const question =
      action === "approve"
        ? `Approve loan #${loan.id}? ₹ ${Number(loan.sanctionAmount).toLocaleString()} will be added to account #${loan.accountId}.`
        : `Reject loan #${loan.id}?`;

    if (!window.confirm(question)) return;

    setBusyId(loan.id);
    setMessage("");
    setIsError(false);

    try {
      const response = await api.post(`/admin/loans/${loan.id}/${action}`);

      setMessage(readMessage(response.data, `Loan ${action}d.`));
      await fetchLoans();
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage(readErrorMessage(err, `Unable to ${action} the loan.`));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading loans...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <section className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl mt-10">
      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-700">Loans List</h2>

        {message && (
          <p
            className={`mt-2 font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Loan ID</th>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Account ID</th>
              <th className="px-6 py-3 text-left">Loan Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No Loans Available
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{loan.id}</td>

                  <td className="px-6 py-4">{loan.userId}</td>

                  <td className="px-6 py-4">{loan.accountId ?? "-"}</td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹{" "}
                    {Number(loan.sanctionAmount ?? 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <LoanStatusBadge status={loan.status} />
                  </td>

                  <td className="px-6 py-4">
                    {loan.status?.toUpperCase() === "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => decide(loan, "approve")}
                          disabled={busyId === loan.id}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg disabled:opacity-60"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => decide(loan, "reject")}
                          disabled={busyId === loan.id}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoansList;