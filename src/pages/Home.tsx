import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  History, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Drama,
  User,
  MapPin,
  Clock,
  FileText
} from 'lucide-react';
import { FACET_RECORDS } from '../data/mockData';
import ArchiveCard from '../components/ArchiveCard';

export default function Home() {
  // 최근 등록 기록물 3개 슬라이싱
  const featuredRecords = FACET_RECORDS.slice(0, 3);

  return (
    <div className="pt-24 pb-20 bg-white">
      
      {/* 히어로 간판 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 rounded-[3rem] overflow-hidden relative shadow-lg border border-stone-850">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-luminosity"></div>
          {/* Subtle dramatic vignette background */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-transparent to-stone-950/10"></div>
          <div className="relative px-6 py-20 md:px-16 md:py-28 flex flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-stone-400 font-sans tracking-widest text-[10px] mb-3 font-bold uppercase"
            >
              since 1977 — naksangeukoe
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-sans text-white mb-6 tracking-tight leading-tight font-black"
            >
              <span className="text-stone-400 font-light pr-1">낙산극회</span> 디지털 아카이브
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-stone-300 max-w-2xl text-xs sm:text-sm font-light mb-10 leading-relaxed"
            >
              한성대학교 연극동아리 낙산극회가 일구어 온 45성상의 무대 유산을<br />체계적인 계층 분류와 다차원 인물·작품 관계망으로 재정렬하여 영구 보존합니다.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/archive"
                className="px-8 py-3.5 bg-stone-100 text-stone-900 border border-stone-200 text-xs font-bold rounded-full hover:bg-white transition-all flex items-center gap-2 group shadow-xs cursor-pointer"
              >
                아카이브 기록관 입장
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-stone-900" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-transparent border border-stone-700 hover:border-stone-400 text-white text-xs font-bold rounded-full hover:bg-stone-900/40 transition-all cursor-pointer"
              >
                극회 소개 및 보존 정책
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 핵심 3대 정책 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: History, title: '45성상의 무대 기록', desc: '1977년 창단 이래 축적된 낙산극회 연극인들의 자필 극본, 포스터, 원형 영상 및 구술 아카이빙' },
            { icon: Layers, title: '체계적인 5단계 분류', desc: '국제 기록 기술 표준을 엄격히 준용하여 컬렉션 ➜ 시리즈 ➜ 서브시리즈 ➜ 파일철 ➜ 아카이브 아이템 정연한 보존' },
            { icon: ShieldCheck, title: '다차원 패싯 릴레이션', desc: '연극인, 무대 원작, 대관 공간, 공연 시즌 등 입체적 연계 탐색을 실현하는 스마트 연동망' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-8 bg-stone-50/50 rounded-3xl border border-stone-200/40 shadow-xs hover:shadow-md hover:bg-white transition-all duration-350"
            >
              <div className="w-11 h-11 bg-stone-100 rounded-2xl flex items-center justify-center mb-6 border border-stone-200/50">
                <feature.icon className="w-4 h-4 text-stone-900" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2.5">{feature.title}</h3>
              <p className="text-stone-500 font-medium text-[11px] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6대 다차원 패싯 소개 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-stone-950 text-stone-100 rounded-[3rem] p-8 md:p-14 relative overflow-hidden border border-stone-850">
          <div className="absolute top-0 right-0 w-80 h-80 bg-stone-800/10 rounded-full blur-[100px]" />
          
          <div className="max-w-xl mb-12">
            <span className="text-stone-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-stone-405" /> Multi-dimensional Facets
            </span>
            <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight mb-4">
              기록과 자원을 잇는 <span className="text-stone-400 font-normal">6대 패싯 관계망</span>
            </h2>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              낙산극회의 연극 무대를 기록하기에 최적화된 메타데이터 요소를 추출하였습니다. 각 카테고리를 선택하셔서 무한히 교차하는 맥락 정보의 흐름을 즐겨 보세요.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'event', title: '공연/행사', icon: Drama, desc: '주요 무대 및 축제' },
              { id: 'person', title: '참여 인물', icon: User, desc: '배우 및 제작진 기수' },
              { id: 'work', title: '희곡 작품', icon: FileText, desc: '원안 희곡 및 각색본' },
              { id: 'place', title: '공연 공간', icon: MapPin, desc: '교내 극장 및 외부 무대' },
              { id: 'season', title: '공연 시즌', icon: Clock, desc: '연도별 학기 맥락' },
              { id: 'type', title: '기록물 유형', icon: Layers, desc: '포스터·대본·영상집' },
            ].map((pct, i) => {
              const facetId = pct.id;
              return (
                <Link 
                  key={i} 
                  to={`/archive?tab=facet&facet=${facetId}`}
                  className="bg-stone-900/50 p-5 rounded-2xl border border-stone-800/80 flex flex-col justify-between hover:scale-[1.02] hover:bg-stone-900 hover:border-stone-600 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                >
                  <div className="w-9 h-9 bg-stone-800 group-hover:bg-stone-700/80 rounded-xl flex items-center justify-center text-stone-300 mb-6 transition-colors border border-stone-850">
                    <pct.icon className="w-3.5 h-3.5 text-stone-200" />
                  </div>
                  <div>
                    <div className="text-[11.5px] font-bold text-stone-200 group-hover:text-white transition-colors">{pct.title}</div>
                    <div className="text-[9.5px] text-stone-500 font-medium group-hover:text-stone-400 transition-colors mt-0.5">{pct.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 최근 등록된 컬렉션 그리드 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl md:text-2xl font-sans font-bold text-stone-900 tracking-tight">수집 아카이브 <span className="font-normal text-stone-500">신규 소장 자료</span></h2>
            <p className="text-[9px] text-stone-400 font-bold tracking-wider uppercase mt-1">Newly Registered Historical Records</p>
          </div>
          <Link to="/archive" className="text-stone-900 text-[11px] font-bold hover:text-stone-650 flex items-center gap-0.5 group tracking-wider uppercase">
            전체 아카이브 색인
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRecords.map((item) => (
            <div key={item.id}>
              <ArchiveCard item={item} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
