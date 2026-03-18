"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createCourse,
  deleteCourse,
  deregister,
  enroll,
  getCourseById,
  getProfile,
  listCourses,
  listEnrollments,
  listEnrollmentsByCourse,
  login,
  setCourseStatus,
  signup,
  updateCourse,
} from "@/lib/api";
import { SESSION_STORAGE_KEY } from "@/lib/session";
import type { Course, Enrollment, Role, User } from "@/lib/types";

export type AuthMode = "login" | "signup";
export type CourseFormState = {
  title: string;
  code: string;
  capacity: string;
  is_active: boolean;
};

export const initialCourseForm: CourseFormState = {
  title: "",
  code: "",
  capacity: "",
  is_active: true,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function useWorkspaceController() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [message, setMessage] = useState<string>("");

  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "student" as Role,
  });
  const [courseForm, setCourseForm] = useState<CourseFormState>(initialCourseForm);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);
  const [courseDetailsLoading, setCourseDetailsLoading] = useState(false);
  const [adminEnrollmentView, setAdminEnrollmentView] = useState<"all" | "course">("all");
  const [adminEnrollmentCourseId, setAdminEnrollmentCourseId] = useState<string>("");
  const [adminEnrollmentsLoading, setAdminEnrollmentsLoading] = useState(false);
  const [enrollmentSearch, setEnrollmentSearch] = useState("");

  const activeCourses = useMemo(
    () => courses.filter((course) => course.is_active),
    [courses],
  );

  const filteredAdminEnrollments = useMemo(() => {
    const query = enrollmentSearch.trim().toLowerCase();
    if (!query) {
      return enrollments;
    }
    return enrollments.filter((row) => {
      return (
        row.id.toLowerCase().includes(query) ||
        row.course_id.toLowerCase().includes(query) ||
        (row.user_id?.toLowerCase().includes(query) ?? false) ||
        row.created_at.toLowerCase().includes(query)
      );
    });
  }, [enrollments, enrollmentSearch]);

  function scrollToSection(sectionId: string) {
    const target = document.getElementById(sectionId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToSummary() {
    scrollToSection("summary-panel");
  }

  async function hydrateSession(savedToken: string) {
    try {
      setLoading(true);
      const [profile, courseRows] = await Promise.all([
        getProfile(savedToken),
        listCourses(),
      ]);
      setUser(profile);
      setCourses(courseRows);

      if (profile.role === "admin") {
        const rows = await listEnrollments(savedToken);
        setEnrollments(rows);
      } else {
        setEnrollments([]);
      }
    } catch (error) {
      setToken("");
      setUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setMessage(getErrorMessage(error, "Session expired"));
    } finally {
      setLoading(false);
    }
  }

  async function refreshAdminEnrollments(currentToken = token, currentUser = user) {
    if (!currentToken || currentUser?.role !== "admin") {
      return;
    }
    setAdminEnrollmentsLoading(true);
    try {
      if (adminEnrollmentView === "course" && adminEnrollmentCourseId) {
        try {
          const rows = await listEnrollmentsByCourse(currentToken, adminEnrollmentCourseId);
          setEnrollments(rows);
        } catch (error) {
          const detail = getErrorMessage(error, "").toLowerCase();
          if (detail.includes("no enrollment")) {
            setEnrollments([]);
          } else {
            throw error;
          }
        }
      } else {
        const rows = await listEnrollments(currentToken);
        setEnrollments(rows);
      }
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to load enrollments"));
    } finally {
      setAdminEnrollmentsLoading(false);
    }
  }

  async function handleViewCourseDetails(courseId: string, setFeedback = true) {
    try {
      setCourseDetailsLoading(true);
      const course = await getCourseById(courseId);
      setSelectedCourseId(courseId);
      setSelectedCourseDetails(course);
      if (setFeedback) {
        setMessage(`Loaded details for ${course.title || `Course ${course.code}`}.`);
      }
      scrollToSection("course-details");
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to load course details"));
    } finally {
      setCourseDetailsLoading(false);
    }
  }

  async function refreshWorkspace(currentToken = token, currentUser = user) {
    if (!currentToken) {
      return;
    }
    const courseRows = await listCourses();
    setCourses(courseRows);
    if (currentUser?.role === "admin") {
      await refreshAdminEnrollments(currentToken, currentUser);
    }

    if (selectedCourseId) {
      await handleViewCourseDetails(selectedCourseId, false);
    }
  }

  async function handleAdminEnrollmentViewChange(view: "all" | "course") {
    setAdminEnrollmentView(view);
    if (view === "all") {
      setAdminEnrollmentCourseId("");
    }
    if (!token || user?.role !== "admin") {
      return;
    }
    try {
      setAdminEnrollmentsLoading(true);
      if (view === "course" && !adminEnrollmentCourseId) {
        setEnrollments([]);
      } else if (view === "course" && adminEnrollmentCourseId) {
        try {
          const rows = await listEnrollmentsByCourse(token, adminEnrollmentCourseId);
          setEnrollments(rows);
        } catch (error) {
          const detail = getErrorMessage(error, "").toLowerCase();
          if (detail.includes("no enrollment")) {
            setEnrollments([]);
          } else {
            throw error;
          }
        }
      } else {
        const rows = await listEnrollments(token);
        setEnrollments(rows);
      }
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to load enrollments"));
    } finally {
      setAdminEnrollmentsLoading(false);
    }
  }

  async function handleAdminCourseFilter(courseId: string) {
    setAdminEnrollmentCourseId(courseId);
    if (!token || user?.role !== "admin") {
      return;
    }
    if (!courseId) {
      if (adminEnrollmentView === "course") {
        setEnrollments([]);
      } else {
        await refreshAdminEnrollments(token, user);
      }
      return;
    }
    try {
      setAdminEnrollmentsLoading(true);
      try {
        const rows = await listEnrollmentsByCourse(token, courseId);
        setEnrollments(rows);
      } catch (error) {
        const detail = getErrorMessage(error, "").toLowerCase();
        if (detail.includes("no enrollment")) {
          setEnrollments([]);
        } else {
          throw error;
        }
      }
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to filter enrollments"));
    } finally {
      setAdminEnrollmentsLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      setLoading(true);
      const tokenData = await login(loginForm.email, loginForm.password);
      localStorage.setItem(SESSION_STORAGE_KEY, tokenData.access_token);
      setToken(tokenData.access_token);
      await hydrateSession(tokenData.access_token);
      setLoginForm({ email: "", password: "" });
      setMessage("Welcome back. Workspace is ready.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to login"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      setLoading(true);
      await signup({ ...signupForm, role: "student" });
      setAuthMode("login");
      setLoginForm({ email: signupForm.email, password: signupForm.password });
      setSignupForm({
        email: "",
        password: "",
        name: "",
        role: "student",
      });
      setMessage("Account created. Sign in to open your workspace.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to sign up"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      return;
    }

    const courseCode = Number(courseForm.code);
    const courseCapacity = Number(courseForm.capacity);

    if (!Number.isFinite(courseCode) || !Number.isFinite(courseCapacity)) {
      setMessage("Code and capacity must be valid numbers.");
      return;
    }

    const payload = {
      title: courseForm.title,
      code: courseCode,
      capacity: courseCapacity,
      is_active: courseForm.is_active,
    };

    try {
      setLoading(true);
      if (editingCourseId) {
        await updateCourse(token, editingCourseId, payload);
        setMessage("Course updated successfully.");
      } else {
        await createCourse(token, payload);
        setMessage("Course created successfully.");
      }
      setCourseForm(initialCourseForm);
      setEditingCourseId(null);
      await refreshWorkspace(token, user);
    } catch (error) {
      setMessage(getErrorMessage(error, "Course action failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(courseId: string) {
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      await enroll(token, courseId);
      setMessage("Enrollment successful.");
      await refreshWorkspace(token, user);
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to enroll"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeregister(courseId: string) {
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      await deregister(token, courseId);
      setMessage("Deregistered successfully.");
      await refreshWorkspace(token, user);
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to deregister"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCourseStatus(courseId: string, isActive: boolean) {
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      await setCourseStatus(token, courseId, isActive);
      setMessage(`Course ${isActive ? "activated" : "deactivated"}.`);
      await refreshWorkspace(token, user);
    } catch (error) {
      setMessage(getErrorMessage(error, "Status update failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCourse(courseId: string) {
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      await deleteCourse(token, courseId);
      setMessage("Course removed.");
      await refreshWorkspace(token, user);
    } catch (error) {
      setMessage(getErrorMessage(error, "Delete failed"));
    } finally {
      setLoading(false);
    }
  }

  function beginEditCourse(course: Course) {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title ?? "",
      code: String(course.code),
      capacity: String(course.capacity),
      is_active: course.is_active,
    });
  }

  function closeCourseDetails() {
    setSelectedCourseId(null);
    setSelectedCourseDetails(null);
  }

  function resetCourseForm() {
    setEditingCourseId(null);
    setCourseForm(initialCourseForm);
  }

  function handlePrimaryAction() {
    if (user?.role === "admin") {
      resetCourseForm();
      scrollToSection("quick-actions");
      return;
    }
    scrollToSection("learning-queue");
  }

  function focusCourseEnrollments(courseId: string) {
    setAdminEnrollmentView("course");
    setAdminEnrollmentCourseId(courseId);
    void handleAdminCourseFilter(courseId);
    scrollToSection("admin-enrollments");
  }

  function logout() {
    setToken("");
    setUser(null);
    setCourses([]);
    setEnrollments([]);
    setMessage("Signed out.");
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) {
      setSessionChecked(true);
      return;
    }
    setToken(saved);
    void (async () => {
      await hydrateSession(saved);
      setSessionChecked(true);
    })();
  }, []);

  return {
    authMode,
    setAuthMode,
    loading,
    sessionChecked,
    message,
    token,
    user,
    courses,
    enrollments,
    loginForm,
    setLoginForm,
    signupForm,
    setSignupForm,
    courseForm,
    setCourseForm,
    editingCourseId,
    selectedCourseDetails,
    courseDetailsLoading,
    adminEnrollmentView,
    adminEnrollmentCourseId,
    adminEnrollmentsLoading,
    enrollmentSearch,
    setEnrollmentSearch,
    activeCourses,
    filteredAdminEnrollments,
    handleLogin,
    handleSignup,
    handleCreateOrUpdateCourse,
    handleEnroll,
    handleDeregister,
    handleCourseStatus,
    handleDeleteCourse,
    beginEditCourse,
    handleViewCourseDetails,
    closeCourseDetails,
    handleAdminEnrollmentViewChange,
    handleAdminCourseFilter,
    refreshWorkspace,
    refreshAdminEnrollments,
    scrollToSection,
    scrollToSummary,
    logout,
    resetCourseForm,
    handlePrimaryAction,
    focusCourseEnrollments,
  };
}
