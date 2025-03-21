# Techplay Gutenberg Blocks

워드프레스 구텐베르크 에디터용 커스텀 블록 플러그인입니다.

## 기능

### 1. 이미지 비교 블록
- 두 개의 이미지를 슬라이더로 비교할 수 있는 블록
- 슬라이더 위치 조절 가능
- 반응형 디자인 지원
- 다크모드 지원

### 2. 다운로드 버튼 블록
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

### 3. 레퍼런스 링크 블록
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

### 1.0.0
- 초기 버전 릴리즈
- 다운로드 버튼, 이미지 비교, 레퍼런스 링크 블록 구현
- 다운로드 통계 기능 추가 