# 📁 SummaryWrite 프로젝트 구조

## 전체 디렉토리 구조

```
korean/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   │   ├── common/        # 공통 컴포넌트 (Button, Input 등)
│   │   │   ├── learning/      # 학습 모듈 컴포넌트
│   │   │   ├── writing/       # 글쓰기 모듈 컴포넌트
│   │   │   ├── evaluation/    # 평가 모듈 컴포넌트
│   │   │   └── dashboard/     # 대시보드 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── StudentPage.tsx
│   │   │   ├── TeacherPage.tsx
│   │   │   ├── LearningPage.tsx
│   │   │   └── WritingPage.tsx
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── store/             # Zustand 상태 관리
│   │   ├── services/          # API 호출 서비스
│   │   ├── types/             # TypeScript 타입 정의
│   │   ├── utils/             # 유틸리티 함수
│   │   ├── styles/            # Emotion 스타일
│   │   ├── i18n/              # 다국어 지원
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── tests/                 # Vitest 테스트
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.local
│
├── backend/                    # NestJS 백엔드
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # 인증/인가 모듈
│   │   │   ├── users/         # 사용자 관리
│   │   │   ├── summary/       # 요약 글쓰기 모듈
│   │   │   ├── learning/      # 학습 모듈
│   │   │   └── evaluation/    # 평가 모듈
│   │   ├── common/
│   │   │   ├── guards/        # 인증 가드
│   │   │   ├── interceptors/  # 인터셉터
│   │   │   ├── filters/       # 예외 필터
│   │   │   └── decorators/    # 커스텀 데코레이터
│   │   ├── config/            # 설정 파일
│   │   ├── database/          # 데이터베이스 설정
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── test/                  # E2E 테스트
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.production
│
├── shared/                     # 공유 타입 및 유틸리티
│   ├── types/
│   └── constants/
│
├── docs/                       # 문서
│   ├── api/                   # API 명세서
│   ├── design/                # 디자인 문서
│   └── architecture/          # 아키텍처 문서
│
├── scripts/                    # 배포 및 유틸리티 스크립트
│   ├── deploy.sh
│   └── seed-db.ts
│
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
│       ├── frontend-deploy.yml
│       └── backend-deploy.yml
│
├── README.md
└── package.json               # Monorepo 루트
```

## 주요 디렉토리 설명

### Frontend (`/frontend`)

- **React 19 + TypeScript + Vite** 기반
- **Zustand**로 전역 상태 관리
- **React Query**로 서버 상태 관리
- **Emotion**으로 CSS-in-JS 스타일링
- 컴포넌트 기반 설계로 재사용성 극대화

### Backend (`/backend`)

- **NestJS** 프레임워크 사용
- 모듈 기반 아키텍처 (Module, Controller, Service, Repository 패턴)
- **Supabase**를 데이터베이스 및 인증 제공자로 사용
- RESTful API 설계

### Shared (`/shared`)

- Frontend와 Backend가 공유하는 타입 정의
- 공통 상수 및 유틸리티 함수

### Docs (`/docs`)

- API 명세서, 아키텍처 문서, 디자인 가이드

## 기술 스택 매핑

| 계층      | 기술                          | 위치                  |
| --------- | ----------------------------- | --------------------- |
| UI        | React 19, TypeScript, Emotion | `/frontend/src`       |
| 상태 관리 | Zustand, React Query          | `/frontend/src/store` |
| API       | NestJS, Express               | `/backend/src`        |
| Database  | PostgreSQL (Supabase)         | Cloud                 |
| 배포      | Vercel (FE), Render (BE)      | CI/CD                 |
