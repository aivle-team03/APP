BOSS App

물류창고 현장의 안전관리 업무를 지원하는 BOSS 모바일 애플리케이션입니다.
안전 점검 및 조치 업무 확인, CCTV 위험 이벤트 모니터링, AI 챗봇, 안전 교육 등의 기능을 제공합니다.

주요 기능

* 로그인
    * 사용자 인증 및 권한에 따른 서비스 접근
* 점검 및 조치 관리
    * 담당 점검 항목 조회 및 결과 등록
    * 조치 필요 항목 확인
    * 조치 결과 및 증빙 이미지 등록
* CCTV 모니터링
    * AI Vision 기반 위험 탐지 결과 확인
    * 화재 및 지게차-작업자 접근 위험 이벤트 확인
* AI 챗봇
    * 산업안전 관련 질의응답 및 안전관리 업무 지원
* 안전 교육
    * 안전 교육 콘텐츠 및 영상 확인

Tech Stack

* React Native
* Expo
* Expo Router
* TypeScript
* Axios

실행 방법

BOSS App은 Backend API와 연동되어 있으므로 앱 실행 전 Backend 서버를 먼저 실행해야 합니다.
Backend 코드는 별도의 Backend Repository에서 관리됩니다.

1. Backend 실행

먼저 BOSS Backend Repository를 Clone한 후 Backend 서버를 실행합니다.

git clone <backend-repository-url>
cd <backend-repository>

가상환경을 활성화합니다.

source .venv/bin/activate

필요한 패키지를 설치합니다.

pip install -r requirements.txt

Backend 서버를 실행합니다.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

정상적으로 실행되면 Backend API가 다음 주소에서 실행됩니다. (연결에 따라 주소가 달라질 수 있음)

http://127.0.0.1:8000

2. App Repository Clone

별도의 터미널에서 App Repository를 Clone합니다.

git clone <app-repository-url>
cd <app-repository>

3. 패키지 설치

npm install

4. App 실행

npx expo start

Expo 실행 후 Expo Go 또는 iOS/Android Simulator를 이용해 앱을 실행할 수 있습니다.

npx expo start --ios

또는

npx expo start --android

Backend 연결

개발 환경에서는 Backend API 주소가 기본적으로 다음과 같이 설정됩니다.

const API_BASE_URL = "http://127.0.0.1:8000";

실제 모바일 기기의 Expo Go에서 실행하는 경우 127.0.0.1은 모바일 기기 자신을 의미하므로 Backend에 연결할 수 없습니다.

이 경우 Backend를 실행하는 PC와 모바일 기기를 동일한 네트워크에 연결한 뒤, PC의 로컬 IP 주소를 사용합니다.

const API_BASE_URL = "http://192.168.0.10:8000";

실행 순서

1. Backend Repository 실행
        ↓
2. Backend 서버 실행 (Port 8000)
        ↓
3. App Repository 실행
        ↓
4. Expo 실행
        ↓
5. BOSS App 접속

주요 API 연동

/api/auth
/api/inspection
/api/action-histories
/api/monitoring
/api/education
/api/chatbot

인증이 필요한 API 요청에는 로그인 후 발급받은 Access Token을 사용합니다.

Authorization: Bearer <ACCESS_TOKEN>

BOSS

BOSS는 AI Vision과 안전관리 시스템을 결합하여 물류창고의 위험요소를 탐지하고, 점검부터 조치까지 이어지는 현장 안전관리 업무를 지원하는 서비스입니다.
