# 🚀 SummaryWrite 개발 시작 가이드

## 📋 목차

1. [사전 요구사항](#사전-요구사항)
2. [프로젝트 설정](#프로젝트-설정)
3. [개발 환경 실행](#개발-환경-실행)
4. [코드 스타일 가이드](#코드-스타일-가이드)
5. [Git 워크플로우](#git-워크플로우)
6. [배포 프로세스](#배포-프로세스)

---

## 사전 요구사항

### 필수 설치 프로그램

- **Node.js** 18.x 이상
- **npm** 또는 **pnpm** (권장)
- **Git**
- **VS Code** (권장 에디터)

### 필수 계정

- **Supabase** 계정 (데이터베이스 + 인증)
- **Vercel** 계정 (프론트엔드 배포)
- **Render** 또는 **Railway** 계정 (백엔드 배포)

---

## 프로젝트 설정

### 1. 저장소 클론

```bash
git clone https://github.com/your-org/korean.git
cd korean
```

### 2. 의존성 설치

#### Monorepo 루트

```bash
npm install
# 또는
pnpm install
```

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

### 3. 환경 변수 설정

#### Frontend (`.env.local`)

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Backend (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/summarywrite
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET=your-random-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. 데이터베이스 마이그레이션

#### Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. SQL Editor에서 `DATABASE_SCHEMA.md`의 테이블 생성 SQL 실행

```sql
-- users 테이블부터 순서대로 실행
CREATE TABLE users (...);
CREATE TABLE classes (...);
-- ... 나머지 테이블
```

#### Row Level Security (RLS) 설정

```sql
-- RLS 활성화
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Students can view their own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = student_id);
```

---

## 개발 환경 실행

### 1. Backend 실행

```bash
cd backend
npm run start:dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 2. Frontend 실행

```bash
cd frontend
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

### 3. 동시 실행 (Monorepo 루트에서)

```bash
npm run dev
```

---

## 코드 스타일 가이드

### TypeScript 규칙

- **명명 규칙**
  - 변수/함수: `camelCase`
  - 클래스/컴포넌트: `PascalCase`
  - 상수: `UPPER_SNAKE_CASE`
  - 타입/인터페이스: `PascalCase`

```typescript
// ✅ Good
const userName = "John";
function getUserData() {}
class UserService {}
type UserRole = "student" | "teacher";
const MAX_RETRIES = 3;

// ❌ Bad
const user_name = "John";
function GetUserData() {}
class userService {}
```

### React 컴포넌트

- **함수형 컴포넌트** 사용
- **Props 타입** 명시
- **Hooks 규칙** 준수

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Bad
export function Button(props: any) {
  return <button>{props.label}</button>;
}
```

### 파일 구조

```
ComponentName/
  ├── ComponentName.tsx       # 컴포넌트
  ├── ComponentName.styles.ts # 스타일 (Emotion)
  ├── ComponentName.test.tsx  # 테스트
  └── index.ts                # Export
```

---

## Git 워크플로우

### 브랜치 전략

```
main (프로덕션)
  ↑
develop (개발)
  ↑
feature/기능명 (기능 개발)
```

### 브랜치 명명 규칙

- `feature/user-authentication` - 새 기능
- `fix/login-bug` - 버그 수정
- `refactor/api-service` - 리팩토링
- `docs/api-specification` - 문서 작업

### 커밋 메시지 규칙

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**

- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경

**예시:**

```
feat(auth): add JWT authentication

- Implement login/signup endpoints
- Add JWT token generation
- Create auth guard for protected routes

Closes #123
```

### 개발 프로세스

1. **이슈 생성** (GitHub Issues)
2. **브랜치 생성**
   ```bash
   git checkout -b feature/my-feature
   ```
3. **개발 & 커밋**
   ```bash
   git add .
   git commit -m "feat(module): add feature"
   ```
4. **푸시 & PR 생성**
   ```bash
   git push origin feature/my-feature
   ```
5. **코드 리뷰 & 머지**

---

## 테스트

### Frontend 테스트 (Vitest)

```bash
cd frontend
npm run test
```

**테스트 작성 예시:**

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with label", () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### Backend 테스트 (Jest)

```bash
cd backend
npm run test
```

**테스트 작성 예시:**

```typescript
describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    // Setup
  });

  it("should create a user", async () => {
    const result = await service.signup({
      email: "test@test.com",
      password: "password123",
      name: "Test User",
      role: "student",
    });

    expect(result.user.email).toBe("test@test.com");
  });
});
```

### E2E 테스트 (Playwright)

```bash
cd frontend
npm run test:e2e
```

---

## 배포 프로세스

### Frontend 배포 (Vercel)

1. **Vercel 프로젝트 생성**

   - GitHub 저장소 연결
   - 빌드 설정: `frontend` 디렉토리

2. **환경 변수 설정**

   - Vercel 대시보드에서 환경 변수 추가
   - `VITE_API_URL`, `VITE_SUPABASE_URL` 등

3. **자동 배포**
   - `main` 브랜치 푸시 시 자동 배포
   - PR 생성 시 프리뷰 배포

### Backend 배포 (Render)

1. **Render 웹 서비스 생성**

   - GitHub 저장소 연결
   - 루트 디렉토리: `backend`
   - 빌드 명령: `npm run build`
   - 시작 명령: `npm run start:prod`

2. **환경 변수 설정**

   - Render 대시보드에서 환경 변수 추가

3. **데이터베이스 연결**
   - Supabase 연결 문자열 사용

### CI/CD (GitHub Actions)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 유용한 명령어

### 개발

```bash
# Frontend 개발 서버
npm run dev

# Backend 개발 서버
npm run start:dev

# 타입 체크
npm run type-check

# 린트
npm run lint

# 포맷팅
npm run format
```

### 빌드

```bash
# Frontend 프로덕션 빌드
cd frontend && npm run build

# Backend 프로덕션 빌드
cd backend && npm run build
```

### 데이터베이스

```bash
# 마이그레이션 생성
npm run migration:create

# 마이그레이션 실행
npm run migration:run

# 시드 데이터 추가
npm run seed
```

---

## 트러블슈팅

### 자주 발생하는 문제

**1. 포트가 이미 사용 중**

```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

**2. 의존성 충돌**

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

**3. Supabase 연결 실패**

- 환경 변수 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 네트워크 방화벽 확인

---

## 추가 리소스

- [React 공식 문서](https://react.dev)
- [NestJS 공식 문서](https://nestjs.com)
- [Supabase 문서](https://supabase.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

---

## 문의

개발 관련 문의사항은 다음 채널을 통해 연락주세요:

- GitHub Issues: 버그 리포트, 기능 요청
- 팀 Slack: 일반 문의
