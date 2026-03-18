import { Pencil } from "lucide-react";
import type { Course, Role } from "@/lib/types";

type CourseCatalogSectionProps = {
  role: Role;
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onViewCourseDetails: (courseId: string) => void;
  onToggleCourseStatus: (courseId: string, isActive: boolean) => void;
  onDeleteCourse: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => void;
};

export default function CourseCatalogSection({
  role,
  courses,
  onEditCourse,
  onViewCourseDetails,
  onToggleCourseStatus,
  onDeleteCourse,
  onEnrollCourse,
}: CourseCatalogSectionProps) {
  return (
    <section id="course-catalog" className="mt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-2.5 sm:gap-3">
          <h2 className="text-2xl font-medium text-brand-dark sm:text-[28px]">Course Catalog</h2>
          <span className="text-xs text-brand-text-muted">{courses.length} courses</span>
        </div>
          <div className="flex w-full flex-wrap gap-1.5 text-[10px] sm:w-auto sm:gap-2">
          {["All Courses", "Active", "Open Seats", "High Demand", "New"].map((chip, index) => (
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
        {courses.length === 0 ? (
          <div className="w-full rounded-[18px] bg-white p-6 text-sm text-brand-text-muted">
            No courses yet. {role === "admin" ? "Create your first course from Quick Actions." : "Check back after an admin publishes courses."}
          </div>
        ) : courses.map((course) => (
          <article
            key={course.id}
            className="card-cutout relative rounded-3xl border border-black/5 bg-white p-4 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)]"
          >
            {role === "admin" ? (
              <button
                onClick={() => onEditCourse(course)}
                className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-brand-bg text-brand-text-muted"
                title="Edit"
              >
                <Pencil size={13} />
              </button>
            ) : null}
            <div className="mb-3 h-9 w-9 rounded-full bg-zinc-100" />
            <h3 className="text-base font-semibold text-brand-dark line-clamp-1">
              {course.title || `Course ${course.code}`}
            </h3>
            <p className="text-[11px] text-brand-text-muted">Course #{course.code}</p>
            <p className="mt-2 text-[11px] text-brand-text-muted">Capacity {course.capacity}</p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] ${
                  course.is_active ? "bg-brand-neon text-black" : "bg-zinc-100 text-brand-text-muted"
                }`}
              >
                {course.is_active ? "Active" : "Inactive"}
              </span>
              {role === "admin" ? (
                <div className="flex flex-wrap justify-end gap-1 text-[10px]">
                  <button
                    onClick={() => onViewCourseDetails(course.id)}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-brand-text-muted"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onToggleCourseStatus(course.id, !course.is_active)}
                    className="rounded-full bg-brand-dark px-2.5 py-1 text-white"
                  >
                    {course.is_active ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-brand-text-muted"
                  >
                    Del
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onEnrollCourse(course.id)}
                  className="rounded-full bg-brand-dark px-2.5 py-1 text-[10px] text-white"
                >
                  Enroll
                </button>
              )}
            </div>

            <button
              onClick={() => onViewCourseDetails(course.id)}
              className="mt-2 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] text-brand-text-muted"
            >
              Open Details
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
