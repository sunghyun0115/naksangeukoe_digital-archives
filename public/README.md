# Public Static Assets Directory

이 디렉토리는 이미지, 폰트, 포스터 등 **정적 에셋(Static Assets)**을 관리하기 위한 폴더입니다.

## 사용 방법

1. **여기에 이미지 업로드**:
   - 파일 탐색기나 업로드 방식을 사용해 이 `public` 폴더 안에 이미지 파일을 넣습니다. (예: `poster_01.jpg`)

2. **코드 내에서 경로 참조**:
   - 이 디렉토리 안에 들어간 파일들은 빌드 시 루트 `/` 경로로 매핑됩니다.
   - 따라서 코드나 아카이브 데이터 등에서 참조할 때 아래와 같이 사용하시면 됩니다.
     ```ts
     // 예: public/poster_01.jpg 에 저장한 경우
     thumbnailUrl: "/poster_01.jpg"
     ```

이렇게 하시면 GitHub에 코드를 업로드하고 배포(Vercel, GitHub Pages, Netlify 등)하더라도 모든 이미지가 영구적으로 안전하게 로딩됩니다!
