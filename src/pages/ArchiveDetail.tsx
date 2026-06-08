import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Share2, 
  ExternalLink, 
  Lock, 
  User, 
  Calendar, 
  Tag, 
  Info, 
  Database, 
  FileText, 
  Drama, 
  MapPin, 
  Clock, 
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  FACET_PEOPLE, 
  FACET_WORKS, 
  FACET_PLACES, 
  FACET_SEASONS, 
  HIERARCHY_NODES,
  SEMANTIC_RELATIONS
} from '../data/mockData';
import { useArchive } from '../contexts/ArchiveContext';
import StatusBadge from '../components/StatusBadge';
import { cn, getAssetUrl } from '../lib/utils';

function getYouTubeEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

export default function ArchiveDetail() {
  const { id } = useParams();
  const { records, events } = useArchive();
  
  // 현재 기록물 (Record Facet)
  const record = useMemo(() => records.find(r => r.id === id), [id, records]);

  // 유튜브 임베드 가능 여부 추출
  const youtubeEmbedUrl = useMemo(() => {
    if (!record || record.rights === '비공개') return null;
    return getYouTubeEmbedUrl(record.externalLink);
  }, [record]);

  // 선택된 연계 개식 정보 모달/팝업 상태
  const [activeRelationDetails, setActiveRelationDetails] = useState<{
    id: string;
    type: 'Event' | 'Person' | 'Work' | 'Place' | 'Season';
    name: string;
    sub?: string;
    desc?: string;
    ex1?: string;
    ex2?: string;
    relatedItems?: Array<{ id: string; title: string; type: string; format: string }>;
  } | null>(null);

  // 복사 피드백 방치 상태
  const [copied, setCopied] = useState(false);

  // 현재 공연(Event) 하위에 속하면서 현재 기록물 제외한 다른 기록물들 (동일 공연 연계 아카이브)
  const otherRecordsOfSameEvent = useMemo(() => {
    if (!record || !record.eventId) return [];
    return records.filter(r => r.eventId === record.eventId && r.id !== record.id);
  }, [record, records]);

  // 1. 해당 기록물의 상위 계층 구하기
  const subseriesNode = useMemo(() => {
    if (!record) return null;
    return HIERARCHY_NODES.find(n => n.id === record.subseriesId);
  }, [record]);

  const seriesNode = useMemo(() => {
    if (!record) return null;
    return HIERARCHY_NODES.find(n => n.id === record.seriesId);
  }, [record]);

  // 2. 다른 6대 패싯 연계 데이터 매핑
  const relatedEvent = useMemo(() => {
    if (!record?.eventId) return null;
    return events.find(e => e.id === record.eventId);
  }, [record, events]);

  const relatedWork = useMemo(() => {
    if (!record?.workId) return null;
    return FACET_WORKS.find(w => w.id === record.workId);
  }, [record]);

  const relatedPlace = useMemo(() => {
    if (!record?.placeId) return null;
    return FACET_PLACES.find(p => p.id === record.placeId);
  }, [record]);

  const relatedSeason = useMemo(() => {
    if (!record?.seasonId) return null;
    return FACET_SEASONS.find(s => s.id === record.seasonId);
  }, [record]);

  const relatedPeople = useMemo(() => {
    if (!record?.personIds) return [];
    return FACET_PEOPLE.filter(p => record.personIds?.includes(p.id));
  }, [record]);

  // 3. 기록물의 릴레이션 관계 스키마 구하기
  const semanticRelations = useMemo(() => {
    if (!record) return [];
    return SEMANTIC_RELATIONS.filter(rel => rel.sourceId === record.id || rel.targetId === record.id);
  }, [record]);

  if (!record) {
    return (
      <div className="pt-32 text-center min-h-screen bg-gray-50/50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FileText className="w-16 h-16 text-stone-900 mx-auto mb-4 stroke-1" />
          <h1 className="text-xl font-bold mb-2">기록물을 찾을 수 없습니다.</h1>
          <p className="text-gray-500 text-xs mb-6 font-medium">잘못되었거나 유실된 기록물 식별자입니다.</p>
          <Link to="/archive" className="px-6 py-3 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-stone-850 transition-colors">
            아카이브 목록으로 이동
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = record.rights === '비공개';
  const [imgError, setImgError] = useState(false);
  const rawUrl = record.thumbnailUrl || relatedEvent?.thumbnailUrl;
  const displayThumbnail = !!rawUrl && !imgError;

  // 패싯 관련 항목 세부 상세 조회 팝업 열기 매니저
  const openRelationModal = (type: 'Event' | 'Person' | 'Work' | 'Place' | 'Season', entityId: string) => {
    let details: any = null;
    let items: Array<{ id: string; title: string; type: string; format: string }> = [];

    if (type === 'Event') {
      const e = events.find(item => item.id === entityId);
      if (e) {
        details = { id: entityId, type, name: e.title, sub: e.type, desc: e.description, ex1: `일시: ${e.date || '미상'}`, ex2: `시즌 ID: ${e.seasonId}` };
        items = records.filter(r => r.eventId === entityId);
      }
    } else if (type === 'Person') {
      const p = FACET_PEOPLE.find(item => item.id === entityId);
      if (p) {
        details = { id: entityId, type, name: p.name, sub: `${p.generation} (${p.englishName || ''})`, desc: p.description, ex1: `주요 역할: ${p.role}` };
        items = records.filter(r => r.personIds?.includes(entityId));
      }
    } else if (type === 'Work') {
      const w = FACET_WORKS.find(item => item.id === entityId);
      if (w) {
        details = { id: entityId, type, name: w.title, sub: `원작자: ${w.originalCreator || '자체 창작'}`, desc: w.description, ex1: `유형: ${w.type || '기본 정보 없음'}` };
        items = records.filter(r => r.workId === entityId);
      }
    } else if (type === 'Place') {
      const pl = FACET_PLACES.find(item => item.id === entityId);
      if (pl) {
        details = { id: entityId, type, name: pl.name, sub: pl.type, desc: pl.description, ex1: `위치: ${pl.address || ''}` };
        items = records.filter(r => r.placeId === entityId);
      }
    } else if (type === 'Season') {
      const s = FACET_SEASONS.find(item => item.id === entityId);
      if (s) {
        details = { id: entityId, type, name: s.name, sub: `기간: ${s.startDate || ''} ~ ${s.endDate || ''}`, desc: s.description };
        items = records.filter(r => r.seasonId === entityId);
      }
    }

    if (details) {
      details.relatedItems = items;
      setActiveRelationDetails(details);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50/55 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 뒤로가기 탐색 */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/archive" 
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-stone-900 transition-colors uppercase tracking-widest group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-gray-300" />
            통합 탐색 목록
          </Link>
          
          <div className="text-gray-400 text-xs font-bold font-mono">
            ID: {record.id}
          </div>
        </div>

        {/* 대시보드 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* 좌측: 기록물 가제트와 비전 프리뷰 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 미디어 / 파일 프리뷰 판넬 */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden aspect-video relative flex items-center justify-center bg-gray-50">
              {isLocked ? (
                <div className="text-center p-8 max-w-sm">
                  <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Lock className="w-6 h-6 text-stone-900" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 mb-2">비공개 처리된 데이터입니다</h2>
                  <p className="text-gray-400 font-semibold text-xs leading-relaxed">
                    동아리 수집 가이드라인에 따른 부원 비상연락망 등의 비공개 등급 자료입니다. 허가 없이 열람하거나 조작될 수 없습니다.
                  </p>
                </div>
              ) : youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={record.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : displayThumbnail ? (
                <img 
                  src={getAssetUrl(rawUrl)} 
                  alt={record.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (e.currentTarget.src.includes('unsplash.com') || e.currentTarget.src.includes('images.unsplash.com')) {
                      setImgError(true);
                      return;
                    }
                    
                    const fallbackImages: Record<string, string> = {
                      'EVT-00001': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800', // 소년B
                      'EVT-00002': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800', // 빠니노 삼촌
                      'EVT-00003': 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800', // 보도지침
                    };
                    
                    const fallbackUrl = (record.eventId && fallbackImages[record.eventId])
                      || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800';
                      
                    e.currentTarget.src = fallbackUrl;
                  }}
                />
              ) : (
                <div className="text-center text-gray-300 p-8">
                  <FileText className="w-14 h-14 stroke-[1.2] mx-auto mb-3 text-gray-200" />
                  <p className="font-black text-xs text-gray-400 tracking-wider">미디어 원치 비시각화 포맷 ({record.format})</p>
                  <p className="text-[10px] text-gray-400/80 mt-1">대본 텍스트 파일이나 행정 문서는 우측 파일 열기를 참고하십시오.</p>
                </div>
              )}
              
              {/* 오른쪽 하단 바로보기 핫링크 */}
              {!isLocked && record.externalLink && (
                <div className="absolute bottom-4 right-4 flex gap-2.5">
                  <a 
                    href={record.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-stone-900 text-white text-xs font-black rounded-lg shadow-xl hover:bg-stone-800 transition-all flex items-center gap-1.5 group"
                  >
                    아카이브 원천 보기
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </div>

            {/* 기록물 의의 및 설명 설명회 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Info className="w-5 h-5 text-stone-900 shrink-0" />
                기록 내용 및 맥락 정보 (ISAD(G))
              </h2>
              <div className="text-gray-600 leading-relaxed text-sm font-semibold whitespace-pre-wrap">
                {record.description || '본 기록물에 대한 추가적인 수장 설명이 작성되어 있지 않습니다.'}
              </div>
            </div>

            {/* ★ 핵심 기능: 하이브리드 패싯 다차원 연계망 (Linked Facet Data Network) ★ */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-stone-900 shrink-0" />
                  다차원 패싯 릴레이션 관계망 (Facet Relation)
                </h3>
                <p className="text-xs text-gray-400 font-bold mt-1">
                  이 기록물을 조명하는 다차원 패싯 정보 연계망입니다. 각 분류 인자를 누르면 상세 맥락 해설을 열람하실 수 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. 관련 공연 패싯 */}
                {relatedEvent && (
                  <div 
                    onClick={() => openRelationModal('Event', relatedEvent.id)}
                    className="p-4 rounded-2xl border border-gray-100 hover:border-stone-900/30 hover:bg-stone-50 cursor-pointer transition-all flex items-start gap-3.5 group"
                  >
                    <div className="p-2.5 bg-stone-100 rounded-xl text-stone-900 shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                      <Drama className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">공연/행사 패싯</div>
                      <div className="text-xs font-black text-gray-800 line-clamp-1">{relatedEvent.title}</div>
                      <div className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-stone-900" /> {relatedEvent.type}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 관련 작품 패싯 */}
                {relatedWork && (
                  <div 
                    onClick={() => openRelationModal('Work', relatedWork.id)}
                    className="p-4 rounded-2xl border border-gray-100 hover:border-stone-900/30 hover:bg-stone-5s cursor-pointer transition-all flex items-start gap-3.5 group"
                  >
                    <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">원작품 패싯 (Work)</div>
                      <div className="text-xs font-black text-gray-800 line-clamp-1">{relatedWork.title}</div>
                      <div className="text-[10px] font-bold text-gray-400 mt-1">
                        원작자: {relatedWork.originalCreator || '자체 창작'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 관련 장소 패싯 */}
                {relatedPlace && (
                  <div 
                    onClick={() => openRelationModal('Place', relatedPlace.id)}
                    className="p-4 rounded-2xl border border-gray-100 hover:border-stone-900/30 hover:bg-stone-5s cursor-pointer transition-all flex items-start gap-3.5 group"
                  >
                    <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">공연공간 패싯 (Place)</div>
                      <div className="text-xs font-black text-gray-800 line-clamp-1">{relatedPlace.name}</div>
                      <div className="text-[10px] font-bold text-gray-400 mt-1">{relatedPlace.type}</div>
                    </div>
                  </div>
                )}

                {/* 4. 관련 공연시즌 패싯 */}
                {relatedSeason && (
                  <div 
                    onClick={() => openRelationModal('Season', relatedSeason.id)}
                    className="p-4 rounded-2xl border border-gray-100 hover:border-stone-900/30 hover:bg-stone-5s cursor-pointer transition-all flex items-start gap-3.5 group"
                  >
                    <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">공연시즌 패싯 (Season)</div>
                      <div className="text-xs font-black text-gray-800 line-clamp-1">{relatedSeason.name}</div>
                      <div className="text-[10px] font-bold text-gray-400 mt-1">시간 범위 보존 범위</div>
                    </div>
                  </div>
                )}

              </div>

              {/* 참여 인물(Person) 패싯 카드 */}
              {relatedPeople.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-900" /> 연계 참여 인물 패싯 (People)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {relatedPeople.map(p => (
                      <span
                        key={p.id}
                        onClick={() => openRelationModal('Person', p.id)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-stone-100 hover:text-stone-900 hover:border-stone-200 cursor-pointer transition-all text-xs font-black text-gray-700"
                      >
                        <Award className="w-3.5 h-3.5 text-gray-300" />
                        {p.name}
                        <span className="text-[9px] font-bold text-gray-400">{p.generation} {p.role?.split('/')[0]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ★ 추가: 동일 공연 연계 기록물 컬렉션 (Same Event Archives) ★ */}
            {relatedEvent && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Drama className="w-5 h-5 text-stone-900 shrink-0" />
                    《{relatedEvent.title}》 공동 생산 아카이브 ({otherRecordsOfSameEvent.length + 1}개)
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    동일 공연 기획 하에 수집 생산된 연쇄 보존 항목입니다. (클릭하면 상세 페이지로 교체 이동합니다)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 현재 보고 있는 기록물 표시 */}
                  <div className="p-4 rounded-2xl border-2 border-stone-900 bg-stone-50 flex items-start gap-3.5 relative overflow-hidden">
                    <div className="absolute top-2.5 right-2.5 text-[8.5px] bg-stone-900 text-stone-100 font-black px-2 py-0.5 rounded uppercase">현재 열람 중</div>
                    <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-black text-xs shrink-0 font-sans mt-0.5 leading-none">
                      {record.format[0]}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-stone-900 font-bold block">[{record.format}] {record.id}</span>
                      <strong className="text-xs font-black text-stone-900 block line-clamp-1 mt-0.5 pr-14">{record.title}</strong>
                      <span className="text-[10px] text-gray-400 font-bold mt-1 block">{record.type} · {record.creator || '낙산극회'}</span>
                    </div>
                  </div>

                  {/* 동일 공연의 다른 기록물들 */}
                  {otherRecordsOfSameEvent.map(r => (
                    <Link
                      key={r.id}
                      to={`/archive/${r.id}`}
                      className="p-4 rounded-2xl border border-stone-200/60 hover:border-stone-900/40 hover:bg-stone-50 cursor-pointer transition-all flex items-start gap-3.5"
                    >
                      <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center font-black text-xs shrink-0 font-sans mt-0.5 leading-none border border-stone-200/40">
                        {r.format[0]}
                      </div>
                      <div className="flex-grow">
                        <span className="text-[9px] font-mono text-stone-400 font-bold block">[{r.format}] {r.id}</span>
                        <strong className="text-xs font-black text-stone-850 block line-clamp-1 mt-0.5">{r.title}</strong>
                        <span className="text-[10px] text-gray-400 font-semibold mt-1 block">{r.type} · {r.creator || '낙산극회'}</span>
                      </div>
                    </Link>
                  ))}
                  
                  {otherRecordsOfSameEvent.length === 0 && (
                    <div className="sm:col-span-2 py-5 text-center text-xs font-bold text-stone-400 bg-stone-50 rounded-2xl border border-stone-200/50">
                      동일 공연 범주로 수집된 다른 미디어(대본, 영상 포맷 등)가 아직 데이터베이스에 등록되어 있지 않습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* 우측: 메타데이터 핵심 테이블 뷰 (표준 아카이브 기술 준용) */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              
              {/* 타이틀 헤더 */}
              <div className="border-b border-gray-100 pb-5">
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <StatusBadge status={record.status} />
                  <span className="bg-stone-100 py-0.5 px-2 rounded text-[10px] font-black text-stone-900 tracking-wider">
                    {record.format}
                  </span>
                </div>
                
                <h1 className="text-xl font-black text-gray-900 leading-snug mb-3">
                  {record.title}
                </h1>

                {/* 계층 인덱스 디스플레이 (시립미술관 스타일 트리) */}
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-stone-800 uppercase tracking-widest mt-1">
                  <span>[C] {record.collectionId}</span>
                  <span className="text-gray-300">/</span>
                  <span>[S] {seriesNode?.name}</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-500">[SS] {subseriesNode?.name}</span>
                </div>
              </div>

              {/* 메타데이터 ISAD 스탠다드 */}
              <div className="space-y-5">
                {[
                  { label: '참조 코드 (식별자)', value: record.id, icon: Layers },
                  { label: '생산자 / 기증처', value: record.creator || '미상', icon: User },
                  { label: '기록물 유형 (Genre)', value: record.type, icon: Tag },
                  { label: '데이터 포맷 (File)', value: record.format, icon: Database },
                  { label: '접근 등급 (Rights)', value: record.rights, icon: Lock },
                  { label: '수집 출처 (Source)', value: record.source || '현장 수집', icon: Info },
                  { label: '최초 생산일자', value: record.creationDate || '날짜정보 없음', icon: Calendar },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                    <div className="mt-0.5 shrink-0">
                      <item.icon className="w-4 h-4 text-gray-300" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="font-extrabold text-gray-800">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="pt-6 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href).catch(() => {});
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-grow py-3 px-4 bg-gray-50 hover:bg-stone-100 hover:text-stone-900 text-gray-600 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? '주소 복사 완료!' : '공유하기 (주소 복사)'}
                </button>
              </div>

            </div>

            {/* 기술 및 관리 가이드라인 고화 정보 박스 */}
            {subseriesNode?.description && (
              <div className="bg-gray-900 rounded-3xl p-6 text-gray-100 relative overflow-hidden shadow-md">
                <h4 className="text-xs font-sans font-bold tracking-widest text-stone-400 uppercase mb-2">서브시리즈 해설</h4>
                <p className="text-[11px] leading-relaxed text-gray-400 font-semibold">
                  {subseriesNode.description}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* --- 세부 패싯 관계 조회 팝업 드로어 (Modal) --- */}
      <AnimatePresence>
        {activeRelationDetails && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl border border-gray-100 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* 모달 상단 헤더 */}
              <div className="border-b border-gray-100 pb-4 mb-5 flex justify-between items-start">
                <div>
                  <div className="inline-flex py-1 px-2.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-stone-100 text-stone-900 mb-2">
                    {activeRelationDetails.type} Facet Info
                  </div>
                  <h3 className="text-xl font-black text-stone-900 leading-snug">
                    {activeRelationDetails.name}
                  </h3>
                  {activeRelationDetails.sub && (
                    <p className="text-xs font-extrabold text-stone-850 mt-1">{activeRelationDetails.sub}</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveRelationDetails(null)}
                  className="p-1 px-3 hover:bg-stone-100 text-stone-500 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  닫기
                </button>
              </div>

              {/* 2컬럼 레이아웃 바디 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto flex-grow pb-4 pr-1">
                {/* 좌측 컬럼: 패싯 어휘 메타데이터 해설 */}
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">세부 정보 설명</div>
                    <p className="text-xs font-semibold text-gray-650 leading-relaxed bg-stone-50 rounded-2xl p-4 border border-stone-200/40">
                      {activeRelationDetails.desc || '해당 패싯 객체의 설명이 제공되지 않습니다.'}
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-stone-50 p-4 rounded-2xl text-[11px] font-bold text-stone-600 border border-stone-200">
                    <div className="text-[10px] uppercase font-black text-stone-950 mb-1 tracking-wider">상세 스펙 분류 연동</div>
                    {activeRelationDetails.ex1 && <div className="flex items-center gap-2"><span>•</span> {activeRelationDetails.ex1}</div>}
                    {activeRelationDetails.ex2 && <div className="flex items-center gap-2"><span>•</span> {activeRelationDetails.ex2}</div>}
                    <div className="text-[8.5px] font-black tracking-widest text-stone-400 uppercase mt-2.5 pt-2 border-t border-stone-200">Naksan Archive Facet System Spec</div>
                  </div>
                </div>

                {/* 우측 컬럼: 연쇄 보존 기록물 리스트 */}
                <div className="flex flex-col h-full space-y-4">
                  <div className="text-xs font-black text-gray-450 uppercase tracking-wider flex items-center justify-between">
                    <span>이 패싯의 연쇄 보존 기록물 (총 {activeRelationDetails.relatedItems?.length || 0}건)</span>
                    {activeRelationDetails.relatedItems && activeRelationDetails.relatedItems.length > 0 && (
                      <span className="text-[9px] text-stone-900 border border-stone-200 bg-stone-100 px-2 py-0.5 rounded font-bold font-sans animate-pulse">클릭 시 상세 이동</span>
                    )}
                  </div>

                  <div className="flex-grow overflow-y-auto space-y-2 max-h-[300px] md:max-h-[380px] pr-1">
                    {activeRelationDetails.relatedItems && activeRelationDetails.relatedItems.length > 0 ? (
                      activeRelationDetails.relatedItems.map(item => (
                        <Link
                          key={item.id}
                          to={`/archive/${item.id}`}
                          onClick={() => setActiveRelationDetails(null)}
                          className="block p-3 bg-stone-50 hover:bg-stone-100 hover:text-stone-900 rounded-2xl border border-stone-200/50 hover:border-stone-200 transition-all text-xs font-bold shadow-xs hover:shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-[9px] font-black bg-stone-200/60 text-stone-600 rounded px-1.5 py-0.5 mr-1.5 uppercase tracking-wide">
                                {item.format}
                              </span>
                              <span className="font-extrabold truncate">{item.title}</span>
                              <span className="block text-[10px] text-stone-400 mt-1 font-semibold">{item.creator || '낙산극회'} · {item.type}</span>
                            </div>
                            <span className="text-[9px] font-mono shrink-0 text-stone-500 bg-white border border-stone-200 px-2 py-0.5 rounded-md font-bold">
                              {item.id}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400 text-xs font-bold py-16">
                        <Layers className="w-8 h-8 opacity-20 mb-2" />
                        <span>이 패싯 항목에 종속된 아카이브 기록물이 현재 등록되어 있지 않습니다.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 하단 푸터 액션 */}
              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setActiveRelationDetails(null)}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  확인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
