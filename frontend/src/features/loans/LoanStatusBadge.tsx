const styles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

/** Coloured label for a loan status: PENDING, APPROVED or REJECTED. */
const LoanStatusBadge = ({ status }: { status?: string }) => {
  const value = status?.toUpperCase();

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        (value && styles[value]) || "bg-gray-100 text-gray-600"
      }`}
    >
      {value ?? "N/A"}
    </span>
  );
};

export default LoanStatusBadge;
