import type {
  User,
  Assignment,
  Submission,
  TeacherReview,
  Mission,
  StudentSummary,
  Class,
} from "../types";

// 목 사용자 데이터
export const mockStudentUser: User = {
  id: "student-1",
  email: "student@test.com",
  name: "김학생",
  role: "student",
  grade: 5,
  classId: "class-1",
};

export const mockTeacherUser: User = {
  id: "teacher-1",
  email: "teacher@test.com",
  name: "이선생",
  role: "teacher",
};

// 목 과제 데이터
export const mockAssignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "동물의 생태 요약하기",
    originalText: `판다는 중국의 산간 지역에 서식하는 곰과 동물입니다. 주로 대나무를 먹고 살아가며, 하루에 약 12~16시간 동안 먹이를 먹습니다. 
    
판다는 검은색과 흰색의 독특한 털 색깔을 가지고 있어서 쉽게 알아볼 수 있습니다. 몸무게는 약 100~150kg 정도이며, 키는 약 1.5m 정도입니다.

현재 판다는 멸종 위기에 처한 동물로 분류되어 있습니다. 서식지 파괴와 낮은 번식률이 주요 원인입니다. 중국 정부는 판다 보호를 위해 여러 보호구역을 만들고 번식 프로그램을 운영하고 있습니다.`,
    instructions:
      "위 글을 읽고 3~4문장으로 요약해보세요. 판다의 특징과 보호 상황을 포함해야 합니다.",
    grade: 5,
    wordLimit: 150,
    sentenceLimit: 4,
    dueDate: "2025-10-30",
    createdAt: "2025-10-20T10:00:00Z",
  },
  {
    id: "assignment-2",
    title: "태양계 행성 설명 요약",
    originalText: `태양계는 태양과 그 주변을 도는 천체들로 이루어진 시스템입니다. 태양계에는 8개의 행성이 있습니다.
    
지구는 태양으로부터 세 번째 행성이며, 물이 존재하는 유일한 행성입니다. 지구의 표면은 약 71%가 바다로 덮여 있습니다.

가장 큰 행성은 목성으로, 지구보다 약 1300배나 큽니다. 목성은 가스로 이루어진 거대한 행성입니다.`,
    instructions: "태양계와 행성의 특징을 3문장으로 요약하세요.",
    grade: 5,
    sentenceLimit: 3,
    dueDate: "2025-11-05",
    createdAt: "2025-10-21T10:00:00Z",
  },
  {
    id: "assignment-3",
    title: "환경 보호의 중요성",
    originalText: `환경 보호는 우리의 미래를 위해 매우 중요합니다. 최근 지구 온난화로 인해 북극의 빙하가 녹고 있으며, 많은 동물들이 서식지를 잃고 있습니다.

플라스틱 쓰레기는 바다를 오염시키고 해양 생물에게 큰 피해를 주고 있습니다. 매년 수백만 톤의 플라스틱이 바다로 흘러들어가고 있습니다.

우리는 일회용품 사용을 줄이고, 재활용을 생활화하며, 에너지를 절약하는 등 작은 실천으로 환경을 보호할 수 있습니다.`,
    instructions:
      "환경 보호가 왜 중요한지, 우리가 할 수 있는 일은 무엇인지 요약하세요.",
    grade: 5,
    sentenceLimit: 4,
    dueDate: "2025-11-10",
    createdAt: "2025-10-22T10:00:00Z",
  },
];

// 목 제출물 데이터
export const mockSubmissions: Submission[] = [
  {
    id: "submission-1",
    assignmentId: "assignment-1",
    studentId: "student-1",
    summaryText:
      "판다는 중국에 사는 곰과 동물로 대나무를 먹고 삽니다. 검은색과 흰색 털을 가지고 있으며 멸종 위기 동물입니다. 중국은 판다를 보호하기 위해 보호구역을 만들고 있습니다.",
    status: "evaluated",
    submittedAt: "2025-10-23T14:30:00Z",
    createdAt: "2025-10-23T14:00:00Z",
  },
];

// 목 첨삭 데이터
export const mockReviews: TeacherReview[] = [
  {
    id: "review-1",
    submissionId: "submission-1",
    teacherId: "teacher-1",
    teacherName: "이선생",
    manualScore: 85,
    comments: `잘 작성했습니다! 판다의 주요 특징을 잘 요약했어요.

👍 좋은 점:
- 판다의 서식지와 식습관을 명확히 표현했어요
- 멸종 위기 상황과 보호 노력을 잘 정리했어요

💡 개선할 점:
- "곰과 동물"보다 "곰과에 속하는 동물" 또는 "대형 포유류"라고 표현하면 더 정확해요
- 문장을 조금 더 자연스럽게 연결하면 좋겠어요`,
    reviewedAt: "2025-10-23T16:00:00Z",
  },
];

// 목 미션 데이터
export const mockMissions: Mission[] = [
  {
    id: "mission-1",
    title: "이번 주 요약 과제 제출하기",
    description: "동물의 생태 요약하기 과제를 제출하세요",
    completed: true,
    dueDate: "2025-10-30",
  },
  {
    id: "mission-2",
    title: "학습 자료 3개 완료하기",
    description: "요약하기 기본 개념 학습을 완료하세요",
    completed: false,
    dueDate: "2025-10-28",
  },
  {
    id: "mission-3",
    title: "첨삭 내용 확인하기",
    description: "선생님의 첨삭을 확인하고 개선점을 체크하세요",
    completed: false,
    dueDate: "2025-10-27",
  },
];

// 학생 점수 데이터
export const mockScores = [78, 82, 85, 80, 88, 85, 90, 87];

// 교사용 학생 목록
export const mockStudents: StudentSummary[] = [
  {
    id: "student-1",
    name: "김학생",
    averageScore: 85,
    submissionCount: 8,
    lastSubmission: "2025-10-23T14:30:00Z",
  },
  {
    id: "student-2",
    name: "이학생",
    averageScore: 78,
    submissionCount: 7,
    lastSubmission: "2025-10-22T10:00:00Z",
  },
  {
    id: "student-3",
    name: "박학생",
    averageScore: 92,
    submissionCount: 10,
    lastSubmission: "2025-10-23T15:00:00Z",
  },
  {
    id: "student-4",
    name: "최학생",
    averageScore: 88,
    submissionCount: 9,
    lastSubmission: "2025-10-21T16:00:00Z",
  },
];

// 반 정보
export const mockClass: Class = {
  id: "class-1",
  name: "5학년 1반",
  grade: 5,
  studentCount: 25,
};
