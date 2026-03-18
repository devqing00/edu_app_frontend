import type { Course, Role } from "@/lib/types";
import { DetailPill } from "./ui";

type CourseDetailsSectionProps = {
  role: Role;
  course: Course;
  loading: boolean;
  onRefresh: () => void;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onViewEnrollmentsForCourse: () => void;
  onEnroll: () => void;
  onDeregister: () => void;
};

export default function CourseDetailsSection({
  role,
  course,
  loading,
  onRefresh,
  onClose,
  onEdit,
  onToggleStatus,
  onViewEnrollmentsForCourse,
  onEnroll,
  onDeregister,
}: CourseDetailsSectionProps) {
  return (
    <section id="course-details" className="mt-4 rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-brand-dark">Course Details</h3>
          <p className="text-xs text-brand-text-muted">Dedicated details view powered by GET /courses/{'{id}'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-brand-text-muted"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-brand-text-muted"
          >
            Close
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailPill label="Title" value={course.title || "Untitled Course"} />
        <DetailPill label="Code" value={String(course.code)} />
        <DetailPill label="Capacity" value={String(course.capacity)} />
        <DetailPill label="Status" value={course.is_active ? "Active" : "Inactive"} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {role === "admin" ? (
          <>
            <button
              onClick={onEdit}
              className="rounded-full bg-brand-dark px-3 py-1.5 text-xs text-white"
            >
              Edit Course
            </button>
            <button
              onClick={onToggleStatus}
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-brand-text-muted"
            >
              {course.is_active ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={onViewEnrollmentsForCourse}
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-brand-text-muted"
            >
              View Enrollments For Course
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEnroll}
              className="rounded-full bg-brand-dark px-3 py-1.5 text-xs text-white"
            >
              Enroll in This Course
            </button>
            <button
              onClick={onDeregister}
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-brand-text-muted"
            >
              Deregister
            </button>
          </>
        )}
      </div>
    </section>
  );
}
