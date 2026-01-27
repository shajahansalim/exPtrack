export default function Summary({ total }) {
  return (
    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center shadow-sm">
      <p className="text-sm text-gray-600">Total Spent</p>
      <p className="text-3xl font-bold text-blue-700 mt-1">
        ₹ {total}
      </p>
    </div>
  );
}
