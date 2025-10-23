# 🔌 SummaryWrite API 명세서

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://api.summarywrite.com/api`

## Authentication

모든 API는 JWT Bearer Token 인증을 사용합니다.

```
Authorization: Bearer <token>
```

---

## 📚 API 엔드포인트

### 1. 인증 (Auth)

#### 1.1 회원가입

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "student@school.com",
  "password": "password123",
  "name": "홍길동",
  "role": "student", // "student" | "teacher"
  "grade": 5 // 초등학교 학년 (선택)
}
```

**Response (201):**

```json
{
  "id": "uuid-v4",
  "email": "student@school.com",
  "name": "홍길동",
  "role": "student",
  "token": "jwt-token"
}
```

#### 1.2 로그인

```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@school.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "id": "uuid-v4",
  "email": "student@school.com",
  "name": "홍길동",
  "role": "student",
  "token": "jwt-token"
}
```

---

### 2. 학습 모듈 (Learning)

#### 2.1 학습 자료 목록 조회

```http
GET /learning/materials?grade=5&topic=summary
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "materials": [
    {
      "id": "material-1",
      "title": "요약의 기본 개념",
      "description": "글을 요약하는 방법을 배워봅시다",
      "grade": 5,
      "topic": "summary",
      "content": "...",
      "exercises": [...]
    }
  ]
}
```

#### 2.2 학습 진도 업데이트

```http
POST /learning/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "materialId": "material-1",
  "completed": true,
  "score": 85
}
```

**Response (200):**

```json
{
  "progress": {
    "materialId": "material-1",
    "studentId": "uuid-v4",
    "completed": true,
    "score": 85,
    "completedAt": "2025-10-23T10:30:00Z"
  }
}
```

---

### 3. 글쓰기 모듈 (Writing)

#### 3.1 글쓰기 과제 생성

```http
POST /writing/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "동물의 생태 요약하기",
  "originalText": "판다는 중국에 서식하는...",
  "instructions": "위 글을 3문장으로 요약하세요",
  "grade": 5
}
```

**Response (201):**

```json
{
  "assignment": {
    "id": "assignment-1",
    "title": "동물의 생태 요약하기",
    "originalText": "판다는 중국에 서식하는...",
    "instructions": "위 글을 3문장으로 요약하세요",
    "createdAt": "2025-10-23T10:30:00Z"
  }
}
```

#### 3.2 학생 답안 제출

```http
POST /writing/submissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignmentId": "assignment-1",
  "summaryText": "판다는 중국에 산다. 대나무를 주식으로 먹는다. 멸종 위기 동물이다."
}
```

**Response (201):**

```json
{
  "submission": {
    "id": "submission-1",
    "assignmentId": "assignment-1",
    "studentId": "uuid-v4",
    "summaryText": "판다는 중국에 산다...",
    "status": "submitted",
    "submittedAt": "2025-10-23T11:00:00Z"
  }
}
```

---

### 4. 평가 모듈 (Evaluation)

#### 4.1 평가 결과 조회

```http
GET /evaluation/results?studentId=uuid-v4&from=2025-10-01&to=2025-10-31
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "results": [
    {
      "id": "result-1",
      "submissionId": "submission-1",
      "studentId": "uuid-v4",
      "score": {
        "mainIdea": 85,
        "conciseness": 90,
        "logic": 80,
        "total": 85
      },
      "evaluatedAt": "2025-10-23T11:01:00Z"
    }
  ],
  "statistics": {
    "average": 85,
    "highest": 95,
    "lowest": 70,
    "totalSubmissions": 15
  }
}
```

---

### 5. 대시보드 (Dashboard)

#### 5.1 학생 대시보드 데이터

```http
GET /dashboard/student
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "student": {
    "id": "uuid-v4",
    "name": "홍길동",
    "grade": 5
  },
  "weeklyMissions": [
    {
      "id": "mission-1",
      "title": "이번 주 요약 과제",
      "completed": true,
      "dueDate": "2025-10-25"
    }
  ],
  "recentScores": [85, 90, 78, 92, 88],
  "totalSubmissions": 15,
  "averageScore": 85
}
```

#### 5.2 교사 대시보드 데이터

```http
GET /dashboard/teacher?classId=class-1
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "teacher": {
    "id": "teacher-uuid",
    "name": "김선생"
  },
  "class": {
    "id": "class-1",
    "name": "5학년 1반",
    "studentCount": 25
  },
  "students": [
    {
      "id": "student-1",
      "name": "홍길동",
      "averageScore": 85,
      "submissionCount": 15,
      "lastSubmission": "2025-10-23T11:00:00Z"
    }
  ],
  "pendingReviews": 5
}
```

---

## 에러 응답

모든 에러는 다음 형식을 따릅니다:

```json
{
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "Bad Request"
}
```

### HTTP 상태 코드

- `200` OK - 성공
- `201` Created - 생성 성공
- `400` Bad Request - 잘못된 요청
- `401` Unauthorized - 인증 실패
- `403` Forbidden - 권한 없음
- `404` Not Found - 리소스 없음
- `500` Internal Server Error - 서버 오류

---

## Rate Limiting

- **일반 API:** 분당 100회

---

## WebSocket (실시간 기능)

### 연결

```javascript
const socket = io("wss://api.summarywrite.com", {
  auth: {
    token: "jwt-token",
  },
});
```

### 이벤트

- `submission:new` - 새 제출 알림 (교사용)
- `review:completed` - 첨삭 완료 알림 (학생용)
- `notification` - 일반 알림
