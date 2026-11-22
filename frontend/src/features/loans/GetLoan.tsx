import { useState } from "react";
import { api, readErrorMessage, readMessage } from "../../services/api";

const GetLoan = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // POST /applyLoan?amount=... - the backend records the loan against the
      // logged-in user, so no account id is needed here.
      const response = await api.post("/applyLoan", null, {
        params: { amount },
      });

      setMessage(readMessage(response.data, "Loan applied successfully."));
      setAmount(0);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(readErrorMessage(error, "Unable to process loan request."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto bg-white shadow-xl rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Loan Application
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium">Loan Amount</label>

          <input
            type="number"
            name="amount"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            min={1}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter Loan Amount"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Apply for Loan"}
        </button>

        {message && (
          <p
            className={`text-center font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
};

export default GetLoan;
