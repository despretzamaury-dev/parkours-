export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  points: number;
  totalXp: number;
  level: number;
  streak: number;
  badges: string[];
  classGroup: string;
}

export interface HomeworkSubmission {
  studentId?: string;
  status: 'todo' | 'submitted' | 'graded';
  submissionText?: string;
  submittedAt?: string;
  grade?: number; // Out of 20
  feedback?: string;
  gradedAt?: string;
}

export interface Homework {
  id: string;
  title: string;
  subject: 'Mathématiques' | 'Physique-Chimie' | 'Français' | 'Anglais' | 'Histoire-Géo' | 'SVT' | 'Maths' | 'Physique' | 'Allemand' | 'Techno' | 'Musique';
  description: string;
  dueDate: string;
  xpReward: number;
  assignedTo: string[]; // student ids or ['all']
  submissions: Record<string, HomeworkSubmission>;
  createdAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  title: string;
  grade: number; // e.g. 17.5
  maxGrade: number; // usually 20
  coeff: number;
  date: string;
  teacherComment: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardTitle: string;
  rewardIcon: string;
  studentId: string;
  studentName: string;
  cost: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  category: 'Privilèges' | 'Bonus' | 'Cadeaux' | 'Activités';
  stock: number;
}

export interface TutorSession {
  id: string;
  date: string;
  durationHours: number;
  remuneration: number;
  reportText: string;
}

export interface TutorSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}
