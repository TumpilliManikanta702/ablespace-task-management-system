export type TaskStatus = 'TO_DO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';

export type Priority = 'NO_PRIORITY' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ColorMode = 'blue' | 'amber' | 'pink' | 'rose' | 'emerald' | 'black';

export type ThemeMode = 'light' | 'dark';

export type ViewMode = 'board' | 'list';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  title?: string;
  username: string;
  theme?: ThemeMode;
  colorMode?: ColorMode;
  isGuest?: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface TaskMember {
  taskId: string;
  userId: string;
  user: User;
}

export interface TaskLabel {
  taskId: string;
  labelId: string;
  label: Label;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority;
  dueDate?: string;
  taskId: string;
  assigneeId?: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  priority: ProjectPriority;
  leadId?: string;
  lead?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  team?: string;
  resources?: string;
  projectId?: string;
  project?: Project;
  reporterId?: string;
  reporter?: User;
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[];
  comments?: Comment[];
  members?: TaskMember[];
  labels?: TaskLabel[];
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: Priority;
  memberId?: string;
  labelId?: string;
  projectId?: string;
  team?: string;
}

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
  team: boolean;
}
