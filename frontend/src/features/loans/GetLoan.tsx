import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, readErrorMessage, readMessage } from "../../services/api";

interface Account {
  id: number;
  balance?: number;
}

const GetLoan = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // The backend links every loan to one of the user's accounts (the money is
  // credited there once an admin approves it), so load the accounts first.
  useEffect(() => {
    let active = true;

    api
      .get("/my/accounts")
      .then((response) => {
        if (!active) return;
        const list: Account[] = response.data?.accountdtos ?? [];
        setAccounts(list);
        if (list.length === 1) setAccountId(String(list[0].id));
      })
      .catch((error) => {
        if (!active) return;
        setIsError(true);
        setMessage(readErrorMessage(error, "Failed to load your accounts."));
      })
      .finally(() => {
        if (active) setLoadingAccounts(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // POST /applyLoan?accountId=...&amount=... - creates a PENDING loan that
      // an admin approves or rejects later.
      const response = await api.post("/applyLoan", null, {
        params: { accountId, amount },
      });

      setMessage(
        readMessage(response.data, "Loan applied successfully. Waiting for approval.")
      );
      setAmount("");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(readErrorMessage(error, "Unable to process loan request."));
    } finally {
      setLoading(false);
    }
  };

  const noAccounts = !loadingAccounts && accounts.length === 0;

  return (
    <section className="max-w-lg mx-auto bg-white shadow-xl rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Loan Application
      </h2>

      {noAccounts ? (
        <p className="text-center text-gray-600">
          You need an account before you can apply for a loan. Ask an admin to
          open one for you, then check your{" "}
          <Link to="/profile" className="text-blue-700 underline">
            profile
          </Link>
          .
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Account</label>

            <select
              name="accountId"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
              disabled={loadingAccounts}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">
                {loadingAccounts ? "Loading accounts..." : "Select an account"}
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  Account #{account.id}
                  {account.balance !== undefined
                    ? ` - balance ${account.balance}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Loan Amount</label>

            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Loan Amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading || loadingAccounts}
            className="w-full bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Apply for Loan"}
          </button>
        </form>
      )}

      {message && (
        <p
          className={`text-center font-medium mt-5 ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
};

export default GetLoan;