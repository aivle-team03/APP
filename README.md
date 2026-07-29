# 📱 AI 기반 산업/소방 안전 모니터링 모바일 앱

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

> **AIVLE Team 03 모바일 애플리케이션**
>
> 현장 작업자를 위한 모바일 안전관리 앱으로,
> 점검 체크리스트 수행, 위험 신고, AI 안전 챗봇 기능을 제공합니다.

---

# 📌 주요 기능

## 📋 1. 체크리스트

- 관리자에게 할당된 점검/조치 항목 확인
- 점검 완료 처리
- 조치 사진 업로드
- 진행 상태 확인

---

## 🚨 2. 위험 신고

- 위험 요소 신고
- 위험도 선택
- 발생 위치 입력
- 현장 사진 첨부
- 신고 등록

---

## 🤖 3. AI 안전 챗봇

- 소방 법규 Q&A
- 안전수칙 질의응답
- 추천 질문 제공
- 백엔드 챗봇 API 연동

---

# 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React Native |
| Platform | Expo |
| Language | TypeScript |
| Navigation | Expo Router |
| Icons | Expo Vector Icons |
| Image Picker | Expo Image Picker |
| HTTP | Fetch API |

---

# 📂 프로젝트 구조

```text
boss-app/
├── app/
│   ├── (tabs)/
│   │   ├── checklist.tsx
│   │   ├── board.tsx
│   │   ├── qna.tsx
│   │   └── _layout.tsx
│   ├── login/
│   ├── styles/
│   ├── mocks/
│   └── index.tsx
├── assets/
├── components/
├── hooks/
├── constants/
└── app.json
```

---

# 🚀 시작하기

## 1. 패키지 설치

```bash
npm install
```

또는

```bash
npm install
npx expo install
```

---

## 2. 개발 서버 실행

```bash
npx expo start
```

iOS

```bash
i
```

Android

```bash
a
```

---

# 📱 화면 구성

- 로그인
- 체크리스트
- 위험 신고
- AI 안전 챗봇
