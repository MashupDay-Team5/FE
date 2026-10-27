# ModooDoc - Frontend

> CEOS 24th MashUp Day Team 5 모두닥 역기획 프로젝트

모두닥의 대학생 할인몰을 대상으로 기획과 사용자 흐름을 분석하고, 홈부터 병원 검색 결과, 병원 및 시술 상세까지 연결하는 역기획 프로젝트입니다.

진료 및 시술과 지역, 가격, 진료조건으로 병원을 탐색하고, 병원별 시술 정보와 후기를 확인하는 흐름을 구현합니다.

## 구현 범위

| 화면 | 주요 기능 |
| --- | --- |
| 대학생 할인몰 홈 | 진료·시술 선택, 병원 목록 정렬 및 더보기, 선택값을 유지한 검색 결과 이동 |
| 병원 검색 결과 | 시술 복수 선택, 지역·가격·진료조건 필터, 병원 목록 정렬, 상세 화면 이동 |
| 병원/시술 상세 | 병원과 선택한 시술 정보, 관련 후기 및 다른 후기 조회, 후기 정렬과 더보기, 후기 키워드 표시 |

<br />

## Members

| Member | Contribution |
| --- | --- |
| [**홍진우 (@j2nooh)**](https://github.com/j2nooh) | 개발 환경 및 코드 품질 설정, 라우팅과 디자인 토큰 구성, 병원 검색 결과와 통합 필터 구현, 공통 컴포넌트 및 API 요청 구조 구현, 병원 목록과 필터 결과 수 및 진료·지역 선택지 API 연동, 선택값과 목록 상태 및 스크롤 복원 |
| [**배승윤 (@llets9obae)**](https://github.com/llets9obae) | 프로젝트 초기 설정, 할인몰 홈과 병원 상세 화면 구현, 공통 컴포넌트 구현, 선택한 시술의 상세 화면 이동 연결, 병원 및 시술 상세 정보와 후기 목록 및 키워드 API 연동 |

<br />

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| UI·언어 | React, TypeScript |
| 개발·빌드 | Vite |
| 라우팅 | React Router |
| 스타일링 | Tailwind CSS |
| 코드 품질 | ESLint, Prettier |
| 패키지 관리 | npm |
| 배포 | Vercel |
| 협업 및 디자인 | Git, GitHub, Notion, Figma |

<br />

## 환경변수 설정

프로젝트 루트에 `.env.example`을 복사해 `.env`를 만듭니다.

```dotenv
VITE_API_BASE_URL=https://modoodock.shop
```

기본 주소에는 `/api`를 붙이지 않습니다. 환경변수를 변경하면 개발 서버를 다시 실행합니다. 실제 `.env` 파일은 커밋하지 않습니다.

<br />

## 로컬 실행

```bash
npm ci
npm run dev
```

<br />

## 커밋 전 검증

```bash
npm run lint
npm run format:check
npm run build
```
<br />

## Workflow

```text
Issue 생성
→ develop에서 작업 브랜치 생성
→ 작업 및 커밋
→ lint, format, build 검증
→ PR 생성
→ 리뷰 및 수정
→ develop 병합
→ Preview 배포에서 동작 확인
→ 작업 브랜치 삭제

배포 또는 최종 제출 시
develop의 Preview 배포에서 주요 동작 확인
→ develop → main 대상 PR 생성
→ 검토 및 병합
→ Production 배포 확인
```

- 일반 작업 PR의 대상 브랜치는 `develop`입니다.
- `develop`은 통합 개발 및 Preview 검증용이며, `main`은 Production 배포용입니다.
- `main`에는 주요 동작을 검증한 배포 또는 최종 제출 가능한 버전만 병합합니다.

<br />

## 협업 규칙

### Issue 규칙

Issue 제목은 아래 형식을 따릅니다.

```text
[TYPE] 작업 내용
```

예: `[FEAT] 로그인 화면 구현`

`[FEAT]`, `[FIX]`, `[REFACTOR]`, `[DOCS]`, `[CHORE]`, `[TEST]` 중 작업 성격에 맞는 Type을 사용합니다.

- 기능 개발은 Feature 템플릿, 버그 수정은 Bug 템플릿을 사용합니다.
- 작업 범위와 완료 조건을 작성하고, 관련 Figma, 기획 문서, API 명세 링크를 첨부합니다.
- Issue 생성 후 담당자를 지정하고 작업을 시작합니다.

### Branch 규칙

브랜치는 아래 형식을 따릅니다.

```text
type/이슈번호-작업내용
```

| Type       | 의미                       | 예시                        |
| ---------- | -------------------------- | --------------------------- |
| `feat`     | 새로운 기능 개발           | `feat/1-signup`             |
| `fix`      | 버그 수정                  | `fix/2-login-error`         |
| `docs`     | 문서 수정                  | `docs/3-readme`             |
| `refactor` | 코드 리팩토링              | `refactor/4-member-service` |
| `chore`    | 설정, 빌드, 기타 작업      | `chore/5-github-template`   |
| `test`     | 테스트 코드 작성 또는 수정 | `test/6-member-service`     |

작업 내용은 소문자와 하이픈(`-`)을 사용해 작성합니다.

별도 Issue 없이 진행하기로 합의한 작업은 `type/작업내용` 형식을 사용합니다.
예: `refactor/search-filter-sheets`

### Commit 규칙

커밋 메시지는 아래 형식을 따릅니다.

```text
type: 작업 내용
```

예: `feat: 로그인 화면 구현`

| Type       | 의미                               |
| ---------- | ---------------------------------- |
| `feat`     | 새로운 기능 추가                   |
| `fix`      | 버그 수정                          |
| `docs`     | 문서 수정                          |
| `style`    | 코드 포맷팅 등 기능 변화 없는 수정 |
| `refactor` | 코드 리팩토링                      |
| `test`     | 테스트 코드 추가 또는 수정         |
| `chore`    | 빌드, 패키지, 설정 등 기타 작업    |
| `rename`   | 파일 또는 폴더명 변경              |
| `remove`   | 파일 또는 폴더 삭제                |

커밋은 하나의 목적을 갖도록 작게 나눕니다.

```text
feat: 로그인 페이지 구현
fix: 검색 결과 빈 상태 처리
```

### PR 규칙

PR 제목은 Issue와 같은 형식을 사용합니다.

```text
[TYPE] 작업 내용
```

- 일반 작업 PR은 `develop` 브랜치를 대상으로 생성합니다.
- 관련 Issue가 있으면 PR 본문에 `Closes #이슈번호`를 작성해 연결합니다.
- 주요 변경 사항, 실제 검증 결과, 리뷰어가 확인할 내용을 작성합니다.
- UI 변경이 있다면 스크린샷 또는 화면 녹화를 첨부합니다.
- 하나의 PR은 하나의 작업 목표를 다룹니다.
