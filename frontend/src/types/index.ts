// 사용자 타입
export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  grade?: number;
  classId?: string;
  profileImageUrl?: string;
}

// 학습 자료
export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  grade: number;
  topic: string;
  orderIndex: number;
}

// 과제
export interface Assignment {
  id: string;
  title: string;
  originalText: string;
  instructions: string;
  grade?: number;
  wordLimit?: number;
  sentenceLimit?: number;
  dueDate?: string;
  createdAt: string;
}

// 제출물
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  summaryText: string;
  status: "draft" | "submitted" | "evaluated";
  submittedAt?: string;
  createdAt: string;
}

// 교사 첨삭
export interface TeacherReview {
  id: string;
  submissionId: string;
  teacherId: string;
  teacherName: string;
  manualScore: number;
  comments: string;
  reviewedAt: string;
}

// 미션
export interface Mission {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

// 통계
export interface Statistics {
  average: number;
  highest: number;
  lowest: number;
  totalSubmissions: number;
}

// 학생 요약 정보
export interface StudentSummary {
  id: string;
  name: string;
  averageScore: number;
  submissionCount: number;
  lastSubmission?: string;
}

// 반 정보
export interface Class {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
}
