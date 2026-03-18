import { Circle, Pencil } from "lucide-react";
import type { Course, Role } from "@/lib/types";

type LearningQueueSectionProps = {
  role: Role;
  activeCourses: Course[];
  onEditCourse: (course: Course) => void;
  onDeregisterCourse: (courseId: string) => void;
};

export default function LearningQueueSection({
  role,
  activeCourses,
  onEditCourse,
  onDeregisterCourse,
}: LearningQueueSectionProps) {
  return (
    <section id="learning-queue" className="mt-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-2.5 sm:gap-3">
          <h2 className="text-2xl font-medium text-brand-dark sm:text-[28px]">Learning Queue</h2>
          <span className="text-xs text-brand-text-muted">{activeCourses.length} course actions</span>
        </div>
        <div className="flex w-full flex-wrap gap-1.5 text-[10px] sm:w-auto sm:gap-2">
          {["All", "Due Today", "Enrolled", "In Progress", "Completed"].map((chip, index) => (
            <span
              key={chip}
              className={`whitespace-nowrap rounded-full px-3 py-1 ${
                index === 0 ? "bg-white text-brand-dark" : "text-brand-text-muted"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-3 pb-2 pt-1 sm:grid-cols-2 xl:grid-cols-3">
        {activeCourses.length === 0 ? (
          <div className="w-full rounded-[18px] bg-white p-6 text-sm text-brand-text-muted">
            No active courses available right now.
          </div>
        ) : activeCourses.slice(0, 4).map((course, index) => (
          <article
            key={`task-${course.id}`}
            className={`card-cutout relative rounded-3xl border border-black/5 p-4 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)] ${
              index === 0 ? "bg-brand-neon" : "bg-white"
            }`}
          >
            <button
              className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full ${
                index === 0 ? "bg-brand-neon/40" : "bg-brand-bg"
              }`}
              onClick={() => (role === "admin" ? onEditCourse(course) : onDeregisterCourse(course.id))}
              title="Quick action"
            >
              {index === 0 ? <Pencil size={13} /> : <Circle size={13} />}
            </button>
            <div className="mb-2 flex items-center gap-2 text-[11px] text-brand-dark/75">
              <span className="rounded-full bg-white/70 px-2 py-0.5">Module</span>
              <span>{course.code}</span>
            </div>
            <h3 className="text-[24px] font-medium leading-tight text-brand-dark line-clamp-2">
              {course.title || `Course ${course.code}`}
            </h3>
            <p className="mt-1 text-xs text-brand-dark/70">Capacity {course.capacity} • {course.is_active ? "Active" : "Inactive"}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 text-[10px] text-brand-dark/70">
              <span>{new Date().toLocaleDateString()}</span>
              {role === "student" ? (
                <button
                  onClick={() => onDeregisterCourse(course.id)}
                  className="rounded-full bg-black/90 px-3 py-1 text-white"
                >
                  Deregister
                </button>
              ) : (
                <button
                  onClick={() => onEditCourse(course)}
                  className="rounded-full bg-black/90 px-3 py-1 text-white"
                >
                  Edit
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
