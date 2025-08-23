
# 🎸 Bandnol-Front

> UMC 8th Project - Front  
> 자유롭게, 그리고 즐겁게. 밴드 음악 추천 서비스 **밴놀**
<img width="3000" height="2000" alt="Frame 561" src="https://github.com/user-attachments/assets/5dc25e11-9f02-40cf-bc49-cb7d50a35913" />


---

## ✨ 소개

안녕하세요! 👋  
“Band” + “놀(놀다)”의 합성어,  
**밴놀**은 밴드 음악을 자유롭고 즐겁게 **추천하고 발견**할 수 있는 공간입니다.

---

## 🛠️ 기술 스택

| 기술 스택 | 선정 이유 |
|--------|-----------|
| <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/> <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white"/> | 실제 앱스토어 배포를 염두에 두고 네이티브에 가까운 사용자 경험을 제공하고자 선택 |
| <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/> | 정적 타입 검사를 통해 안정성을 높이고, 코드의 유지보수성을 강화 |
| <img src="https://img.shields.io/badge/Zustand-593D88?style=for-the-badge"/> | 직관적이고 간결한 전역 상태 관리 |
| <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"/> | 비동기 데이터 상태 관리 최적화 |
| <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge"/> | 서버와의 HTTP 통신을 간결하고 일관성 있게 처리 |
| <img src="https://img.shields.io/badge/Stylesheet-1572B6?style=for-the-badge&logo=css3&logoColor=white"/> | 스타일 재사용성과 유지보수성을 높이고, 우선순위 충돌 없이 안정적인 컴포넌트 스타일링 가능 |



---

## ⚙️ 설치 방법

```bash
git clone https://github.com/Bandnol/Bandnol-Front.git
cd Bandnol-Front
yarn install
```

## ↪️ 테스트 실행

```bash
npx expo start --tunnel
```
---
## 📂 폴더 구조
```bash
Bandnol
├─api/                          # 서버 통신 모듈 (Axios 기반)
│  ├─replies.ts                 # 답글 관련 API
│  ├─spotifySearch.ts           # 스포티파이 검색 API
│  ├─aiRecommend.ts             # AI 추천 API
│  └─...                        # 기타 API 모듈
│
├─app/                          # Expo Router 라우팅 엔트리
│  ├─(auth)/                    # 인증 플로우
│  ├─(onboarding)/              # 온보딩 단계 화면
│  ├─(tabs)/                    # 하단 탭 네비게이션 그룹
│  │  ├─music-recommend/        # 음악 추천 관련 페이지
│  │  ├─myPage/                 # 마이페이지 & 설정 화면
│  │  ├─post-tab/               # 게시글 탭 화면
│  │  └─recommend-tab/          # 추천 탭 화면
│  ├─+not-found.tsx             # 404 페이지
│  ├─_layout.tsx                 # 글로벌 레이아웃
│  └─index.tsx                   # 초기 진입 화면
│
├─assets/                       # 정적 자산
│  ├─fonts/                     
│  ├─icons/                 
│  └─images/                  
│
├─components/                   # 재사용 가능한 컴포넌트
│  ├─common/                    # 프로젝트 전역 공통 UI
│  └─ui/                        # 원자 단위 UI 컴포넌트
│
├─constants/                    # 상수, 디자인 토큰
│  ├─Colors.ts                 
│  └─typography.ts              
│
├─hooks/                        # 커스텀 훅
│  ├─useAuthContext.tsx          
│  ├─useThemeColor.ts           
│  └─...                        
│
└─store/                        # Zustand 전역 상태

```
---
## 📝 협업 규칙

<details>
<summary><strong>Commit Convention</strong></summary>

### 커밋 메시지 작성 규칙
1. 커밋 제목은 **명령문 형태**로 작성합니다.  
2. 커밋 메시지는 반드시 **한글**로 작성합니다.  
3. 커밋 유형(TYPE)은 반드시 **영어 대문자**로 작성합니다.  
4. **여러 작업을 한 커밋에 묶지 않습니다.** (하나의 커밋에는 하나의 작업만 포함)  
5. 커밋 유형 뒤에는 콜론(:)과 공백을 추가합니다.  

### 형식
```bash
[TYPE] 작업한 내용 요약
```

| 타입        | 설명                                                       |
|-------------|------------------------------------------------------------|
| `FEAT`      | 새로운 기능 추가                                           |
| `MOD`       | 기존 코드 수정                                             |
| `ADD`       | 부수적인 코드/라이브러리/파일 추가                         |
| `CHORE`     | 빌드 설정, 타입, 변수명, 패키지 변경 등 사소한 작업        |
| `DEL`       | 사용하지 않는 코드나 파일 삭제                             |
| `UI`        | UI 스타일 및 레이아웃 작업                                 |
| `FIX`       | 버그나 오류 해결                                           |
| `HOTFIX`    | QA나 긴급한 이슈에 대한 빠른 수정                          |
| `MERGE`     | 다른 브랜치와의 병합                                       |
| `MOVE`      | 파일이나 코드의 위치 이동                                  |
| `RENAME`    | 파일 이름 또는 폴더 이름 변경                              |
| `REFACTOR`  | 코드 전면 수정 또는 리팩토링                               |
| `DOCS`      | 문서 관련 작업 (README, WIKI, 주석 등)                     |

</details>



<details>
<summary><strong>Branch Convention</strong></summary>

### 이슈 파기
- [유형] where / what


### 브랜치 생성
- 유형/#번호-what


### 작업 커밋
- [유형/#번호] what


### PR 생성
- [유형/#번호] where / what


### 머지 규칙
- 4명 중 **최소 2명**에게 피드백(Approve) 받은 후 머지 가능

 </details>



<details>
<summary><strong>코어 타임 & 회의</strong></summary>

- **주 1회 코어 타임**: 매주 화요일 저녁  
- 회의 시 진행 내용:
  - 진행 상황 공유
  - 이슈 및 PR 리뷰
  - 다음 주 계획 논의
</details>

---
## 🤖 AI 활용

### 1. AI 코멘트 기능
- **기능 개요**: 추천 음악에 대한 AI 기반 코멘트를 자동 생성하여 사용자 경험을 확장
- **구현 방식**:
  1. 서버에서 AI 모델을 활용한 코멘트 생성 API를 구축
  2. 프론트엔드에서 Axios를 이용해 API 호출
  3. API 응답으로 전달된 코멘트를 UI에 반영하여 실시간 표시

### 2. 개발 과정에서 AI 활용
- **문제 해결**: Expo 환경 설정, React Native 빌드 오류, Git 충돌 해결 과정에서 AI를 통한 해결책 탐색
- **리팩토링**: 코드 구조 최적화, 재사용 컴포넌트화 과정에서 AI의 구조 제안 참고

---
## 🚧 개발 중 겪은 어려움
가짜 데이터와 실제 API 혼용으로 인한 UI 상태 불일치 문제
- 원인 분석: replycomment 유무로 버튼 상태를 제어했었는데, 가짜 데이터와 실제 API 호출이 섞여 있어 정상적으로 동작하는지 확인이 어려웠음
- 해결방안: 가짜 데이터 코드를 삭제하고 useEffect에서 fetchReplycomment만 호출하도록 변경하고 reply.content와 reply.nickname을 모달에 저장해서 띄움

화면에 노출되지 않는 이미지를 viewshot으로 가져와야 하는 문제
- 원인 분석
  : 투명도를 100으로 하는 방법 → 캡쳐가 투명하게 됨.
  : 모달을 0.01초동안 띄우고 그동안 캡쳐하는 방법 → 안정적이지 않음.
- 해결 방안: 모달의 좌표를 -10000, -10000만큼 이동해 보이지 않는 곳에서 모달을 보여주고 캡쳐함.
