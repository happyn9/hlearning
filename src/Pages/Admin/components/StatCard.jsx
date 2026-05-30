export default function StatCard({
  title,
  value
}) {

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">

      <p className="text-gray-400">
        {title}
      </p>

      <h2 className="text-2xl font-bold">
        {value}
      </h2>

    </div>
  );
}