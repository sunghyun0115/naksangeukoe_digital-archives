import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, FileText, Lock, Eye } from 'lucide-react';
import { FacetRecord } from '../types';
import { HIERARCHY_NODES } from '../data/mockData';
import { useArchive } from '../contexts/ArchiveContext';
import { getAssetUrl } from '../lib/utils';
import StatusBadge from './StatusBadge';

interface ArchiveCardProps {
  item: FacetRecord;
}

export default function ArchiveCard({ item }: ArchiveCardProps) {
  const { events } = useArchive();
  const [imgError, setImgError] = useState(false);
  
  // 계층 노드 구하기
  const subseriesNode = HIERARCHY_NODES.find(n => n.id === item.subseriesId);
  const seriesNode = HIERARCHY_NODES.find(n => n.id === item.seriesId);
  
  // 관련 공연 정보 가져오기 (썸네일 등의 위함)
  const relatedEvent = item.eventId ? events.find(e => e.id === item.eventId) : undefined;
  const rawUrl = item.thumbnailUrl || relatedEvent?.thumbnailUrl;
  const displayThumbnail = !!rawUrl && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <Link to={`/archive/${item.id}`} className="block flex-grow">
        <div className="aspect-[3/4] relative overflow-hidden bg-stone-50/40 flex items-center justify-center border-b border-stone-100">
          {displayThumbnail ? (
            <img
              src={getAssetUrl(rawUrl)}
              alt={item.title}
              className="w-full h-full object-contain p-1.5 group-hover:scale-[1.03] transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If it already failed on the fallback Unsplash, then prevent infinite loop and show placeholder
                if (e.currentTarget.src.includes('unsplash.com') || e.currentTarget.src.includes('images.unsplash.com')) {
                  setImgError(true);
                  return;
                }
                
                // Keep beautiful high-quality fallback mappings
                const fallbackImages: Record<string, string> = {
                  'EVT-00001': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600', // 소년B
                  'EVT-00002': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600', // 빠니노
                  'EVT-00003': 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=600', // 보도지침
                };
                
                const fallbackUrl = (item.eventId && fallbackImages[item.eventId]) 
                  || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600';
                  
                e.currentTarget.src = fallbackUrl;
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-4 border-b border-gray-100">
              <FileText className="w-10 h-10 stroke-[1.5] mb-2 text-gray-200" />
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{item.format}</span>
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <StatusBadge status={item.status} />
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-gray-900/80 text-white backdrop-blur">
              <Lock className="w-2.5 h-2.5" />
              {item.rights}
            </span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-white text-xs font-bold flex items-center gap-1.5 drop-shadow">
              <Eye className="w-3.5 h-3.5" />
              자세히 보기
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-stone-800 uppercase tracking-widest mb-2.5">
              <span>{seriesNode?.name}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">{subseriesNode?.name}</span>
            </div>
            
            <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-stone-600 transition-colors leading-snug">
              {item.title}
            </h3>
          </div>
          
          <div className="space-y-1.5 pt-4 border-t border-gray-50 mt-auto">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{item.creationDate || '날짜 정보 미상'}</span>
            </div>
            {item.creator && (
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <User className="w-3.5 h-3.5 shrink-0 text-gray-300" />
                <span className="line-clamp-1">{item.creator}</span>
              </div>
            )}
            
            {/* 관련 정보 가이드 배지 */}
            {relatedEvent && (
              <div className="mt-2.5 pt-2 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 border-t border-dashed border-gray-100">
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[9px] uppercase font-black tracking-wider">EVENT</span>
                <span className="line-clamp-1 text-gray-600">{relatedEvent.title}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
