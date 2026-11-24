# LEE JONG UNG — AI Content Creator

이종웅 개인 포트폴리오. HTML, CSS, JavaScript로 만든 정적 원페이지 사이트입니다.

## Vercel 배포

1. Vercel에서 이 GitHub 저장소를 Import합니다.
2. Root Directory는 저장소 루트로 유지합니다.
3. Framework Preset은 Other로 선택합니다.
4. Deploy를 누릅니다. `vercel.json`이 출력 폴더를 `dist`로 지정하며, 설치와 빌드 명령은 필요하지 않습니다.

환경 변수는 필요하지 않습니다. 이후 main 브랜치에 변경 사항을 푸시하면 Vercel에서 자동 배포됩니다.

## 로컬 실행

```sh
python -m http.server 4175 --directory dist
```

브라우저에서 http://localhost:4175 를 엽니다.

## 구성

- `dist/index.html`: 섹션과 페이지 메타 정보
- `dist/styles.css`: 반응형 스타일, DAY/NIGHT 모드, 밝기 설정
- `dist/app.js`: 작품 목록, 영상 재생, 스크롤 효과와 화면 설정
- `dist/assets/`: 영상, 썸네일, PDF 기획안, 로봇 로고
- `dist/vendor/`: GSAP, ScrollTrigger, Lenis
