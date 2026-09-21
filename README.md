# ModooDoc - Frontend

> CEOS 24th MashUp Day Team 5 모두닥 역기획 프로젝트

## 로컬 실행

```bash
npm ci
npm run dev
```

## 커밋 전 검증

```bash
npm run lint
npm run format:check
npm run build
```

## Workflow

```text
Issue 생성
→ develop에서 작업 브랜치 생성
→ 작업 및 커밋
→ lint, format, build 검증
→ PR 생성
→ 리뷰 및 수정
→ develop 병합
→ 작업 브랜치 삭제

배포 또는 최종 제출 시
develop → main 대상 PR 생성
→ 검토 및 병합
```
- 일반 작업 PR의 대상 브랜치는 `develop`입니다.
- `main`에는 배포 또는 최종 제출 가능한 안정 버전만 병합합니다.

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
- PR 본문에 `Closes #이슈번호`를 작성해 Issue를 연결합니다.
- 주요 변경 사항, 실제 검증 결과, 리뷰어가 확인할 내용을 작성합니다.
- UI 변경이 있다면 스크린샷 또는 화면 녹화를 첨부합니다.
- 하나의 PR은 하나의 작업 목표를 다룹니다.
