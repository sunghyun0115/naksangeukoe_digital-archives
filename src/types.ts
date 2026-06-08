export type AccessLevel = '공개' | '요청 시 공개' | '비공개' | '부원공개';
export type CollectionStatus = '확인됨' | '확인 필요' | '미수집' | '수집 불가';

// --- 6대 패싯 (Facet) 클래스 정의 ---

// 1. 공연/행사 Facet
export interface FacetEvent {
  id: string; // EVT-xxxxx
  title: string; // 공연/행사 명칭
  date?: string; // 일시
  type: string; // 정기공연, 새내기배움터공연, 단막극제(워크샵)공연, 연극제공연, 특별공연, 동아리박람회, 대동제 등
  seasonId?: string; // 공연시즌 ID
  placeId?: string; // 장소 ID
  workId?: string; // 작품 ID (원작)
  description?: string; // 설명
  thumbnailUrl?: string; // 썸네일 경로
}

// 2. 인물 Facet
export interface FacetPerson {
  id: string; // PSN-xxxxx
  name: string; // 이름
  englishName?: string; // 영문명
  generation?: string; // 기수 (예: 46기, 47기)
  role?: string; // 주요 역할 (기본 연출, 배우, 조명, 기획 등)
  description?: string; // 인물 상세 소개
}

// 3. 작품 Facet
export interface FacetWork {
  id: string; // WRK-xxxxx
  title: string; // 작품명
  originalCreator?: string; // 원작자 / 각색자
  type?: string; // 창작, 번역, 각색, 비각색 등 (가치유형)
  description?: string; // 작품 소개 / 줄거리 / 창작 시기
  sourceLink?: string; // 작품 출처 / 네이버카페 등
}

// 4. 장소 Facet
export interface FacetPlace {
  id: string; // PLC-xxxxx
  name: string; // 장소명 (예: 한성대학교 창의관 소극장)
  type?: string; // 교내 공간, 외부 공연장, 연습실 등
  address?: string; // 위치 주소
  description?: string; // 장소 설명
}

// 5. 공연시즌 Facet
export interface FacetSeason {
  id: string; // SEA-YYYY-코드 (예: SEA-2025-1, SEA-2024-2)
  name: string; // 시즌명 (예: 2025학년도 1학기, 24-2학기 등)
  startDate?: string; // 학기/시즌 시작일
  endDate?: string; // 시즌 종료일
  description?: string; // 시즌 전반 정보 / 흐름
}

// 6. 기록물 Facet (실제 보존 파일/게시글)
export interface FacetRecord {
  id: string; // REC-xxxxx
  title: string; // 기록물명
  type: '대본' | '포스터·홍보물' | '영상' | '사진' | '회의록' | '행정문서' | '활동자료'; // 유형
  format: string; // 파일 형식 (JPG, PNG, PDF, HWP, MP4, URL 등)
  creator?: string; // 생산자/기증자
  rights: AccessLevel; // 접근 등급 (공개, 부원공개, 요청 시 공개, 비공개)
  source?: string; // 수집 출처
  creationDate?: string; // 생산 시기
  status: CollectionStatus; // 수집 상태
  externalLink?: string; // 외부 링크 (유튜브, 구글문서, 서울연극센터 등)
  thumbnailUrl?: string; // 썸네일 이미지 링크
  description?: string; // 관련 상세 기록
  
  // 계층 정보 (표준 아카이브 분류 준용)
  collectionId: string; // COL-01
  seriesId: string; // SER-01, SER-02
  subseriesId: string; // SUB-01-001 등
  
  // 패싯 연계 관계 정보 (식별자를 통해 서로 유기적으로 연계)
  eventId?: string; // 관련 공연/행사 ID
  workId?: string; // 관련 작품 ID
  personIds?: string[]; // 관련 참여자 ID 리스트
  placeId?: string; // 관련 장소 ID
  seasonId?: string; // 관련 시즌 ID
}

// 계층 구조 자체 정보 모델 (계층 정렬 및 도식용)
export interface ArchiveHierarchyNode {
  id: string; // COL-01, SER-01, SUB-01-001 등
  level: 'Collection' | 'Series' | 'Sub-series';
  name: string;
  parentId?: string;
  description?: string;
}

// 유기적 관계 데이터 모델 (A -> B의 관계를 정의)
export interface RelationData {
  id: string;
  sourceId: string; // 예: EVT-xxxxx / REC-xxxxx
  sourceType: 'Event' | 'Person' | 'Work' | 'Place' | 'Season' | 'Record';
  targetId: string;
  targetType: 'Event' | 'Person' | 'Work' | 'Place' | 'Season' | 'Record';
  relationType: string; // 예: isPerformedAt, contributor, creator, isResourceOf, tookPlaceIn 등
  relationLabel: string; // 한글 설명 (예: "A는 B에서 공연되었다.", "A의 출연진이다.")
}
