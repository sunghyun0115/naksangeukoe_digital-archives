import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Layers, 
  Filter, 
  SlidersHorizontal, 
  User, 
  MapPin, 
  FolderOpen, 
  Clock, 
  FileText, 
  Drama,
  ChevronRight,
  RefreshCw,
  Info,
  Image as ImageIcon,
  Upload,
  Check,
  Trash2,
  X,
  BookOpen,
  ArrowRight,
  Network
} from 'lucide-react';
import { 
  HIERARCHY_NODES, 
  FACET_PEOPLE, 
  FACET_WORKS, 
  FACET_PLACES, 
  FACET_SEASONS 
} from '../data/mockData';
import { useSearchParams } from 'react-router-dom';
import { useArchive } from '../contexts/ArchiveContext';
import ArchiveCard from '../components/ArchiveCard';
import { cn, getAssetUrl } from '../lib/utils';

export default function ArchiveList() {
  const { 
    records, 
    events, 
    updateRecordThumbnail, 
    updateEventThumbnail, 
    resetAllThumbnails 
  } = useArchive();

  const [searchParams] = useSearchParams();

  // 'hierarchy' or 'facet'
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'facet'>('hierarchy');
  const [search, setSearch] = useState('');
  
  // --- [1] 서울시립미술아카이브 계층 구조 상태 ---
  const [selectedSeries, setSelectedSeries] = useState<string>('전체');
  const [selectedSubseries, setSelectedSubseries] = useState<string>('전체');
  const [selectedFileInHierarchy, setSelectedFileInHierarchy] = useState<string>('전체');
  const [selectedItemTypeInHierarchy, setSelectedItemTypeInHierarchy] = useState<string>('전체');

  const seriesNodes = useMemo(() => HIERARCHY_NODES.filter(n => n.level === 'Series'), []);
  const subseriesNodes = useMemo(() => {
    if (selectedSeries === '전체') return [];
    return HIERARCHY_NODES.filter(n => n.level === 'Sub-series' && n.parentId === selectedSeries);
  }, [selectedSeries]);

  // 서브시리즈(Sub-series) 하위의 구체적인 파일철(File) 리스트를 동적으로 산출 (계층 4단계 - 5단계 연동 모델)
  const filesForHierarchy = useMemo(() => {
    if (selectedSeries === '전체' || selectedSubseries === '전체') return [];

    const subRecs = records.filter(r => r.subseriesId === selectedSubseries);
    
    if (selectedSeries === 'SER-01') {
      // 1. 공연 시리즈 (SER-01): 해당 서브시리즈 유형에 매칭되는 공연(Events)들이 개별 '파일철' 역할을 함
      const relatedEvents = events.filter(evt => {
        const subNode = HIERARCHY_NODES.find(n => n.id === selectedSubseries);
        if (!subNode) return false;
        const subName = subNode.name;
        
        if (subName === '정기공연') return evt.type === '정기공연';
        if (subName === '새내기배움터 공연') return evt.type === '새내기배움터 공연';
        if (subName === '단막극제 공연') return evt.type === '단막극제 공연' || evt.type === '단막극' || evt.type === '단막극제';
        if (subName === '워크샵 공연') return evt.type === '워크샵' || evt.type === '워크샵 공연';
        if (subName === '연극제 공연') return evt.type === '연극제 공연' || evt.type === '연극제';
        if (subName === '특별공연') return evt.type === '특별공연';
        return false;
      });

      return relatedEvents.map(evt => ({
        id: evt.id,
        name: evt.title,
        description: `${evt.date || '수집 당시'} 상연작 관련 수집 대본 및 포스터, 기록물철`,
        type: 'event'
      }));
    } else {
      // 2. 축제·행사(SER-02) 및 운영·행정(SER-03) 시리즈: 기수별, 연도별, 용도별 고유 파일철 가상 생성
      const fileMap: { [key: string]: { id: string; name: string; description: string; type: string } } = {};
      
      subRecs.forEach(rec => {
        const year = rec.creationDate ? rec.creationDate.substring(0, 4) : '2024';
        const creator = rec.creator || '낙산극회 운영진';
        
        let fileId = '';
        let fileName = '';
        let fileDesc = '';
        
        if (selectedSubseries === 'SUB-02-001') { // 동아리 박람회
          fileId = `FILE-DB-${year}`;
          fileName = `${year}년도 신입생 동박(동아리 박람회) 홍보철`;
          fileDesc = `${year}학년도 낙산극회 부스 행사 계획서 및 방명록 사진 자료 묶음`;
        } else if (selectedSubseries === 'SUB-02-002') { // 대동제
          fileId = `FILE-DD-${year}`;
          fileName = `${year}년도 대동제 가을 축제 참가철`;
          fileDesc = `한성대 대동제 부스(방탈출, 페인팅) 운영 기록 및 집행 영수 포함`;
        } else if (selectedSubseries === 'SUB-03-001') { // 회의록
          const isOB = creator.includes('OB') || rec.title.includes('OB');
          fileId = isOB ? `FILE-MEET-OB` : `FILE-MEET-${year}`;
          fileName = isOB ? `낙산극회 OB 위원회 교류 및 자문 회의록철` : `${year}학년도 정기/임원 집행 회의록철`;
          fileDesc = isOB ? `OB 위원 자문 회의 및 기록 이관 연안 협정` : `${year}년 활동 연도 동아리 운영 주요 의결 내용 보존철`;
        } else if (selectedSubseries === 'SUB-03-002') { // 임원진 명단 및 인수인계
          const gen = creator.match(/\d+기/) ? creator.match(/\d+기/)![0] : '운영진';
          fileId = `FILE-IN-${gen}`;
          fileName = `제${gen} 운영 임원진 조직도 및 수기 인수인계서철`;
          fileDesc = `차기 기수 전수를 위한 조직 관리 규약, 노하우 및 인프라 매뉴얼`;
        } else if (selectedSubseries === 'SUB-03-003') { // 행정문서
          const isRent = rec.title.includes('대관') || rec.title.includes('신청');
          fileId = isRent ? `FILE-ADMIN-RENT` : `FILE-ADMIN-REPORT`;
          fileName = isRent ? `교내 강당 및 연습 공간 정식 대관/사용 허가철` : `동아리 예회계 및 결산 감사보고 서류철`;
          fileDesc = isRent ? `한성대 창의관 소강당 및 연습실 배정 공문` : `자치 기수 감사용 영수 및 정밀 수지 균형 보고서`;
        } else {
          fileId = `FILE-GEN-${year}`;
          fileName = `${year}년도 활동 서브 파일철`;
          fileDesc = `기타 정밀 수집 정책에 따른 예비 보존철`;
        }
        
        fileMap[fileId] = { id: fileId, name: fileName, description: fileDesc, type: 'virtual' };
      });
      
      return Object.values(fileMap);
    }
  }, [selectedSeries, selectedSubseries, records, events]);

  // 대메뉴나 소메뉴 클릭 시 서브 검색 동기화
  const handleSeriesSelect = (id: string) => {
    setSelectedSeries(id);
    setSelectedSubseries('전체');
    setSelectedFileInHierarchy('전체');
    setSelectedItemTypeInHierarchy('전체');
  };

  const handleSubseriesSelect = (id: string) => {
    setSelectedSubseries(id);
    setSelectedFileInHierarchy('전체');
    setSelectedItemTypeInHierarchy('전체');
  };

  // 4단계(파일철)까지 완전 매칭된 상태에서 보유하고 있는 원천 기록물들의 고유 '유형(type)' 목록 추출 (5단계 ITEM LEVEL 분류용)
  const availableTypesInHierarchy = useMemo(() => {
    if (activeTab !== 'hierarchy') return [];

    // 현재 선택 단계까지의 기반 데이터를 필터링
    const matchedRecords = records.filter(record => {
      // 1. 기본 텍스트 매칭
      const matchesSearch = 
        record.title.toLowerCase().includes(search.toLowerCase()) || 
        record.description?.toLowerCase().includes(search.toLowerCase()) ||
        record.creator?.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // 2. 상위 계층 매칭 (시리즈, 서브시리즈, 파일철까지만 필터링!)
      const matchesSeries = selectedSeries === '전체' || record.seriesId === selectedSeries;
      const matchesSubseries = selectedSubseries === '전체' || record.subseriesId === selectedSubseries;
      
      let matchesFile = true;
      if (selectedFileInHierarchy !== '전체') {
        if (selectedSeries === 'SER-01') {
          matchesFile = record.eventId === selectedFileInHierarchy;
        } else {
          const year = record.creationDate ? record.creationDate.substring(0, 4) : '2024';
          const creator = record.creator || '낙산극회 운영진';
          
          if (selectedFileInHierarchy.startsWith('FILE-DB-')) {
            matchesFile = selectedSubseries === 'SUB-02-001' && year === selectedFileInHierarchy.replace('FILE-DB-', '');
          } else if (selectedFileInHierarchy.startsWith('FILE-DD-')) {
            matchesFile = selectedSubseries === 'SUB-02-002' && year === selectedFileInHierarchy.replace('FILE-DD-', '');
          } else if (selectedFileInHierarchy === 'FILE-MEET-OB') {
            matchesFile = selectedSubseries === 'SUB-03-001' && (creator.includes('OB') || record.title.includes('OB'));
          } else if (selectedFileInHierarchy.startsWith('FILE-MEET-')) {
            const fileYear = selectedFileInHierarchy.replace('FILE-MEET-', '');
            const isOB = creator.includes('OB') || record.title.includes('OB');
            matchesFile = selectedSubseries === 'SUB-03-001' && !isOB && year === fileYear;
          } else if (selectedFileInHierarchy.startsWith('FILE-IN-')) {
            const fileGen = selectedFileInHierarchy.replace('FILE-IN-', '');
            const gen = creator.match(/\d+기/) ? creator.match(/\d+기/)![0] : '운영진';
            matchesFile = selectedSubseries === 'SUB-03-002' && gen === fileGen;
          } else if (selectedFileInHierarchy === 'FILE-ADMIN-RENT') {
            const isRent = record.title.includes('대관') || record.title.includes('신청');
            matchesFile = selectedSubseries === 'SUB-03-003' && isRent;
          } else if (selectedFileInHierarchy === 'FILE-ADMIN-REPORT') {
            const isRent = record.title.includes('대관') || record.title.includes('신청');
            matchesFile = selectedSubseries === 'SUB-03-003' && !isRent;
          } else if (selectedFileInHierarchy.startsWith('FILE-GEN-')) {
            matchesFile = year === selectedFileInHierarchy.replace('FILE-GEN-', '');
          }
        }
      }

      return matchesSeries && matchesSubseries && matchesFile;
    });

    // 중복 없는 타입 어레이 추출
    const typesSet = new Set<string>();
    matchedRecords.forEach(r => {
      if (r.type) typesSet.add(r.type);
    });

    return Array.from(typesSet);
  }, [activeTab, search, selectedSeries, selectedSubseries, selectedFileInHierarchy, records]);

  // --- [2] 남산예술센터 식 탑 패싯 카테고리 기획 상태 ---
  // 선택할 수 있는 6가지 대표 패싯 차원
  const facetDimensions = [
    { id: 'event', name: '공연/행사', icon: Drama, color: 'text-stone-900 bg-stone-100 border-stone-200 hover:bg-stone-200/50' },
    { id: 'person', name: '인물 (참여자)', icon: User, color: 'text-stone-900 bg-stone-100 border-stone-200 hover:bg-stone-200/50' },
    { id: 'work', name: '작품 (희곡)', icon: FileText, color: 'text-stone-900 bg-stone-100 border-stone-200 hover:bg-stone-200/50' },
    { id: 'place', name: '공간 (극장)', icon: MapPin, color: 'text-stone-900 bg-stone-100 border-stone-200 hover:bg-stone-200/50' },
    { id: 'season', name: '공연시즌', icon: Clock, color: 'text-stone-900 bg-stone-100 border-stone-200 hover:bg-stone-200/50' },
    { id: 'type', name: '기록물종류', icon: FolderOpen, color: 'text-stone-900 bg-stone-100 border-stone-200 hover:bg-stone-200/50' }
  ] as const;

  const [activeFacetTab, setActiveFacetTab] = useState<'event' | 'person' | 'work' | 'place' | 'season' | 'type'>('event');

  // 활성화된 패싯 타입 내부에서 실제 기 선택된 세부 인스턴스 ID
  const [selectedEventId, setSelectedEventId] = useState<string>('전체');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('전체');
  const [selectedWorkId, setSelectedWorkId] = useState<string>('전체');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('전체');
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('전체');
  const [selectedRecordType, setSelectedRecordType] = useState<string>('전체');

  const recordTypes = ['대본', '포스터·홍보물', '영상', '사진', '회의록', '행정문서', '활동자료'];

  // Sychronize tab and active facet from searchParams if they exist
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'hierarchy' || tabParam === 'facet') {
      setActiveTab(tabParam);
    }
    
    const facetParam = searchParams.get('facet');
    if (facetParam && ['event', 'person', 'work', 'place', 'season', 'type'].includes(facetParam)) {
      setActiveFacetTab(facetParam as any);
      setActiveTab('facet'); // force facet tab open if a facet is clicked
    }
  }, [searchParams]);

  // --- [3] 포스터 및 이미지 업로드 관리자 모달 상태 ---
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [managerTargetType, setManagerTargetType] = useState<'event' | 'record'>('event');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 대상 변경 시 자동 초기 값 선택
  useEffect(() => {
    if (managerTargetType === 'event') {
      setSelectedTargetId(events[0]?.id || '');
    } else {
      setSelectedTargetId(records[0]?.id || '');
    }
    setPreviewUrl('');
    setInputUrl('');
  }, [managerTargetType, events, records, isManagerOpen]);

  // 드래그 엔 드롭 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        setInputUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        setInputUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUpdate = () => {
    if (!selectedTargetId) return;
    const finalUrl = previewUrl || inputUrl;
    if (!finalUrl) return;

    if (managerTargetType === 'event') {
      updateEventThumbnail(selectedTargetId, finalUrl);
    } else {
      updateRecordThumbnail(selectedTargetId, finalUrl);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsManagerOpen(false);
      setInputUrl('');
      setPreviewUrl('');
    }, 1200);
  };

  // 필터 초기화
  const resetFilters = () => {
    setSelectedSeries('전체');
    setSelectedSubseries('전체');
    setSelectedFileInHierarchy('전체');
    setSelectedItemTypeInHierarchy('전체');
    
    setSelectedEventId('전체');
    setSelectedPersonId('전체');
    setSelectedWorkId('전체');
    setSelectedPlaceId('전체');
    setSelectedSeasonId('전체');
    setSelectedRecordType('전체');

    setSearch('');
  };

  // --- [4] 계층 및 패싯을 통합하는 유기적인 필터 알고리즘 ---
  const finalFilteredRecords = useMemo(() => {
    return records.filter(record => {
      // 1. 공통 텍스트 검색 (제목, 설명, 생산자 매칭)
      const matchesSearch = 
        record.title.toLowerCase().includes(search.toLowerCase()) || 
        record.description?.toLowerCase().includes(search.toLowerCase()) ||
        record.creator?.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. 탭 별 조건 필터링
      if (activeTab === 'hierarchy') {
        const matchesSeries = selectedSeries === '전체' || record.seriesId === selectedSeries;
        const matchesSubseries = selectedSubseries === '전체' || record.subseriesId === selectedSubseries;
        
        // 4단계 파일철(File) 필터링 및 5단계 아이템 유형(Item Type) 필터링 판정 분기
        let matchesFile = true;
        if (selectedFileInHierarchy !== '전체') {
          if (selectedSeries === 'SER-01') {
            // 공연 시리즈: 실제 eventId 비교
            matchesFile = record.eventId === selectedFileInHierarchy;
          } else {
            // 비공연 시리즈: 주입된 가상 파일 ID 규격과 비교 분석
            const year = record.creationDate ? record.creationDate.substring(0, 4) : '2024';
            const creator = record.creator || '낙산극회 운영진';
            
            if (selectedFileInHierarchy.startsWith('FILE-DB-')) {
              matchesFile = selectedSubseries === 'SUB-02-001' && year === selectedFileInHierarchy.replace('FILE-DB-', '');
            } else if (selectedFileInHierarchy.startsWith('FILE-DD-')) {
              matchesFile = selectedSubseries === 'SUB-02-002' && year === selectedFileInHierarchy.replace('FILE-DD-', '');
            } else if (selectedFileInHierarchy === 'FILE-MEET-OB') {
              matchesFile = selectedSubseries === 'SUB-03-001' && (creator.includes('OB') || record.title.includes('OB'));
            } else if (selectedFileInHierarchy.startsWith('FILE-MEET-')) {
              const fileYear = selectedFileInHierarchy.replace('FILE-MEET-', '');
              const isOB = creator.includes('OB') || record.title.includes('OB');
              matchesFile = selectedSubseries === 'SUB-03-001' && !isOB && year === fileYear;
            } else if (selectedFileInHierarchy.startsWith('FILE-IN-')) {
              const fileGen = selectedFileInHierarchy.replace('FILE-IN-', '');
              const gen = creator.match(/\d+기/) ? creator.match(/\d+기/)![0] : '운영진';
              matchesFile = selectedSubseries === 'SUB-03-002' && gen === fileGen;
            } else if (selectedFileInHierarchy === 'FILE-ADMIN-RENT') {
              const isRent = record.title.includes('대관') || record.title.includes('신청');
              matchesFile = selectedSubseries === 'SUB-03-003' && isRent;
            } else if (selectedFileInHierarchy === 'FILE-ADMIN-REPORT') {
              const isRent = record.title.includes('대관') || record.title.includes('신청');
              matchesFile = selectedSubseries === 'SUB-03-003' && !isRent;
            } else if (selectedFileInHierarchy.startsWith('FILE-GEN-')) {
              matchesFile = year === selectedFileInHierarchy.replace('FILE-GEN-', '');
            }
          }
        }
        
        // 5단계인 아이템 유형(selectedItemTypeInHierarchy) 필터링
        const matchesItemType = selectedItemTypeInHierarchy === '전체' || record.type === selectedItemTypeInHierarchy;
        
        return matchesSeries && matchesSubseries && matchesFile && matchesItemType;
      } else {
        // 남산예술센터식 상단 패싯 대메뉴 필터링 연동
        if (activeFacetTab === 'event') {
          return selectedEventId === '전체' || record.eventId === selectedEventId;
        } else if (activeFacetTab === 'person') {
          return selectedPersonId === '전체' || record.personIds?.includes(selectedPersonId) || record.creator?.includes(FACET_PEOPLE.find(p => p.id === selectedPersonId)?.name || 'NONE');
        } else if (activeFacetTab === 'work') {
          return selectedWorkId === '전체' || record.workId === selectedWorkId;
        } else if (activeFacetTab === 'place') {
          return selectedPlaceId === '전체' || record.placeId === selectedPlaceId;
        } else if (activeFacetTab === 'season') {
          return selectedSeasonId === '전체' || record.seasonId === selectedSeasonId;
        } else if (activeFacetTab === 'type') {
          return selectedRecordType === '전체' || record.type === selectedRecordType;
        }
        return true;
      }
    });
  }, [activeTab, activeFacetTab, search, selectedSeries, selectedSubseries, selectedFileInHierarchy, selectedItemTypeInHierarchy, selectedEventId, selectedPersonId, selectedWorkId, selectedPlaceId, selectedSeasonId, selectedRecordType, records]);

  // --- [5] 활성화된 패싯 타입에 연계되는 인물, 공간 등의 정보 오버뷰 추출 ---
  const activeFacetEntityDetail = useMemo(() => {
    if (activeTab !== 'facet') return null;
    if (activeFacetTab === 'event' && selectedEventId !== '전체') {
      return events.find(e => e.id === selectedEventId);
    }
    if (activeFacetTab === 'person' && selectedPersonId !== '전체') {
      return FACET_PEOPLE.find(p => p.id === selectedPersonId);
    }
    if (activeFacetTab === 'work' && selectedWorkId !== '전체') {
      return FACET_WORKS.find(w => w.id === selectedWorkId);
    }
    if (activeFacetTab === 'place' && selectedPlaceId !== '전체') {
      return FACET_PLACES.find(pl => pl.id === selectedPlaceId);
    }
    if (activeFacetTab === 'season' && selectedSeasonId !== '전체') {
      return FACET_SEASONS.find(s => s.id === selectedSeasonId);
    }
    return null;
  }, [activeTab, activeFacetTab, selectedEventId, selectedPersonId, selectedWorkId, selectedPlaceId, selectedSeasonId, events]);

  // 계층별 실데이터 갯수 계산기 (도표용)
  const collectionCount = records.length;
  const getSeriesCount = (id: string) => records.filter(r => r.seriesId === id).length;
  const getSubseriesCount = (id: string) => records.filter(r => r.subseriesId === id).length;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 아카이브 머리글 */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-3">
              <span className="px-2.5 py-0.5 bg-stone-100 rounded text-[9px] tracking-widest uppercase font-bold border border-stone-200">Naksan Archival Framework</span>
              <span className="text-xs text-stone-700 font-bold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> 계층 분류 및 다차원 관계 통합망
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-sans font-extrabold text-stone-900 tracking-tight mb-4">낙산극회 기록물 검색 포털</h1>
            <p className="text-stone-500 font-medium max-w-3xl leading-relaxed text-xs sm:text-sm">
              낙산극회 역사 기록의 체계적인 <strong className="text-stone-800 font-bold">5단계 구조적 계층 분류(Hierarchy)</strong>와 유기적인 <strong className="text-stone-800 font-bold">6대 다차원 패싯(Facet)</strong> 검색 모듈을 적용했습니다. 보존된 무대 예술 유산을 자유롭게 탐색해 보십시오.
            </p>
          </div>
        </header>

        {/* 탭 인터페이스 (계층형 vs 패싯형) - 넓고 수려한 정렬 */}
        <div className="grid grid-cols-2 p-1.5 bg-stone-200/60 border border-stone-300/40 rounded-2xl mb-8 w-full max-w-2xl shadow-inner">
          <button
            onClick={() => { setActiveTab('hierarchy'); }}
            className={cn(
              "py-3 px-6 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer",
              activeTab === 'hierarchy' 
                ? "bg-white text-stone-900 shadow-md border border-stone-300/20" 
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            <FolderOpen className="w-4 h-4 shrink-0" />
            계층식 분류 구조 탐색
          </button>
          <button
            onClick={() => { setActiveTab('facet'); }}
            className={cn(
              "py-3 px-6 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer",
              activeTab === 'facet' 
                ? "bg-white text-stone-900 shadow-md border border-stone-300/20" 
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            다차원 패싯형 교차 탐색
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* [TAB 1] 계층 구조 탐색                                        */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-10">
            {/* 1/3 개요 & 2/3 대형 도표 그리드 구조 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 좌측: 낙산극회 전체 개요 패널 (1/3) */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                      <BookOpen className="w-5 h-5 text-stone-800" />
                      <h2 className="text-base font-black text-stone-955">컬렉션 정리 개요</h2>
                    </div>

                    <div className="space-y-3 font-semibold text-stone-600 text-xs sm:text-sm leading-relaxed">
                      <p>
                        본 자료실은 한성대학교 중앙 연극동아리 <strong className="text-stone-900">낙산극회</strong>의 창작 유산과 역사 기록을 복원한 디지털 홀입니다. 
                      </p>
                      <p>
                        국제표준기록기술규칙 <strong className="text-stone-800">ISAD(G)</strong> 메타데이터 가이드라인을 원형 그대로 채용하여 유기적인 계층 정리 방식을 확보하고 있습니다.
                      </p>
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-[11px] text-stone-500">
                        <span className="font-bold text-stone-900 block">💡 계층 기술 성격 및 원리</span>
                        상위 단계(컬렉션, 시리즈)에서는 개괄적이고 집합적인 맥락과 해설을 수록하고, 하위 파일과 아이템 단계로 내려갈수록 구체적인 대본 파일, 공연 안내장, 일지 등의 개별 보전물에 대한 고유 식별 코드(REC) 연결 및 메타데이터를 수록하는 보존 가이드를 따릅니다.
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 mt-6 space-y-3">
                    <button
                      onClick={resetFilters}
                      className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      계층 필터링 초기화
                    </button>
                    <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-[11px] leading-relaxed">
                      <span className="font-extrabold text-stone-405 block mb-1">■ 아카이브 보존 범위</span>
                      정기공연의 1차 기록물(대본, 오리지널 포스터, 실황 동영상) 뿐 아니라, 워크샵, 총회 회의록, 대외 대관 계약서 성격의 보존 문건 철까지도 유실 없이 수록했습니다.
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측: 대형 정리체계 도표 영역 (2/3) */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Network className="w-5 h-5 text-stone-800 animate-pulse" />
                      <div>
                        <h3 className="text-base font-sans font-bold text-stone-900">5단계 계층 정리 도표 (ISAD-G)</h3>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Interactive Hierarchy Diagram (Naksan Preservation Blueprint)</p>
                      </div>
                    </div>
                    {selectedSeries !== '전체' && (
                      <span className="text-[10px] bg-stone-100 text-stone-800 border border-stone-200/80 font-bold px-2 py-0.5 rounded-full animate-bounce">
                        필터 활성화 중
                      </span>
                    )}
                  </div>

                  {/* 도표 흐름 맵 */}
                  <div className="space-y-5">
                    
                    {/* [단계 1: 컬렉션] */}
                    <div className="relative">
                      <div className="absolute left-6 top-full h-5 w-0.5 border-l-2 border-dashed border-stone-200 z-0"></div>
                      <button
                        onClick={() => { setSelectedSeries('전체'); setSelectedSubseries('전체'); }}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden",
                          selectedSeries === '전체'
                            ? "bg-gradient-to-r from-stone-950 to-stone-900 border-stone-900 text-white shadow-md shadow-stone-950/10"
                            : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800"
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded",
                              selectedSeries === '전체' ? "bg-stone-800 text-stone-100" : "bg-stone-200 text-stone-600"
                            )}>COLLECTION</span>
                            <h4 className="text-xs sm:text-sm font-black">[COL-01] 낙산극회 연극 아카이브 컬렉션</h4>
                          </div>
                          <p className={cn("text-[11px] font-medium mt-1 pr-6", selectedSeries === '전체' ? "text-stone-300" : "text-stone-400")}>
                            동아리 설립 시점부터 생산된 기수별 대본, 포스터, 영상물 및 회의록 총괄 보존체
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={cn("text-xs font-black px-2.5 py-1 rounded-lg", selectedSeries === '전체' ? "bg-stone-900 text-stone-200" : "bg-stone-200 text-stone-700")}>
                            전체 {collectionCount}개 보존중
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* [단계 2: 시리즈] */}
                    <div className="relative pt-1">
                      <div className="absolute left-6 top-full h-5 w-0.5 border-l-2 border-dashed border-stone-200 z-0"></div>
                      <div className="ml-4 p-4 bg-stone-100/50 border border-stone-200/80 rounded-2xl space-y-3 relative z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[8px] tracking-widest font-black text-stone-400 uppercase bg-stone-200 px-1.5 py-0.5 rounded">SERIES LAYER</span>
                          <span className="text-[10px] text-stone-500 font-bold">원천 성격별 대분류 (원하는 카테고리 클릭)</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {seriesNodes.map(node => {
                            const active = selectedSeries === node.id;
                            const count = getSeriesCount(node.id);
                            return (
                              <button
                                key={node.id}
                                onClick={() => handleSeriesSelect(node.id)}
                                className={cn(
                                  "text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-24",
                                  active
                                    ? "bg-stone-100 border-stone-900 text-stone-950 shadow-sm"
                                    : "bg-white hover:bg-stone-50/80 border-stone-200/70 text-stone-700"
                                )}
                              >
                                <div>
                                  <span className="text-[8px] font-black tracking-widest text-stone-900 block font-mono">[{node.id}]</span>
                                  <strong className="text-xs font-black block mt-0.5 truncate">{node.name}</strong>
                                </div>
                                <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-stone-100/60">
                                  <span className="text-[10px] text-stone-400 font-bold">기록 {count}개</span>
                                  {active && <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* [단계 3: 서브시리즈 (Sub-series)] */}
                    <AnimatePresence mode="wait">
                      {selectedSeries !== '전체' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="relative pt-1"
                        >
                          <div className="absolute left-6 top-full h-5 w-0.5 border-l-2 border-dashed border-stone-200 z-0"></div>
                          <div className="ml-8 p-4 bg-stone-100/85 border border-stone-300/60 rounded-2xl space-y-3 relative z-10 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] tracking-widest font-black text-stone-500 bg-stone-300 px-1.5 py-0.5 rounded uppercase">SUB-SERIES LAYER</span>
                              <span className="text-[10px] text-stone-500 font-bold">중분류 업무/주제 묶음철</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleSubseriesSelect('전체')}
                                className={cn(
                                  "py-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer border",
                                  selectedSubseries === '전체'
                                    ? "bg-stone-900 text-white border-stone-900"
                                    : "bg-white hover:bg-stone-50 text-stone-600 border-stone-350"
                                )}
                              >
                                전체 서브시리즈 자료
                              </button>
                              {subseriesNodes.map(node => {
                                const active = selectedSubseries === node.id;
                                const count = getSubseriesCount(node.id);
                                return (
                                  <button
                                    key={node.id}
                                    onClick={() => handleSubseriesSelect(node.id)}
                                    className={cn(
                                      "py-2 px-3.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                                      active
                                        ? "bg-stone-900 text-white border-stone-900 font-extrabold"
                                        : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
                                    )}
                                  >
                                    <span>{node.name}</span>
                                    <span className={cn(
                                      "text-[9px] font-mono px-1 rounded-md py-0.2",
                                      active ? "bg-stone-950 text-stone-300" : "bg-stone-100 text-stone-500"
                                    )}>{count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* [단계 4: 파일 (File)] */}
                    <AnimatePresence mode="wait">
                      {selectedSeries !== '전체' && selectedSubseries !== '전체' && filesForHierarchy.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="relative pt-1 animate-fadeIn"
                        >
                          <div className="absolute left-6 top-full h-5 w-0.5 border-l-2 border-dashed border-stone-200 z-0"></div>
                          <div className="ml-10 p-4 bg-stone-50 border border-stone-300/40 rounded-2xl space-y-3 relative z-10 shadow-sm">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-[8px] tracking-widest font-black text-stone-900 bg-stone-250 px-1.5 py-0.5 rounded uppercase border border-stone-300">FILE LAYER</span>
                              <span className="text-[10px] text-stone-500 font-bold">공연별 또는 기수/연도별 단일 파일철 선택</span>
                            </div>

                            <p className="text-[10px] text-stone-400 font-semibold leading-relaxed">
                              한 하위 주제 묶음에서 실제 세부 기록들을 포함하고 있는 상세한 독립 원천 편철 단위입니다.
                            </p>

                            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                              <button
                                onClick={() => {
                                  setSelectedFileInHierarchy('전체');
                                  setSelectedItemTypeInHierarchy('전체');
                                }}
                                className={cn(
                                  "py-1.5 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer border",
                                  selectedFileInHierarchy === '전체'
                                    ? "bg-stone-950 text-white border-stone-950 shadow-sm"
                                    : "bg-white hover:bg-stone-50 text-stone-600 border-stone-200/70"
                                )}
                              >
                                전체 파일철 통합 출력
                              </button>
                              {filesForHierarchy.map(file => {
                                const active = selectedFileInHierarchy === file.id;
                                return (
                                  <button
                                    key={file.id}
                                    onClick={() => {
                                      setSelectedFileInHierarchy(file.id);
                                      setSelectedItemTypeInHierarchy('전체');
                                    }}
                                    title={file.description}
                                    className={cn(
                                      "py-1.5 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer border flex items-center gap-1",
                                      active
                                        ? "bg-stone-900 text-white border-stone-950 shadow-sm font-extrabold"
                                        : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
                                    )}
                                  >
                                    <FileText className="w-3 h-3 opacity-60 shrink-0" />
                                    <span>{file.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* [단계 5: 아이템 (Item)] */}
                    <AnimatePresence mode="wait">
                      {selectedSeries !== '전체' && selectedSubseries !== '전체' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="pt-1 animate-fadeIn"
                        >
                          <div className="ml-12 p-4 bg-stone-50 border border-stone-300/40 rounded-2xl space-y-3 shadow-xs">
                            <div className="flex items-center justify-between text-xs font-bold text-stone-600 gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[8px] tracking-widest font-black text-stone-900 bg-stone-200 border border-stone-300 px-1.5 py-0.5 rounded">ITEM LEVEL</span>
                                <span>상세 기록 데이터 유형별 탐색</span>
                              </div>
                              <span className="text-stone-900 font-extrabold text-[11px] bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                                {finalFilteredRecords.length}개의 아이템 도출
                              </span>
                            </div>

                            <p className="text-[10px] text-stone-400 font-semibold leading-relaxed">
                              해당 분류에 속한 물리 소장품들의 구체적 유형입니다. 원하시는 특정 형식만 추려내 볼 수 있어 편리합니다.
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                              <button
                                onClick={() => setSelectedItemTypeInHierarchy('전체')}
                                className={cn(
                                  "py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border",
                                  selectedItemTypeInHierarchy === '전체'
                                    ? "bg-stone-950 text-white border-stone-950 shadow-xs"
                                    : "bg-white hover:bg-stone-100 text-stone-600 border-stone-200/70"
                                )}
                              >
                                전체 유형 보기
                              </button>
                              {availableTypesInHierarchy.map(typeStr => {
                                const active = selectedItemTypeInHierarchy === typeStr;
                                return (
                                  <button
                                    key={typeStr}
                                    onClick={() => setSelectedItemTypeInHierarchy(typeStr)}
                                    className={cn(
                                      "py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border flex items-center gap-1",
                                      active
                                        ? "bg-stone-900 text-white border-stone-950 shadow-sm font-extrabold"
                                        : "bg-white hover:bg-stone-100/70 text-stone-700 border-stone-200"
                                    )}
                                  >
                                    <span className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-stone-100" : "bg-stone-400")} />
                                    <span>{typeStr}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                </div>
              </div>

            </div>

            {/* 필터 통계 및 리스트 바 */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-5 border border-stone-200 flex flex-col md:flex-row justify-between items-center text-xs font-bold gap-4 shadow-sm">
                <div className="text-stone-500 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-900 tracking-wider font-extrabold rounded-lg border border-stone-200">
                    {selectedSeries === '전체' ? '컬렉션 전체' : HIERARCHY_NODES.find(n => n.id === selectedSeries)?.name}
                    {selectedSubseries !== '전체' && ` ➜ ${HIERARCHY_NODES.find(n => n.id === selectedSubseries)?.name}`}
                    {selectedSubseries !== '전체' && selectedFileInHierarchy !== '전체' && ` ➜ ${filesForHierarchy.find(f => f.id === selectedFileInHierarchy)?.name}`}
                    {selectedSubseries !== '전체' && selectedFileInHierarchy !== '전체' && selectedItemTypeInHierarchy !== '전체' && ` (세부 유형: ${selectedItemTypeInHierarchy})`}
                  </span>
                  <span>위치의 기록 리스트</span>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* 단어 검색 */}
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="작품명, 내용, 생산자 검색..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-stone-900 focus:bg-white text-xs font-semibold outline-none transition-all"
                    />
                  </div>

                  <span className="text-stone-400 shrink-0">
                    발견: <strong className="text-stone-900 font-extrabold text-sm">{finalFilteredRecords.length}</strong>건
                  </span>
                </div>
              </div>

              {/* 실제 그리드 바인더 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {finalFilteredRecords.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArchiveCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* 검색 결과 공백 시 플레이스홀더 */}
              {finalFilteredRecords.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
                  <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                    <Search className="w-6 h-6 text-stone-300" />
                  </div>
                  <h3 className="text-base font-black text-stone-900 mb-2">해당 조건에 연계되는 하위 기록물이 없습니다</h3>
                  <p className="text-stone-400 font-bold text-xs max-w-sm mx-auto leading-relaxed">
                    선선한 날씨 축제대동제, 회의록철, 연극 대본 등 다른 계층 노드를 상단 도표에서 눌러서 새로운 조합 검색을 찾아 나서 보세요.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-black shadow-lg transition-all cursor-pointer"
                  >
                    필터 전체 초기화
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* [TAB 2] 패싯 다차원 검색 (6대 핵심 패싯)                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'facet' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 상단에 6대 대표 패싯 카테고리를 큰 버튼화 */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 pb-3 border-b border-stone-100">
                <SlidersHorizontal className="w-5 h-5 text-stone-850" />
                <div>
                  <h3 className="text-base font-sans font-bold text-stone-900">다차원 핵심 패싯 범주 선택</h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">6-Dimensional Facet Multi-Search Interface</p>
                </div>
              </div>

              {/* 6차원 패싯 카테고리 탭 리스트 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {facetDimensions.map(dim => {
                  const Icon = dim.icon;
                  const active = activeFacetTab === dim.id;
                  return (
                    <button
                      key={dim.id}
                      onClick={() => {
                        setActiveFacetTab(dim.id);
                        // 탭 전환 시 검색 동기화 초기화
                        setSelectedEventId('전체');
                        setSelectedPersonId('전체');
                        setSelectedWorkId('전체');
                        setSelectedPlaceId('전체');
                        setSelectedSeasonId('전체');
                        setSelectedRecordType('전체');
                      }}
                      className={cn(
                        "p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer min-h-[92px]",
                        active 
                          ? "bg-stone-900 border-stone-900 text-white shadow-md shadow-stone-950/10" 
                          : "bg-stone-50 border-stone-200 hover:border-stone-350 text-stone-600 hover:bg-stone-100/50"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", active ? "text-stone-200" : "text-stone-400")} />
                      <span className="text-xs font-black tracking-tight">{dim.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 선택한 패싯 카테고리별 세부 인스턴스 나열 및 검색 렉터 */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
              
              {/* 패싯 인스턴스 전용 제목 배지 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-stone-850 rounded-full"></div>
                  <h4 className="text-xs sm:text-sm font-sans font-bold text-stone-900">
                    [{facetDimensions.find(d => d.id === activeFacetTab)?.name}] 내부 상세 리스트에서 대상 선택
                  </h4>
                </div>
                <span className="text-[10px] text-stone-400 font-extrabold">인스턴스를 클릭하면 관련 정보 정리 및 소장 아카이브가 자동 로딩됩니다.</span>
              </div>

              {/* 1. 활성화 탭: 공연/행사 (Event) */}
              {activeFacetTab === 'event' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedEventId('전체')}
                    className={cn(
                      "p-3.5 rounded-xl border text-left transition-all cursor-pointer text-xs font-bold",
                      selectedEventId === '전체'
                        ? "bg-stone-100 border-stone-900 text-stone-900 font-extrabold"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100/50 text-stone-500"
                    )}
                  >
                    🔵 전체 공연/행사 자료 보기 ({records.length}개 전체 출력)
                  </button>
                  {events.map(evt => {
                    const active = selectedEventId === evt.id;
                    return (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEventId(evt.id)}
                        className={cn(
                          "p-3.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex items-start gap-2.5",
                          active
                            ? "bg-stone-100 border-stone-900 text-stone-900 font-bold shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-stone-100">
                          {evt.thumbnailUrl ? (
                            <img 
                              src={getAssetUrl(evt.thumbnailUrl)} 
                              alt={evt.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=200";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] bg-stone-100 text-stone-700 font-bold">포스터</div>
                          )}
                        </div>
                        <div>
                          <strong className="block font-black line-clamp-1">{evt.title}</strong>
                          <span className="text-[10px] text-stone-400 block mt-1">상연일: {evt.date} | 구분: {evt.type}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. 활성화 탭: 인물 (Person) */}
              {activeFacetTab === 'person' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <button
                    onClick={() => setSelectedPersonId('전체')}
                    className={cn(
                      "p-3.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold flex flex-col justify-center items-center h-28",
                      selectedPersonId === '전체'
                        ? "bg-stone-100 border-stone-900 text-stone-900 font-extrabold"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100/50 text-stone-500"
                    )}
                  >
                    ✨ 전체 인물 아우르기
                  </button>
                  {FACET_PEOPLE.map(p => {
                    const active = selectedPersonId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPersonId(p.id)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28",
                          active
                            ? "bg-stone-100 border-stone-900 text-stone-900 font-bold shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                        )}
                      >
                        <div>
                          <span className="text-[10px] font-mono text-stone-800 font-bold">{p.generation} 부원</span>
                          <strong className="text-xs font-black block mt-0.5">{p.name}</strong>
                          <span className="text-[10px] text-stone-400 block line-clamp-1">{p.role}</span>
                        </div>
                        {active && <div className="self-end w-2 h-2 bg-stone-900 rounded-full mt-2" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. 활성화 탭: 작품 (Work) */}
              {activeFacetTab === 'work' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedWorkId('전체')}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all cursor-pointer text-xs font-bold",
                      selectedWorkId === '전체'
                        ? "bg-stone-100 border-stone-900 text-stone-900 font-extrabold"
                        : "bg-stone-50 border-stone-100 hover:bg-stone-100 text-stone-500"
                    )}
                  >
                    📖 전체 연극 희곡작품 보기 ({FACET_WORKS.length}개 항목)
                  </button>
                  {FACET_WORKS.map(w => {
                    const active = selectedWorkId === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWorkId(w.id)}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px]",
                          active
                            ? "bg-stone-100 border-stone-900 text-stone-900 font-bold shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                        )}
                      >
                        <div>
                          <strong className="text-xs font-black block text-stone-800 pr-5 truncate">《{w.title}》</strong>
                          <span className="text-[10px] text-stone-400 mt-1 block">원작: {w.originalCreator} | 유형: {w.type}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. 활성화 탭: 공간 (Place) */}
              {activeFacetTab === 'place' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedPlaceId('전체')}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all cursor-pointer text-xs font-bold",
                      selectedPlaceId === '전체'
                        ? "bg-stone-100 border-stone-900 text-stone-900 font-extrabold"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-505"
                    )}
                  >
                    📍 전체 장소 탐색하기
                  </button>
                  {FACET_PLACES.map(pl => {
                    const active = selectedPlaceId === pl.id;
                    return (
                      <button
                        key={pl.id}
                        onClick={() => setSelectedPlaceId(pl.id)}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px]",
                          active
                            ? "bg-stone-100 border-stone-900 text-stone-900 font-bold shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                        )}
                      >
                        <div>
                          <strong className="text-xs font-black block text-stone-800 truncate">{pl.name}</strong>
                          <span className="text-[10px] text-stone-400 mt-1 block line-clamp-1">{pl.type} · {pl.address}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 5. 활성화 탭: 공연시즌 (Season) */}
              {activeFacetTab === 'season' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedSeasonId('전체')}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all cursor-pointer text-xs font-bold",
                      selectedSeasonId === '전체'
                        ? "bg-stone-100 border-stone-900 text-stone-900 font-extrabold"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-500"
                    )}
                  >
                    ⏳ 전체 활성화 범위 시즌 보기
                  </button>
                  {FACET_SEASONS.map(s => {
                    const active = selectedSeasonId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSeasonId(s.id)}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px]",
                          active
                            ? "bg-stone-100 border-stone-900 text-stone-900 font-bold shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                        )}
                      >
                        <div>
                          <strong className="text-xs font-black block text-stone-800">{s.name}</strong>
                          <span className="text-[10px] text-stone-400 mt-1 block font-mono">{s.startDate} ~ {s.endDate}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 6. 활성화 탭: 기록물종류 (Type) */}
              {activeFacetTab === 'type' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedRecordType('전체')}
                    className={cn(
                      "p-4 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold",
                      selectedRecordType === '전체'
                        ? "bg-stone-100 border-stone-900 text-stone-900 font-extrabold"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-500"
                    )}
                  >
                    전체 기록포맷 보기
                  </button>
                  {recordTypes.map(t => {
                    const active = selectedRecordType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setSelectedRecordType(t)}
                        className={cn(
                          "p-4 rounded-xl border text-center font-black transition-all cursor-pointer text-xs",
                          active
                            ? "bg-stone-100 border-stone-900 text-stone-900 shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}

            </div>

            {/* 선택된 패싯 인스턴스의 상세 소개 배너 (메타데이터 카드) */}
            <AnimatePresence mode="wait">
              {activeFacetEntityDetail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-stone-100 border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start overflow-hidden leading-relaxed"
                >
                  {/* 프로필 좌측 썸네일 */}
                  {('thumbnailUrl' in activeFacetEntityDetail) && activeFacetEntityDetail.thumbnailUrl && (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-stone-200/60 bg-white">
                      <img 
                        src={getAssetUrl(activeFacetEntityDetail.thumbnailUrl)} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=350";
                        }}
                      />
                    </div>
                  )}

                  {/* 프로필 우측 상세 서술 */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase text-stone-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                        {activeFacetEntityDetail.id}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-stone-900">
                        {('title' in activeFacetEntityDetail) ? activeFacetEntityDetail.title : ('name' in activeFacetEntityDetail) ? activeFacetEntityDetail.name : '패싯 세부 데이터'}
                      </h4>
                      {('generation' in activeFacetEntityDetail) && (
                        <span className="text-[10px] bg-stone-200 font-extrabold text-stone-700 px-2 py-0.5 rounded-full">{activeFacetEntityDetail.generation} 부원</span>
                      )}
                      {('type' in activeFacetEntityDetail) && (
                        <span className="text-[10px] bg-stone-200 font-extrabold text-stone-700 px-2 py-0.5 rounded-full">{activeFacetEntityDetail.type}</span>
                      )}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-stone-500 font-semibold">
                      {activeFacetEntityDetail.description || '관련 소장용 텍스트 상세 디스크립션 정보가 이 자리에 기입되어 상호 맵핑 및 관계 기술을 보완합니다.'}
                    </p>

                    {/* 관계 기술 표시기 */}
                    <div className="pt-3 border-t border-stone-200/60 mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-stone-400 font-bold">
                      {('date' in activeFacetEntityDetail) && (
                        <span>상연시기: {activeFacetEntityDetail.date}</span>
                      )}
                      {('address' in activeFacetEntityDetail) && (
                        <span>주소: {activeFacetEntityDetail.address}</span>
                      )}
                      {('role' in activeFacetEntityDetail) && (
                        <span>주요역할: {activeFacetEntityDetail.role} ({activeFacetEntityDetail.englishName})</span>
                      )}
                      {('originalCreator' in activeFacetEntityDetail) && (
                        <span>원작자/기획: {activeFacetEntityDetail.originalCreator}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 패싯 맞춤형 보존기록 출력 영역 */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-5 border border-stone-200 flex flex-col md:flex-row justify-between items-center text-xs font-bold gap-4">
                <div className="text-stone-500 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-stone-900 text-stone-100 rounded-lg">
                    {facetDimensions.find(d => d.id === activeFacetTab)?.name} 패싯 관통 교차점
                  </span>
                  <span className="text-stone-800">연관 핵심 1차 데이터 리스트</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-stone-400">실시간 연계기록:</span>
                  <span className="text-stone-900 font-extrabold text-sm">{finalFilteredRecords.length}개 검색됨</span>
                </div>
              </div>

              {/* 실제 그리드 바인더 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {finalFilteredRecords.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArchiveCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* 공백 시 */}
              {finalFilteredRecords.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
                  <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                    <Search className="w-6 h-6 text-stone-300" />
                  </div>
                  <h3 className="text-base font-black text-stone-900 mb-2">선택된 패싯에 매칭되는 소장 기록이 없습니다</h3>
                  <p className="text-stone-400 font-bold text-xs max-w-sm mx-auto leading-relaxed">
                    공연시즌이나 기록물종류 ➜ 대본, 사진 등을 선택한 후 다른 패싯 조합으로 연쇄 이동을 확인해 보세요.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-black shadow-lg transition-all cursor-pointer"
                  >
                    패싯 초기화 및 전체보기
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
