# 🎨 SummaryWrite Frontend 설계

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Emotion** - CSS-in-JS 스타일링
- **Zustand** - 전역 상태 관리
- **React Query** - 서버 상태 관리
- **React Router** - 라우팅

---

## 🗂️ 컴포넌트 구조

### 1. 공통 컴포넌트 (`/components/common`)

```typescript
// Button.tsx
export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Input.tsx
export interface InputProps {
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Card.tsx - 카드 컨테이너
// Modal.tsx - 모달 대화상자
// Spinner.tsx - 로딩 스피너
// Alert.tsx - 알림 메시지
// Badge.tsx - 뱃지 (점수, 상태 표시)
```

### 2. 학습 모듈 컴포넌트 (`/components/learning`)

```typescript
// LearningCard.tsx - 학습 자료 카드
export interface LearningCardProps {
  material: LearningMaterial;
  progress?: number;
  onStart: () => void;
}

// ConceptSection.tsx - 개념 학습 섹션
// ExampleViewer.tsx - 예제 뷰어
// QuizComponent.tsx - 퀴즈 컴포넌트
export interface QuizComponentProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswer: (index: number) => void;
}

// ProgressTracker.tsx - 학습 진도 표시
```

### 3. 글쓰기 모듈 컴포넌트 (`/components/writing`)

```typescript
// WritingEditor.tsx - 글쓰기 에디터
export interface WritingEditorProps {
  originalText: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  sentenceLimit?: number;
}

// OriginalTextViewer.tsx - 원본 지문 뷰어
export interface OriginalTextViewerProps {
  text: string;
  highlights?: Array<{ start: number; end: number; type: string }>;
}

// CharacterCounter.tsx - 글자 수 카운터
export interface CharacterCounterProps {
  current: number;
  max?: number;
  sentenceCount: number;
}

// SentenceHelper.tsx - 문장 구조 도우미
// DraftHistory.tsx - 작성 기록
```

### 4. 평가 모듈 컴포넌트 (`/components/evaluation`)

```typescript
// ScoreDisplay.tsx - 점수 표시
export interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  label?: string;
}

// ReviewComment.tsx - 첨삭 코멘트
export interface ReviewCommentProps {
  comment: string;
  author: string;
  createdAt: string;
  highlights?: any;
}

// SubmissionHistory.tsx - 제출 이력
// ComparisonView.tsx - 원본-요약문 비교 뷰
```

### 5. 대시보드 컴포넌트 (`/components/dashboard`)

```typescript
// StudentDashboard.tsx - 학생 대시보드
export interface StudentDashboardProps {
  student: User;
  missions: Mission[];
  recentScores: number[];
  statistics: Statistics;
}

// TeacherDashboard.tsx - 교사 대시보드
export interface TeacherDashboardProps {
  teacher: User;
  class: Class;
  students: StudentSummary[];
  pendingReviews: number;
}

// ScoreChart.tsx - 점수 그래프
export interface ScoreChartProps {
  scores: Array<{ date: string; score: number }>;
  height?: number;
}

// MissionCard.tsx - 미션 카드
// StudentList.tsx - 학생 목록
// WeeklyReport.tsx - 주간 리포트
```

---

## 🏪 상태 관리 (Zustand)

### 1. Auth Store (`/store/authStore.ts`)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  login: async (email, password) => {
    const response = await authApi.login(email, password);
    set({ user: response.user, token: response.token, isAuthenticated: true });
    localStorage.setItem("token", response.token);
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("token");
  },

  // ... 기타 메서드
}));
```

### 2. Writing Store (`/store/writingStore.ts`)

```typescript
interface WritingState {
  currentAssignment: Assignment | null;
  draftText: string;
  autoSaveEnabled: boolean;

  setAssignment: (assignment: Assignment) => void;
  updateDraft: (text: string) => void;
  saveDraft: () => Promise<void>;
  submitSummary: () => Promise<void>;
  clearDraft: () => void;
}

export const useWritingStore = create<WritingState>((set, get) => ({
  currentAssignment: null,
  draftText: "",
  autoSaveEnabled: true,

  updateDraft: (text) => {
    set({ draftText: text });
    // 자동 저장 로직
    if (get().autoSaveEnabled) {
      debounce(() => get().saveDraft(), 1000)();
    }
  },

  // ... 기타 메서드
}));
```

### 3. UI Store (`/store/uiStore.ts`)

```typescript
interface UIState {
  sidebarOpen: boolean;
  modalStack: Modal[];
  notifications: Notification[];
  theme: "light" | "dark";

  toggleSidebar: () => void;
  openModal: (modal: Modal) => void;
  closeModal: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}
```

---

## 🔄 React Query 사용

### 쿼리 키 관리 (`/services/queryKeys.ts`)

```typescript
export const queryKeys = {
  // 학습
  learning: {
    all: ["learning"] as const,
    materials: (grade?: number) => ["learning", "materials", grade] as const,
    progress: (studentId: string) =>
      ["learning", "progress", studentId] as const,
  },

  // 글쓰기
  writing: {
    all: ["writing"] as const,
    assignments: (classId?: string) =>
      ["writing", "assignments", classId] as const,
    submissions: (studentId: string) =>
      ["writing", "submissions", studentId] as const,
  },

  // 평가
  evaluation: {
    results: (studentId: string, dateRange?: DateRange) =>
      ["evaluation", "results", studentId, dateRange] as const,
  },

  // 대시보드
  dashboard: {
    student: (studentId: string) =>
      ["dashboard", "student", studentId] as const,
    teacher: (teacherId: string) =>
      ["dashboard", "teacher", teacherId] as const,
  },
};
```

### Custom Hooks (`/hooks`)

```typescript
// useAssignments.ts
export function useAssignments(classId?: string) {
  return useQuery({
    queryKey: queryKeys.writing.assignments(classId),
    queryFn: () => writingApi.getAssignments(classId),
  });
}

// useSubmitSummary.ts
export function useSubmitSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitSummaryData) => writingApi.submitSummary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.writing.all });
    },
  });
}

// useLearningProgress.ts
export function useLearningProgress(studentId: string) {
  return useQuery({
    queryKey: queryKeys.learning.progress(studentId),
    queryFn: () => learningApi.getProgress(studentId),
  });
}

// useStudentDashboard.ts
export function useStudentDashboard() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.dashboard.student(user!.id),
    queryFn: () => dashboardApi.getStudentData(),
    enabled: !!user && user.role === "student",
  });
}
```

---

## 🎨 스타일링 (Emotion)

### 테마 설정 (`/styles/theme.ts`)

```typescript
export const theme = {
  colors: {
    primary: "#4A90E2",
    secondary: "#7B68EE",
    success: "#50C878",
    warning: "#FFB347",
    error: "#FF6B6B",

    text: {
      primary: "#2C3E50",
      secondary: "#7F8C8D",
      light: "#BDC3C7",
    },

    background: {
      main: "#FFFFFF",
      secondary: "#F8F9FA",
      dark: "#2C3E50",
    },

    border: "#E1E8ED",
  },

  typography: {
    fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "24px",
      xxl: "32px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 20px rgba(0, 0, 0, 0.15)",
  },

  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },
};

export type Theme = typeof theme;
```

### 공통 스타일 컴포넌트

```typescript
// Flex Layout
export const Flex = styled.div<{
  direction?: "row" | "column";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  gap?: keyof Theme["spacing"];
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "stretch"};
  gap: ${(props) => (props.gap ? props.theme.spacing[props.gap] : 0)};
`;

// Container
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.lg};
`;
```

---

## 📱 페이지 구조

```typescript
// /pages/StudentPage.tsx - 학생 메인 페이지
// /pages/TeacherPage.tsx - 교사 메인 페이지
// /pages/LearningPage.tsx - 학습 페이지
// /pages/WritingPage.tsx - 글쓰기 페이지
// /pages/EvaluationPage.tsx - 평가 조회 페이지
// /pages/LoginPage.tsx - 로그인 페이지
// /pages/SignupPage.tsx - 회원가입 페이지
```

### 라우터 설정 (`App.tsx`)

```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute role="student" />}>
              <Route path="/student" element={<StudentPage />} />
              <Route path="/learning/:materialId" element={<LearningPage />} />
              <Route path="/writing/:assignmentId" element={<WritingPage />} />
              <Route path="/evaluation" element={<EvaluationPage />} />
            </Route>

            <Route element={<ProtectedRoute role="teacher" />}>
              <Route path="/teacher" element={<TeacherPage />} />
              <Route
                path="/teacher/review/:submissionId"
                element={<ReviewPage />}
              />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

---

## 🔐 인증 처리

```typescript
// ProtectedRoute.tsx
export function ProtectedRoute({ role }: { role: "student" | "teacher" }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
```

---

## 🧪 테스트 전략

### Vitest 단위 테스트

- 컴포넌트별 렌더링 테스트
- Store 로직 테스트
- Custom Hook 테스트

### Playwright E2E 테스트

- 학생 로그인 → 과제 제출 플로우
- 교사 로그인 → 첨삭 플로우
- 학습 자료 진행 플로우

---

## 📦 주요 유틸리티

```typescript
// /utils/validation.ts - 폼 검증
// /utils/formatting.ts - 날짜, 숫자 포맷팅
// /utils/storage.ts - LocalStorage 래퍼
// /utils/textAnalysis.ts - 텍스트 분석 (글자 수, 문장 수 등)
```
