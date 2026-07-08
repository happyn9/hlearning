import { BookOpen, Users, DollarSign, Layers } from "lucide-react";

import GanttChart from "../Admin/components/Ganttchart";
import StatCard from "../Admin/components/StatCard";

export default function DashboardSection({ courses, learners, chapters, loading }) {

  const ganttItems = courses.slice(0, 6).map((course, idx) => {
    const courseChapters = chapters.filter((ch) => ch.course_id === course.id);
    const hasChapters = courseChapters.length > 0;
    const progress = hasChapters ? Math.min(100, courseChapters.length * 20) : 0;

    const status = progress >= 100 ? "done" : hasChapters ? "active" : "pending";
    const start = idx;
    const end = start + Math.max(2, Math.min(5, courseChapters.length || 1));

    return {
      id: course.id,
      title: course.title,
      start,
      end,
      progress,
      status,
    };
  });

  const totalUnits = Math.max(8, ...ganttItems.map((i) => i.end + 1), 1);

  return (
    <div className="flex flex-col gap-6">

      <div className="grid md:grid-cols-3 gap-6">

        <StatCard
          title="Courses"
          value={loading ? "…" : courses.length}
          icon={<BookOpen size={18} />}
          accent="lime"
          trend={8.2}
          trendLabel="this month"
          sparkline={[4, 6, 5, 8, 7, 9, courses.length || 9]}
        />

        <StatCard
          title="Students"
          value={loading ? "..." : learners.length}
          icon={<Users size={18} />}
          accent="violet"
          trend={12.4}
          trendLabel="this month"
          sparkline={[180, 210, 240, 260, 290, 305, 320]}
        />

        <StatCard
          title="Revenue"
          value="$2,400"
          icon={<DollarSign size={18} />}
          accent="amber"
          trend={-3.1}
          trendLabel="this month"
          sparkline={[2800, 2650, 2500, 2300, 2350, 2400, 2400]}
        />

      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/8 bg-[#111214]/80 p-6 h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#a3e635]/30 border-t-[#a3e635] animate-spin" />
        </div>
      ) : ganttItems.length > 0 ? (
        <GanttChart items={ganttItems} totalUnits={totalUnits} unitLabel="Week" />
      ) : (
        <div className="rounded-3xl border border-white/8 bg-[#111214]/80 p-10 flex flex-col items-center justify-center text-center gap-2">
          <Layers size={28} className="text-[#6b7280] mb-2" />
          <p className="text-[#e8eaf0] font-medium">No courses yet</p>
          <p className="text-[#6b7280] text-sm">Create your first course to see its timeline here.</p>
        </div>
      )}

    </div>
  );
}