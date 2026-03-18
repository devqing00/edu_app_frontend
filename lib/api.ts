import type { Course, Enrollment, Role, TokenResponse, User } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const json = await response.json();
      detail = json.detail ?? detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function signup(payload: {
  email: string;
  password: string;
  name: string;
  role: Role;
}) {
  return request<{ message: string; username: string }>("/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams({
    username: email,
    password,
  });

  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = `Login failed (${response.status})`;
    try {
      const json = await response.json();
      detail = json.detail ?? detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }

  return (await response.json()) as TokenResponse;
}

export async function getProfile(token: string) {
  return request<User>("/users/me", { method: "GET" }, token);
}

export async function listCourses() {
  return request<Course[]>("/courses", { method: "GET" });
}

export async function getCourseById(courseId: string) {
  return request<Course>(`/courses/${courseId}`, { method: "GET" });
}

export async function createCourse(
  token: string,
  payload: Pick<Course, "title" | "code" | "capacity" | "is_active">,
) {
  return request<Course>(
    "/courses",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function updateCourse(
  token: string,
  courseId: string,
  payload: Pick<Course, "title" | "code" | "capacity" | "is_active">,
) {
  return request<Course>(
    `/courses/${courseId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function setCourseStatus(
  token: string,
  courseId: string,
  is_active: boolean,
) {
  return request<Course>(
    `/courses/${courseId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ is_active }),
    },
    token,
  );
}

export async function deleteCourse(token: string, courseId: string) {
  return request<void>(
    `/courses/${courseId}`,
    {
      method: "DELETE",
    },
    token,
  );
}

export async function enroll(token: string, course_id: string) {
  return request<Enrollment>(
    "/enrollments",
    {
      method: "POST",
      body: JSON.stringify({ course_id }),
    },
    token,
  );
}

export async function deregister(token: string, courseId: string) {
  return request<void>(
    `/enrollments/course/${courseId}`,
    {
      method: "DELETE",
    },
    token,
  );
}

export async function listEnrollments(token: string) {
  return request<Enrollment[]>("/enrollments", { method: "GET" }, token);
}

export async function listEnrollmentsByCourse(token: string, courseId: string) {
  return request<Enrollment[]>(`/enrollments/by-course/${courseId}`, { method: "GET" }, token);
}
