# Techplay Gutenberg Blocks

워드프레스 구텐베르크 에디터용 커스텀 블록 플러그인입니다.

## 기능

### 1. AI 이미지 갤러리 블록 (v1.1.0 추가, v1.1.1 개선)
- AI로 생성된 이미지를 갤러리 형태로 표시 (컬럼, 갭 조절 가능)
- Masonry 레이아웃 옵션 지원
- 이미지 클릭 시 라이트박스로 크게 보기 기능 (개선된 중앙 정렬 및 부드러운 전환 효과)
- 라이트박스 내 이미지 크기 최적화 (WordPress 'large' 사이즈 사용)
- 라이트박스 닫기 버튼 디자인 개선 (SVG 아이콘 사용)
- 이미지 정보 아이콘 클릭 시 생성 파라미터(프롬프트, 설정값 등) 모달 표시
  - 서버에 `exiftool` 필요 (PNG, JPG 등의 메타데이터 읽기)
- 갤러리 이미지 호버 시 추가 액션 버튼 표시 (SVG 아이콘 사용)
  - 이미지 URL 복사
  - 이미지 다운로드
- 반응형 디자인 지원

### 2. 이미지 비교 블록
- 두 개의 이미지를 슬라이더로 비교할 수 있는 블록
- 슬라이더 위치 조절 가능
- 반응형 디자인 지원
- 다크모드 지원

### 3. 다운로드 버튼 블록
- 파일 다운로드를 위한 커스텀 버튼
- WordPress 미디어 라이브러리 통합
- 다양한 스타일 옵션:
  - 기본, 강조, 라운드 스타일
  - 5가지 크기 옵션 (매우 작음 ~ 매우 큼)
  - 좌/중앙/우측 정렬
  - 배경색, 텍스트 색상, 호버 효과 커스터마이징
- 아이콘 옵션:
  - 다운로드
  - 문서
  - 파일
  - PDF
  - 압축파일
- 다크모드 지원
- 반응형 디자인

### 4. 레퍼런스 링크 블록
- 외부 링크를 깔끔하게 표시하는 블록
- 자동 파비콘 표시
- 링크 제목 자동 추출
- 폰트 크기 조절
- 아이콘 표시 옵션
- 다크모드 지원
- 반응형 디자인

## 설치 방법

1. 이 저장소를 클론합니다:
```bash
git clone https://github.com/noxwon/techplay-gutenberg-blocks.git
```

2. 플러그인 디렉토리로 이동합니다:
```bash
cd techplay-gutenberg-blocks
```

3. 의존성을 설치합니다:
```bash
npm install
```

4. 개발 모드로 빌드합니다:
```bash
npm run build
```

5. 플러그인을 WordPress 플러그인 디렉토리에 복사합니다.

## 개발

### 개발 모드 실행
```bash
npm run start
```

### 프로덕션 빌드
```bash
npm run build
```

## 요구사항

- WordPress 5.0 이상
- Node.js 14.0 이상
- npm 6.0 이상
- **Exiftool:** AI 이미지 갤러리 블록에서 이미지(PNG, JPG 등)의 메타데이터(SD 파라미터 등)를 추출하기 위해 서버에 `exiftool` 명령줄 도구가 설치되어 있어야 합니다.
    - Ubuntu/Debian 기반 시스템 설치 예시:
      ```bash
      sudo apt-get update && sudo apt-get install libimage-exiftool-perl
      ```
    - 설치 후 웹 서버 또는 PHP-FPM을 재시작해야 할 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 기여하기

1. 이슈 생성
2. 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 제작자
- GitHub: [noxwon](https://github.com/noxwon)
- Website: [techplay.blog](https://techplay.blog)

## 변경 이력

### 1.2.0 (2025-04-14)
* AI 이미지 갤러리: Masonry 레이아웃 버그 수정 및 기능 안정화 (라이트박스, 이미지 정보, 호버 버튼 등)
* AI 이미지 갤러리: 프론트엔드 스크립트 로딩 방식 개선
* 이미지 비교: 편집기 및 프론트엔드 HTTPS URL 처리 개선
* 기타: 코드 정리 및 안정성 향상

### 1.1.1
- AI 이미지 갤러리 라이트박스 기능 개선
  - 이미지 중앙 정렬 안정성 향상
  - 부드러운 열기/닫기 전환 효과 적용 (CSS Transition)
  - 라이트박스 이미지 로딩 최적화 (WordPress 'large' 사이즈 사용)
  - 닫기 버튼 디자인 개선 (SVG 아이콘)
- AI 이미지 갤러리 호버 아이콘 개선 (SVG 아이콘 적용)
  - 정보 보기, URL 복사, 다운로드 버튼
- 라이트박스 표시 관련 버그 수정

### 1.1.0
- AI 이미지 갤러리 블록 추가
  - Masonry 레이아웃, 라이트박스, 파라미터 정보 표시 기능 포함
  - 이미지 파라미터 추출을 위해 서버 `exiftool` 의존성 추가

### 1.0.0
- 초기 버전 릴리즈
- 다운로드 버튼, 이미지 비교, 레퍼런스 링크 블록 구현
- 다운로드 통계 기능 추가 
-

## Changelog

### 1.2.0 (YYYY-MM-DD) 
* AI 이미지 갤러리: Masonry 레이아웃 버그 수정 및 기능 안정화 (라이트박스, 이미지 정보, 호버 버튼 등)
* AI 이미지 갤러리: 프론트엔드 스크립트 로딩 방식 개선
* 이미지 비교: 편집기 및 프론트엔드 HTTPS URL 처리 개선
* 기타: 코드 정리 및 안정성 향상

### 1.1.1 
* ... (Previous changelog entries if any) ...
