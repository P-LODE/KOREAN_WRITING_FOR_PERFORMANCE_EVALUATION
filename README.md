# KOREAN_WRITING_FOR_PERFORMANCE_EVALUATION

# 🧠 SummaryWrite — 초등 요약 글쓰기 학습 프로그램

> **목표:** 초등학생의 글 요약 능력과 수행평가 대비 실전력을 향상시키는 웹 기반 학습 플랫폼

---

## 📘 프로젝트 개요

- **프로젝트명:** SummaryWrite
- **대상:** 초등학교 4~6학년 (학원 및 개인 학습 겸용)
- **기간:** 약 3개월 (기획 → 개발 → 배포)
- **핵심 가치:** 쉽고 재미있는 글 요약 학습, AI 기반 자동 피드백, 수행평가형 실전 연습

---

## ⚙️ 기술 스택

| 영역         | 기술                                                      |
| ------------ | --------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite, Emotion, Zustand, React Query |
| **Backend**  | Node.js (NestJS), Express Gateway, Supabase (DB + Auth)   |
| **Database** | PostgreSQL (JSONB 기반 과제/첨삭 데이터 저장)             |
| **Infra**    | Vercel (FE), Render (BE), Cloudflare CDN                  |
| **AI/ML**    | OpenAI GPT-4o-mini (요약 피드백 및 자동 첨삭)             |
| **Testing**  | Playwright (E2E), Vitest (Unit)                           |
| **i18n**     | i18next + chrome.i18n (학원 확장 지원)                    |

---

## 🧩 주요 기능

- 🧠 **학습 모듈**: 요약 개념 학습, 중심 문장 찾기, 문단 구조 퀴즈
- ✍️ **글쓰기 모듈**: 실시간 AI 피드백 & 문장 수정 가이드
- 📊 **평가 모듈**: 중심 내용·간결성·논리성 자동 평가 알고리즘
- 👩‍🏫 **교사용 대시보드**: 학생 진도, 첨삭 내역, 평가 결과 조회
- 📱 **학생 대시보드**: 주차별 미션, 점수 그래프, 성장 리포트

---

## 🏗️ 개발 프로세스

| 단계          | 기간       | 주요 내용                                        |
| ------------- | ---------- | ------------------------------------------------ |
| **1. 기획**   | Week 1–2   | 학습 플로우 설계, 요약 평가 기준 확립            |
| **2. 디자인** | Week 3–4   | Figma UI/UX 설계 (아동 친화적 디자인)            |
| **3. 개발**   | Week 5–10  | FE: React SPA / BE: NestJS + Supabase / GPT 연동 |
| **4. 테스트** | Week 11–12 | Playwright 시나리오 테스트, 학원 파일럿 운영     |
| **5. 배포**   | Week 13–   | CI/CD 자동화 (Vercel + Render), 로그 모니터링    |

---

## 🧱 시스템 구조

```mermaid
graph TD
A[사용자 브라우저] -->|REST API| B[Express Gateway]
B --> C[Supabase DB]
B --> D[OpenAI GPT API]
C --> E[PostgreSQL 저장소]
D --> F[AI Feedback Service]
📊 데이터 구조 (예시)
ts
코드 복사
type SummaryRecord = {
  id: string;
  studentId: string;
  text: string;
  summary: string;
  feedback: string;
  score: {
    mainIdea: number;
    conciseness: number;
    logic: number;
  };
  createdAt: string;
};
🚀 배포 & 운영
CI/CD: GitHub Actions → Vercel (FE), Render (BE)

환경 변수: .env.local / .env.production

모니터링: Supabase Dashboard + Logflare

리포트 생성: 주간 학습 리포트 자동 PDF 발행

🎯 기대 효과
수행평가 대비 실전 글쓰기 강화

교사 첨삭 업무 자동화 및 효율화

학생별 성장 데이터 시각화 기반 맞춤형 피드백

📄 라이선스
MIT © 2025 SummaryWrite Team

```
