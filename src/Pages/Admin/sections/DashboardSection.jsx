import StatCard from "../components/StatCard";

export default function DashboardSection() {

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <StatCard
        title="Courses"
        value="12"
      />

      <StatCard
        title="Students"
        value="320"
      />

      <StatCard
        title="Revenue"
        value="$2,400"
      />

    </div>
  );
}