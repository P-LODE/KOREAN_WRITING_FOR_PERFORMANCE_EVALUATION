# 🗄️ SummaryWrite 데이터베이스 스키마

## 데이터베이스: PostgreSQL (Supabase)

---

## 테이블 구조

### 1. users (사용자)

학생과 교사 정보를 저장합니다.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  grade INTEGER CHECK (grade >= 1 AND grade <= 6), -- 초등학교 학년 (학생만)
  class_id UUID REFERENCES classes(id), -- 소속 반 (학생만)
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_class_id ON users(class_id);
```

---

### 2. classes (학급)

학급 정보를 저장합니다.

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- 예: "5학년 1반"
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 6),
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  school_name VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_grade ON classes(grade);
```

---

### 3. learning_materials (학습 자료)

학습 콘텐츠를 저장합니다.

```sql
CREATE TABLE learning_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- 학습 내용, 예제 등
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 6),
  topic VARCHAR(50) NOT NULL, -- 'summary', 'main-idea', 'structure' 등
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  order_index INTEGER DEFAULT 0, -- 순서
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_learning_materials_grade ON learning_materials(grade);
CREATE INDEX idx_learning_materials_topic ON learning_materials(topic);
CREATE INDEX idx_learning_materials_is_published ON learning_materials(is_published);
```

**JSONB content 예시:**

```json
{
  "sections": [
    {
      "type": "text",
      "content": "요약은 긴 글의 핵심 내용을..."
    },
    {
      "type": "quiz",
      "question": "다음 중 요약의 핵심은?",
      "options": ["A", "B", "C"],
      "answer": 0
    }
  ],
  "examples": [...],
  "exercises": [...]
}
```

---

### 4. learning_progress (학습 진도)

학생의 학습 진도를 추적합니다.

```sql
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES learning_materials(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  time_spent_minutes INTEGER DEFAULT 0, -- 소요 시간 (분)
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, material_id)
);

CREATE INDEX idx_learning_progress_student_id ON learning_progress(student_id);
CREATE INDEX idx_learning_progress_material_id ON learning_progress(material_id);
```

---

### 5. assignments (과제)

교사가 내는 글쓰기 과제를 저장합니다.

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  original_text TEXT NOT NULL, -- 원본 지문
  instructions TEXT NOT NULL, -- 과제 지시사항
  grade INTEGER CHECK (grade >= 1 AND grade <= 6),
  class_id UUID REFERENCES classes(id), -- NULL이면 전체 공개
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  word_limit INTEGER, -- 단어 수 제한
  sentence_limit INTEGER, -- 문장 수 제한
  due_date TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_created_by ON assignments(created_by);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
```

---

### 6. submissions (제출물)

학생이 제출한 요약문을 저장합니다.

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL, -- 학생이 작성한 요약문
  draft_history JSONB, -- 작성 과정 저장 (선택)
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'evaluated')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
```

**JSONB draft_history 예시:**

```json
{
  "versions": [
    {
      "text": "판다는...",
      "timestamp": "2025-10-23T10:30:00Z"
    }
  ]
}
```

---

### 7. teacher_reviews (교사 첨삭)

교사의 추가 첨삭을 저장합니다.

```sql
CREATE TABLE teacher_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  manual_score INTEGER CHECK (manual_score >= 0 AND manual_score <= 100),
  comments TEXT,
  highlights JSONB, -- 강조 표시한 부분
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, teacher_id)
);

CREATE INDEX idx_teacher_reviews_submission_id ON teacher_reviews(submission_id);
CREATE INDEX idx_teacher_reviews_teacher_id ON teacher_reviews(teacher_id);
```

---

### 8. weekly_reports (주간 리포트)

주간 학습 리포트를 저장합니다.

```sql
CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_submissions INTEGER DEFAULT 0,
  average_score DECIMAL(5, 2),
  learning_time_minutes INTEGER DEFAULT 0,
  strengths JSONB, -- 강점
  improvements JSONB, -- 개선점
  pdf_url TEXT, -- 생성된 PDF 링크
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, week_start_date)
);

CREATE INDEX idx_weekly_reports_student_id ON weekly_reports(student_id);
CREATE INDEX idx_weekly_reports_week_start_date ON weekly_reports(week_start_date);
```

---

### 9. notifications (알림)

사용자 알림을 저장합니다.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'feedback', 'new_assignment', 'reminder' 등
  title VARCHAR(200) NOT NULL,
  message TEXT,
  link_url TEXT, -- 클릭 시 이동할 URL
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## 주요 관계도

```
users (1) ─── (N) classes (교사-학급)
users (N) ─── (1) classes (학생-학급)
users (1) ─── (N) assignments (교사-과제)
users (1) ─── (N) submissions (학생-제출물)
users (1) ─── (N) learning_progress (학생-진도)

assignments (1) ─── (N) submissions
submissions (1) ─── (N) teacher_reviews

learning_materials (1) ─── (N) learning_progress
```

---

## 데이터 타입 정의 (TypeScript)

```typescript
// 사용자
export type User = {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  grade?: number;
  classId?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

// 과제
export type Assignment = {
  id: string;
  title: string;
  originalText: string;
  instructions: string;
  grade?: number;
  classId?: string;
  createdBy: string;
  wordLimit?: number;
  sentenceLimit?: number;
  dueDate?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

// 제출물
export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  summaryText: string;
  draftHistory?: any;
  status: "draft" | "submitted" | "evaluated";
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// 교사 첨삭
export type TeacherReview = {
  id: string;
  submissionId: string;
  teacherId: string;
  manualScore: number;
  comments: string;
  highlights?: any; // JSONB
  reviewedAt: string;
};

// 학습 자료
export type LearningMaterial = {
  id: string;
  title: string;
  description?: string;
  content: any; // JSONB
  grade: number;
  topic: string;
  difficulty?: "easy" | "medium" | "hard";
  orderIndex: number;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

// 학습 진도
export type LearningProgress = {
  id: string;
  studentId: string;
  materialId: string;
  completed: boolean;
  score?: number;
  timeSpentMinutes: number;
  startedAt: string;
  completedAt?: string;
};
```

---

## Supabase 설정

### Row Level Security (RLS) 정책 예시

```sql
-- 학생은 자신의 제출물만 조회/수정 가능
CREATE POLICY "Students can view their own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- 교사는 자신의 반 학생들의 제출물 조회 가능
CREATE POLICY "Teachers can view their class submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = submissions.student_id
      AND users.class_id IN (
        SELECT id FROM classes WHERE teacher_id = auth.uid()
      )
    )
  );
```

---

## 인덱싱 전략

- 자주 조회되는 컬럼에 인덱스 생성 (user_id, class_id, assignment_id 등)
- 날짜 기반 조회를 위한 timestamp 인덱스
- JSONB 컬럼의 특정 필드에 GIN 인덱스 사용 고려

---

## 백업 및 복구

- Supabase 자동 백업 활용
- 주간 수동 백업 스크립트 실행
- 중요 데이터는 별도 S3 저장소에 아카이빙
