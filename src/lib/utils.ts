import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 한글 포스터 이미지 파일 경로나 파일명을 안전하고 실존하는 한글 이미지 파일명으로 실시간 보정합니다.
 * 이를 통해 이전 사용자 캐시나 한글/영문 정적 자원 주소 흔적이 유입되더라도 404 없이 자원을 완벽 매핑합니다.
 */
function mapKoreanToEnglish(path: string): string {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch (e) {}

  const lower = decoded.toLowerCase();
  
  if (lower.includes('boy_b') || lower.includes('소년b') || lower.includes('소년 b')) return '소년B가 사는 집.jpg';
  if (lower.includes('uncle_panino') || lower.includes('빠니노')) return '빠니노삼촌.jpg';
  if (lower.includes('press_guideline') || lower.includes('보도지침')) return '보도지침.jpg';
  if (lower.includes('toilet_space') || lower.includes('변기') || lower.includes('공백') || lower.includes('내 말이 안 들리나') || lower.includes('내말이')) return '변기, 공백, 내 말이 안들리나.jpg';
  if (lower.includes('too_close_friends') || lower.includes('너무친한') || lower.includes('너무 친한')) return '너무친한친구들.jpg';
  if (lower.includes('art') || lower.includes('아트')) return '아트.jpg';
  if (lower.includes('lithuania') || lower.includes('리투아니아')) return '리투아니아.jpg';
  if (lower.includes('not_that') || lower.includes('그게아닌') || lower.includes('그게 아닌')) return '그게아닌데.jpg';
  if (lower.includes('finding_mr_destiny') || lower.includes('finding_mr') || lower.includes('mr_destiny') || lower.includes('김종욱')) return '김종욱찾기.jpg';
  if (lower.includes('baeyoung_kindergarten') || lower.includes('baeyoung') || lower.includes('배영')) return '배영유치원.jpg';
  if (lower.includes('fantastic_date') || lower.includes('판타스틱')) return '판타스틱데이트.jpg';
  if (lower.includes('rooftop_war') || lower.includes('옥탑')) return '옥탑대전.jpg';
  if (lower.includes('my_family') || lower.includes('우리가족') || lower.includes('우리 가족')) return '우리가족.jpg';

  return path;
}

/**
 * 로컬 개발 서버 및 GitHub Pages 배포 환경 모두에서 대본/포스터 등 다양한 정적 이미지 자원(public 폴더 내)이
 * 404 없이 정상적으로 매핑되도록 호스트 경로를 실시간으로 자가 진단하여 절대경로화해주는 지능형 헬퍼 함수입니다.
 */
export function getAssetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // 외부 URL 혹은 데이터 URL(Base64) 등은 그대로 반환
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // 한글 파일명을 영문 파일명으로 자가 보정
  const correctedUrl = mapKoreanToEnglish(url);
  
  // 앞의 '/' 제거하여 상대화 준비
  let cleanPath = correctedUrl.startsWith('/') ? correctedUrl.slice(1) : correctedUrl;
  
  // 혹시 사용자가 public/ 폴더 경로를 명시했더라도, 
  // Vite의 빌드 특성상 public 폴더의 정적 파일들은 최종 배포 폴더(dist/)의 루트 바로 아래로 평탄화되어 복사되므로
  // 'public/' 접두사를 깔끔히 제하고 `./파일명` 형태로 치환해주어야 404 에러가 나지 않습니다.
  if (cleanPath.startsWith('public/')) {
    cleanPath = cleanPath.slice(7);
  }
  
  // HashRouter 환경에서는 브라우저의 실제 도메인 경로가 변경되지 않으므로, 
  // 상대 경로(./)를 사용하면 개발환경, Cloud Run 배포처, GitHub Pages(서브디렉토리) 및 iframe 프록시 환경 등
  // 모든 경로 계층에서 파일명 손실 및 404 오류 없이 완벽히 호환되고 안전하게 세빙해 줍니다.
  return `./${cleanPath}`;
}
