import { motion } from 'motion/react';
import { 
  Target, 
  Users, 
  BookOpen, 
  Shield, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Drama,
  MapPin,
  Clock,
  User,
  FileText
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';

export default function About() {
  return (
    <div className="pt-24 pb-20 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 아카이브 헤더 */}
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-900 rounded-full text-[10px] font-bold uppercase mb-6 tracking-widest border border-stone-200"
          >
            <Shield className="w-3.5 h-3.5" />
            naksangeukoe Archival Guidelines & Policy
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-stone-900 tracking-tight mb-8 leading-tight">
            대학 연극 예술의 역사와 맥락을 <br />
            <span className="text-stone-500 font-normal">정교한 다차원 구조</span>로 기리다
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-normal leading-relaxed max-w-2xl mx-auto">
            한성대학교 중앙 연극동아리 ‘낙산극회’ 아카이브는 단막극과 정기공연의 역사, 극단인들의 열정 서사를 보존하기 위해 엄선된 기록물 분류 준칙에 입각하여 성실히 구축되었습니다.
          </p>
        </header>

        {/* 미션과 수집 범위 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-white rounded-3xl p-10 border border-stone-200/50 shadow-xs relative overflow-hidden">
            <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mb-6 text-stone-955 border border-stone-200/50">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-4">아카이브 사명</h3>
            <p className="text-stone-500 font-medium text-xs leading-relaxed">
              본 기록관은 한성대학교 대학 연극 문화의 유일무이한 인쇄 기물 및 시청각 자료를 안전히 보관하여 후배 기수들의 제작 연구를 입체 지탱하고 무대 예술의 불씨를 일구는 데 이바지합니다.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-10 border border-stone-200/50 shadow-xs relative overflow-hidden">
            <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center mb-6 text-stone-955 border border-stone-200/50">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-4">수집 범위</h3>
            <ul className="space-y-3">
              {[
                '정기공연, 워크숍, 신입생 특별 공연 극본 원고 및 오디오·영상 데이터',
                '동아리 기수별 운영위원회 정기회의 세부 회록 및 예결산 행정 서류철',
                '연극제, 대동제 축제 참가 기획서 및 희귀 인쇄 포스터 팜플렛 일체',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-650 font-medium text-xs leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 메타데이터 구조 설명 */}
        <section className="bg-white rounded-[3rem] p-8 md:p-14 border border-stone-200/50 shadow-xs mb-24 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[9px] font-bold text-stone-900 bg-stone-105 py-1 px-3 rounded-full border border-stone-200 tracking-wider uppercase">
              Metadata Standards Architecture
            </span>
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-stone-950 tracking-tight">
              두 가지 구조적 탐색 체계의 공존
            </h2>
            <p className="text-stone-500 font-medium text-xs leading-relaxed font-sans">
              낙산극회의 연극 아카이브는 기록의 영구 보존을 주관하는 <span className="font-bold underline text-stone-700">5단계 수직적 계층(Hierarchy)</span> 관계와, 자유로운 발견을 매개하는 <span className="font-bold underline text-stone-700">다차원 패싯(Facet) 수평 관계망</span>을 긴밀히 교차하여 정보 설계하였습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-stone-100 font-sans">
            
            {/* 다단계 계층 분류 구조 */}
            <div className="bg-stone-50/70 rounded-3xl p-8 space-y-6 border border-stone-200/30">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <Layers className="w-5 h-5 text-stone-900" />
                <h3 className="font-sans">01. 5단계 상하 계층 분류 (Hierarchy)</h3>
              </div>
              <p className="text-[11.5px] text-stone-500 font-medium leading-relaxed">
                 국제 기록 기술 표준(ISAD-G)을 바탕으로 전체 소장 자료군을 "컬렉션 ➜ 시리즈 ➜ 서브시리즈 ➜ 파일철 ➜ 아카이브 아이템"이라는 인과적 소유 관계 아래 체계성 있게 보존하여 정보 실마리를 완벽 보호합니다.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  { tag: '[C] Collection', name: '낙산극회 역사 기록 컬렉션 (전체 원천 그룹)' },
                  { tag: '[S] Series', name: '원천 대분류 (공연 실물 시리즈, 행사 시리즈, 운영·행정 시리즈)' },
                  { tag: '[SS] Sub-series', name: '소분류 단위 (정기공연, 특별공연, 회의록, 행정문서 등 주제 묶음)' },
                  { tag: '[F] File', name: '개별 파일철/공연 단위 (제82회 정기공연 "방황하는 별들", 2024년도 축제 참가철 등 개별 활동)' },
                  { tag: '[I] Item', name: '최하위 상세 기록물 (공연 대본, 포스터, 현장 실물 사진, 극 녹화 영상 등 유형별 세부 분류)' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/40 text-[10px] font-semibold text-stone-600">
                    <span className="text-stone-900 font-bold shrink-0 w-24 font-mono">{item.tag}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 다차원 패싯 모델 */}
            <div className="bg-stone-50/70 rounded-3xl p-8 space-y-6 border border-stone-200/30">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <Sparkles className="w-5 h-5 text-stone-900" />
                <h3 className="font-sans">02. 다차원 수평 관계형 패싯 (Facet)</h3>
              </div>
              <p className="text-[11.5px] text-stone-500 font-medium leading-relaxed">
                단순 수직 서열만으로는 복합적으로 참여한 무원들의 기수, 창작에 쓰인 원안 희곡, 계절별 소강당 분위기 등의 수평 결코를 밝히어내기 어렵습니다. 6개 차원의 다자 패싯이 거미줄처럼 만나 영감을 불어넣습니다.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {[
                  { name: '공연/행사', icon: Drama, desc: '특화 무대 연동' },
                  { name: '인물 (참여)', icon: User, desc: '역대 극 기수단' },
                  { name: '희곡 작품', icon: FileText, desc: '고전 및 창작 대본' },
                  { name: '공연 공간', icon: MapPin, desc: '대관 소극장·연습동' },
                  { name: '시즌 분류', icon: Clock, desc: '연도별 학기 맥락' },
                  { name: '기록 유형', icon: Layers, desc: '파일 및 포스터' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200/40 flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-stone-800">{item.name}</div>
                      <div className="text-[9px] text-stone-400 font-medium mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 식별자 (ID) 생성 표준 규칙 해설 */}
          <div className="bg-stone-950 rounded-3xl p-8 text-stone-105 relative overflow-hidden border border-stone-850">
            <h4 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-4 flex items-center gap-1.5 font-sans">
              <Award className="w-3.5 h-3.5" /> ID-Code Generation Rules for naksangeukoe
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {[
                { label: '공연/행사 (Event)', code: 'EVT-00001' },
                { label: '인물 (Person)', code: 'PSN-00001' },
                { label: '작품 (Work)', code: 'WRK-00001' },
                { label: '장소 (Place)', code: 'PLC-00001' },
                { label: '기록물 (Record)', code: 'REC-00001' },
              ].map((item, i) => (
                <div key={i} className="bg-stone-900/40 p-4 rounded-xl border border-stone-800/80 text-center">
                  <div className="text-[9px] font-bold text-stone-400 mb-1">{item.label}</div>
                  <code className="text-xs font-mono font-bold text-stone-200">{item.code}</code>
                </div>
              ))}
            </div>
            <div className="text-[9.5px] text-stone-500 font-medium mt-5 leading-relaxed text-center sm:text-left">
              * 학기별 고유 시즌 코드: <code className="text-stone-405/80">SEA-[연도]-[시즌식별]</code> (시즌식별자 - 1: 1학기무대, S: 여름방중, 2: 2학기무대, W: 겨울방중. 예: SEA-2024-2)
            </div>
          </div>

        </section>

        {/* 3-2-1 보존 모델 */}
        <section className="bg-white rounded-[3rem] p-8 md:p-14 border border-stone-200/50 shadow-xs mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-[9px] font-bold bg-stone-100 text-stone-700 py-0.5 px-2 rounded uppercase tracking-wider border border-stone-200/60">
              Digital Preservation Policy
            </span>
            <h3 className="text-xl md:text-2xl font-sans font-bold text-stone-95-5 mt-3 mb-4 leading-snug">
              안전한 디지털 보존 전략 <br />
              <span className="text-stone-900 font-medium">3-2-1 백업 원칙</span>
            </h3>
            <p className="text-stone-400 font-semibold text-[11px] leading-relaxed">
              낙산극회의 무형 유산 및 자필 대본들이 세월 속에 망실되지 않도록 다음과 같은 체계적인 사본 격리 보관 원칙을 성실히 준수하고 있습니다.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { number: '3', title: '3벌의 사본 보관', desc: '하나의 마스터 복원본과 최소 두 개 이상의 복제본을 독립 물리 보존합니다.' },
              { number: '2', title: '2가지 다른 매체', desc: '외장 안전 저장 장치 및 엄격히 암호화된 기공 클라우드 저장소에 분산 적재합니다.' },
              { number: '1', title: '1곳의 외부 격리', desc: '불시의 재해 대처를 도모하기 위해 동아리방 외 외부 공인 백업 환경에 사본지 보존을 유지합니다.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-stone-50/50 p-6 rounded-2xl border border-stone-200/40 hover:border-stone-400 transition-colors">
                <div className="text-3xl font-bold text-stone-900 mb-2">{step.number}</div>
                <h5 className="text-[11.5px] font-bold text-stone-800 mb-1.5">{step.title}</h5>
                <p className="text-[10.5px] font-medium text-stone-505 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 구성원 소개 */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-10 border-b border-stone-150 pb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-stone-900">낙산극회 아카이브 <span className="font-normal text-stone-500">구술·기록 위원단</span></h2>
              <p className="text-[9px] text-stone-400 font-bold tracking-wide uppercase mt-1">Culture Resources & Archives Preservation Committee</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-stone-400 font-bold text-[10px] uppercase tracking-widest font-mono">
              <Users className="w-4 h-4 text-stone-900" />
              Commissioned Archivists
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-xs hover:shadow-md hover:border-stone-300 transition-all group flex flex-col justify-between h-full hover:bg-stone-50/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-stone-900 font-bold text-base">{member.name}</span>
                    <span className="text-[9px] font-mono tracking-wider font-bold bg-stone-50 border border-stone-200/40 px-2 py-0.5 rounded text-stone-500">ARCHIVIST</span>
                  </div>
                  <div className="text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">
                    {member.role}
                  </div>
                </div>
                <p className="text-stone-600 text-[11px] font-medium leading-relaxed">
                  {member.tasks}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// 누락 아이콘 땜핀
const Award = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);
