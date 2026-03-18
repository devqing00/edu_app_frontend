"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkspaceLayout, { type WorkspaceView } from "./WorkspaceLayout";
import CourseCatalogSection from "./CourseCatalogSection";
import CourseDetailsSection from "./CourseDetailsSection";
import LearningQueueSection from "./LearningQueueSection";
import QuickActionsSection from "./QuickActionsSection";
import AdminEnrollmentsSection from "./AdminEnrollmentsSection";
import SummaryPanels from "./SummaryPanels";
import useWorkspaceController from "./useWorkspaceController";

type WorkspaceAppProps = {
  view: WorkspaceView;
  forceAdmin?: boolean;
};

function DashboardSummaryLinks({ isAdmin }: { isAdmin: boolean }) {
  const baseRoute = isAdmin ? "/admin" : "";
  const cards = [
    {
      title: "Courses",
      description: "Browse and manage course catalog",
      href: `${baseRoute}/courses`,
    },
    {
      title: "Actions",
      description: "Daily queue and quick actions",
      href: `${baseRoute}/actions`,
    },
    {
      title: "Enrollments",
      description: isAdmin
        ? "View and filter all enrollments"
        : "Track your learning activity",
      href: `${baseRoute}/enrollments`,
    },
  ];

  return (
    <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)] transition hover:-translate-y-px"
        >
          <h3 className="text-base font-semibold text-brand-dark">{card.title}</h3>
          <p className="mt-2 text-sm text-brand-text-muted">{card.description}</p>
        </Link>
      ))}
    </section>
  );
}

export default function WorkspaceApp({ view, forceAdmin = false }: WorkspaceAppProps) {
  const controller = useWorkspaceController();
  const router = useRouter();
  const selectedCourse = controller.selectedCourseDetails;

  useEffect(() => {
    if (!controller.sessionChecked) {
      return;
    }

    if (controller.loading) {
      return;
    }

    if (!controller.user) {
      router.replace(forceAdmin ? "/admin/login" : "/auth");
      return;
    }

    if (forceAdmin && controller.user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [controller.sessionChecked, controller.loading, controller.user, forceAdmin, router]);

  if (!controller.sessionChecked || controller.loading || !controller.user) {
    return (
      <div className="min-h-screen grid place-items-center bg-brand-bg text-brand-text-muted">
        Loading workspace...
      </div>
    );
  }

  return (
    <WorkspaceLayout
      currentView={view}
      userNameOrEmail={controller.user.name || controller.user.email}
      userRole={controller.user.role}
      coursesCount={controller.courses.length}
      enrollmentsCount={controller.enrollments.length}
      totalSeats={controller.courses.reduce((sum, course) => sum + course.capacity, 0)}
      message={controller.message}
      onRefresh={() => controller.refreshWorkspace(controller.token, controller.user)}
      onSummary={controller.scrollToSummary}
      onLogout={controller.logout}
      onNewAction={() => {
        const actionsRoute = controller.user?.role === "admin" ? "/admin/actions" : "/actions";
        if (view === "actions") {
          controller.handlePrimaryAction();
          return;
        }
        router.push(actionsRoute);
      }}
    >
      {view === "dashboard" ? (
        <DashboardSummaryLinks isAdmin={controller.user.role === "admin"} />
      ) : null}

      {view === "courses" ? (
        <>
          <CourseCatalogSection
            role={controller.user.role}
            courses={controller.courses}
            onEditCourse={controller.beginEditCourse}
            onViewCourseDetails={controller.handleViewCourseDetails}
            onToggleCourseStatus={controller.handleCourseStatus}
            onDeleteCourse={controller.handleDeleteCourse}
            onEnrollCourse={controller.handleEnroll}
          />

          {selectedCourse ? (
            <CourseDetailsSection
              role={controller.user.role}
              course={selectedCourse}
              loading={controller.courseDetailsLoading}
              onRefresh={() => controller.handleViewCourseDetails(selectedCourse.id, false)}
              onClose={controller.closeCourseDetails}
              onEdit={() => controller.beginEditCourse(selectedCourse)}
              onToggleStatus={() =>
                controller.handleCourseStatus(selectedCourse.id, !selectedCourse.is_active)
              }
              onViewEnrollmentsForCourse={() => controller.focusCourseEnrollments(selectedCourse.id)}
              onEnroll={() => controller.handleEnroll(selectedCourse.id)}
              onDeregister={() => controller.handleDeregister(selectedCourse.id)}
            />
          ) : null}
        </>
      ) : null}

      {view === "actions" ? (
        <>
          <LearningQueueSection
            role={controller.user.role}
            activeCourses={controller.activeCourses}
            onEditCourse={controller.beginEditCourse}
            onDeregisterCourse={controller.handleDeregister}
          />

          <QuickActionsSection
            role={controller.user.role}
            loading={controller.loading}
            editingCourseId={controller.editingCourseId}
            courseForm={controller.courseForm}
            setCourseForm={controller.setCourseForm}
            activeCourses={controller.activeCourses}
            courses={controller.courses}
            onRefresh={() => controller.refreshWorkspace(controller.token, controller.user)}
            onResetCourseForm={controller.resetCourseForm}
            onEnrollFirstActive={() => {
              if (controller.activeCourses[0]) {
                void controller.handleEnroll(controller.activeCourses[0].id);
              }
            }}
            onSubmitCourseForm={controller.handleCreateOrUpdateCourse}
          />
        </>
      ) : null}

      {view === "enrollments" ? (
        controller.user.role === "admin" ? (
          <AdminEnrollmentsSection
            adminEnrollmentsLoading={controller.adminEnrollmentsLoading}
            adminEnrollmentView={controller.adminEnrollmentView}
            adminEnrollmentCourseId={controller.adminEnrollmentCourseId}
            courses={controller.courses}
            enrollmentSearch={controller.enrollmentSearch}
            filteredAdminEnrollments={controller.filteredAdminEnrollments}
            onRefresh={() => controller.refreshAdminEnrollments(controller.token, controller.user)}
            onViewChange={controller.handleAdminEnrollmentViewChange}
            onCourseFilter={(courseId) => {
              void controller.handleAdminCourseFilter(courseId);
            }}
            onSearchChange={controller.setEnrollmentSearch}
          />
        ) : (
          <section className="mt-5 rounded-3xl border border-black/5 bg-white p-5 text-brand-text-muted shadow-[0_10px_36px_-20px_rgba(0,0,0,0.2)]">
            Enrollment management is available for admins. Use Courses and Actions to manage your own learning flow.
          </section>
        )
      ) : null}

      <SummaryPanels
        userLabel={controller.user.name || controller.user.email}
        userRole={controller.user.role}
        enrollmentCount={controller.enrollments.length}
        onRefresh={() => controller.refreshWorkspace(controller.token, controller.user)}
        onLogout={controller.logout}
      />
    </WorkspaceLayout>
  );
}
