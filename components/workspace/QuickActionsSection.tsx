import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Course, Role } from "@/lib/types";
import { Input, MetricCard } from "./ui";

type CourseFormState = {
  title: string;
  code: string;
  capacity: string;
  is_active: boolean;
};

type QuickActionsSectionProps = {
  role: Role;
  loading: boolean;
  editingCourseId: string | null;
  courseForm: CourseFormState;
  setCourseForm: Dispatch<SetStateAction<CourseFormState>>;
  activeCourses: Course[];
  courses: Course[];
  onRefresh: () => void;
  onResetCourseForm: () => void;
  onEnrollFirstActive: () => void;
  onSubmitCourseForm: (event: FormEvent<HTMLFormElement>) => void;
};

export default function QuickActionsSection({
  role,
  loading,
  editingCourseId,
  courseForm,
  setCourseForm,
  activeCourses,
  courses,
  onRefresh,
  onResetCourseForm,
  onEnrollFirstActive,
  onSubmitCourseForm,
}: QuickActionsSectionProps) {
  return (
    <section id="quick-actions" className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)] lg:min-h-42">
        <h3 className="text-sm font-semibold text-brand-dark">Quick Actions</h3>
        <p className="mt-1 text-xs text-brand-text-muted">Course and enrollment actions connected directly to the backend.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <button onClick={onRefresh} className="rounded-full bg-brand-dark px-3 py-1.5 text-white hover:opacity-90">Refresh</button>
          {role === "admin" ? (
            <button
              onClick={onResetCourseForm}
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-brand-text-muted"
            >
              Reset Course Form
            </button>
          ) : null}
          {role === "student" && activeCourses[0] ? (
            <button
              onClick={onEnrollFirstActive}
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-brand-text-muted"
            >
              Enroll in First Active Course
            </button>
          ) : null}
        </div>
      </div>

      {role === "admin" ? (
        <div className="rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)] lg:min-h-42">
          <h3 className="text-sm font-semibold text-brand-dark">{editingCourseId ? "Edit Course" : "Create Course"}</h3>
          <form className="mt-3 grid gap-2" onSubmit={onSubmitCourseForm}>
            <Input
              label="Title"
              value={courseForm.title}
              onChange={(value) => setCourseForm((prev) => ({ ...prev, title: value }))}
              placeholder="e.g Product Design"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                label="Code"
                value={courseForm.code}
                onChange={(value) => setCourseForm((prev) => ({ ...prev, code: value }))}
                placeholder="107"
              />
              <Input
                label="Capacity"
                value={courseForm.capacity}
                onChange={(value) => setCourseForm((prev) => ({ ...prev, capacity: value }))}
                placeholder="30"
              />
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-brand-text-muted">
              <input
                id="course-active"
                type="checkbox"
                checked={courseForm.is_active}
                onChange={(event) =>
                  setCourseForm((prev) => ({ ...prev, is_active: event.target.checked }))
                }
              />
              <label htmlFor="course-active">Active</label>
            </div>
            <button disabled={loading} type="submit" className="mt-1 rounded-full bg-brand-dark px-3 py-1.5 text-xs text-white disabled:opacity-60">
              {editingCourseId ? "Save" : "Create"}
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)] lg:min-h-42">
          <h3 className="text-sm font-semibold text-brand-dark">Student Snapshot</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <MetricCard value={String(activeCourses.length)} label="Active" />
            <MetricCard value={String(courses.length)} label="Catalog" />
            <MetricCard value={String(courses.reduce((sum, course) => sum + course.capacity, 0))} label="Seats" />
          </div>
        </div>
      )}
    </section>
  );
}
