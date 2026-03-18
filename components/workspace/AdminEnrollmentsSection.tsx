import type { Course, Enrollment } from "@/lib/types";

type AdminEnrollmentsSectionProps = {
  adminEnrollmentsLoading: boolean;
  adminEnrollmentView: "all" | "course";
  adminEnrollmentCourseId: string;
  courses: Course[];
  enrollmentSearch: string;
  filteredAdminEnrollments: Enrollment[];
  onRefresh: () => void;
  onViewChange: (view: "all" | "course") => void;
  onCourseFilter: (courseId: string) => void;
  onSearchChange: (value: string) => void;
};

export default function AdminEnrollmentsSection({
  adminEnrollmentsLoading,
  adminEnrollmentView,
  adminEnrollmentCourseId,
  courses,
  enrollmentSearch,
  filteredAdminEnrollments,
  onRefresh,
  onViewChange,
  onCourseFilter,
  onSearchChange,
}: AdminEnrollmentsSectionProps) {
  return (
    <section id="admin-enrollments" className="mt-4 rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-brand-dark">Enrollment Management</h3>
          <p className="text-xs text-brand-text-muted">Standalone browsable module for all enrollments and course-specific enrollments.</p>
        </div>
        <button
          onClick={onRefresh}
          className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-brand-text-muted"
        >
          {adminEnrollmentsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => onViewChange("all")}
          className={`rounded-full px-3 py-2 text-xs ${
            adminEnrollmentView === "all" ? "bg-brand-dark text-white" : "bg-zinc-100 text-brand-text-muted"
          }`}
        >
          All Enrollments
        </button>
        <button
          onClick={() => onViewChange("course")}
          className={`rounded-full px-3 py-2 text-xs ${
            adminEnrollmentView === "course" ? "bg-brand-dark text-white" : "bg-zinc-100 text-brand-text-muted"
          }`}
        >
          By Course
        </button>
        <select
          aria-label="Filter enrollments by course"
          value={adminEnrollmentCourseId}
          onChange={(event) => onCourseFilter(event.target.value)}
          className="w-full rounded-full bg-zinc-100 px-3 py-2 text-xs text-brand-text-muted outline-none"
          disabled={adminEnrollmentView !== "course"}
        >
          <option value="">Select course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {(course.title || `Course ${course.code}`).slice(0, 45)}
            </option>
          ))}
        </select>
        <input
          value={enrollmentSearch}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search id / course / date"
          className="w-full rounded-full bg-zinc-100 px-3 py-2 text-xs text-brand-text-muted outline-none"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-[14px] border border-black/5">
        <table className="min-w-170 text-left text-xs sm:min-w-full">
          <thead className="bg-brand-bg text-brand-text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Enrollment ID</th>
              <th className="px-3 py-2 font-medium">Course</th>
              <th className="px-3 py-2 font-medium">Course ID</th>
              <th className="px-3 py-2 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdminEnrollments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-brand-text-muted">
                  {adminEnrollmentView === "course" && !adminEnrollmentCourseId
                    ? "Select a course to load enrollments."
                    : "No enrollments found for current filter."}
                </td>
              </tr>
            ) : (
              filteredAdminEnrollments.map((row) => {
                const matchedCourse = courses.find((course) => course.id === row.course_id);
                return (
                  <tr key={row.id} className="border-t border-black/5 bg-white text-brand-dark">
                    <td className="px-3 py-2">{row.id.slice(0, 8)}...</td>
                    <td className="px-3 py-2">{matchedCourse?.title || `Course ${matchedCourse?.code || "-"}`}</td>
                    <td className="px-3 py-2">{row.course_id.slice(0, 8)}...</td>
                    <td className="px-3 py-2">{new Date(row.created_at).toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
