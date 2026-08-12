import {
  User,
  Task,
  Project,
  Label,
  Subtask,
  Comment,
  TaskFilters,
  TaskStatus,
  Priority,
  ProjectPriority,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ablespace_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const authApi = {
  guestLogin: async (name?: string): Promise<{ accessToken: string; user: User }> => {
    const res = await fetcher<{ accessToken: string; user: User }>('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (typeof window !== 'undefined' && res.accessToken) {
      localStorage.setItem('ablespace_token', res.accessToken);
      localStorage.setItem('ablespace_user', JSON.stringify(res.user));
    }
    return res;
  },
};

export const usersApi = {
  getProfile: async (): Promise<User> => fetcher<User>('/users/me'),
  getAllUsers: async (): Promise<User[]> => fetcher<User[]>('/users'),
  updateProfile: async (data: Partial<User>): Promise<User> =>
    fetcher<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  leaveWorkspace: async (): Promise<User> =>
    fetcher<User>('/users/me/leave-workspace', {
      method: 'POST',
    }),
};

export const tasksApi = {
  getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetcher<Task[]>(`/tasks${queryString}`);
  },

  getTaskById: async (id: string): Promise<Task> => fetcher<Task>(`/tasks/${id}`),

  createTask: async (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    dueDate?: string;
    team?: string;
    resources?: string;
    projectId?: string;
    reporterId?: string;
    memberIds?: string[];
    labelIds?: string[];
  }): Promise<Task> =>
    fetcher<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTask: async (id: string, data: Partial<Task> & { memberIds?: string[]; labelIds?: string[] }): Promise<Task> =>
    fetcher<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteTask: async (id: string): Promise<Task> =>
    fetcher<Task>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

export const subtasksApi = {
  createSubtask: async (data: {
    title: string;
    taskId: string;
    completed?: boolean;
    priority?: Priority;
    dueDate?: string;
    assigneeId?: string;
  }): Promise<Subtask> =>
    fetcher<Subtask>('/subtasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSubtask: async (id: string, data: Partial<Subtask>): Promise<Subtask> =>
    fetcher<Subtask>(`/subtasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteSubtask: async (id: string): Promise<Subtask> =>
    fetcher<Subtask>(`/subtasks/${id}`, {
      method: 'DELETE',
    }),
};

export const commentsApi = {
  getCommentsByTask: async (taskId: string): Promise<Comment[]> =>
    fetcher<Comment[]>(`/comments?taskId=${taskId}`),

  createComment: async (data: { content: string; taskId: string; authorId: string }): Promise<Comment> =>
    fetcher<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => fetcher<Project[]>('/projects'),

  getProjectById: async (id: string): Promise<Project> => fetcher<Project>(`/projects/${id}`),

  createProject: async (data: {
    name: string;
    description?: string;
    priority?: ProjectPriority;
    leadId?: string;
    dueDate?: string;
  }): Promise<Project> =>
    fetcher<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> =>
    fetcher<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProject: async (id: string): Promise<Project> =>
    fetcher<Project>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

export const labelsApi = {
  getLabels: async (): Promise<Label[]> => fetcher<Label[]>('/labels'),
};
