import React, { createContext, useContext, useState, useEffect } from 'react';
import { FacetRecord, FacetEvent } from '../types';
import { FACET_RECORDS, FACET_EVENTS } from '../data/mockData';

interface ArchiveContextType {
  records: FacetRecord[];
  events: FacetEvent[];
  updateRecordThumbnail: (recordId: string, url: string) => void;
  updateEventThumbnail: (eventId: string, url: string) => void;
  resetAllThumbnails: () => void;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export function ArchiveProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<FacetRecord[]>(FACET_RECORDS);
  const [events, setEvents] = useState<FacetEvent[]>(FACET_EVENTS);

  // 로컬 스토리지에 저장된 커스텀 썸네일 오버라이드 읽기 및 한글 파일명 영구 보정 마이그레이션
  useEffect(() => {
    // 한글 경로명을 안전한 영문 파일명으로 보정해주는 자체 헬퍼
    const migrateUrl = (url: string): string => {
      if (!url || !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(url)) return url;
      
      let decoded = url;
      try {
        decoded = decodeURIComponent(url);
      } catch (e) {}

      const lower = decoded.toLowerCase();
      if (lower.includes('소년b') || lower.includes('소년 b')) return '/boy_b.jpg';
      if (lower.includes('빠니노')) return '/uncle_panino.jpg';
      if (lower.includes('보도지침')) return '/press_guideline.jpg';
      if (lower.includes('변기') || lower.includes('공백') || lower.includes('내말이')) return '/toilet_space.jpg';
      if (lower.includes('너무친한')) return '/too_close_friends.jpg';
      if (lower.includes('아트')) return '/art.jpg';
      if (lower.includes('리투아니아')) return '/lithuania.jpg';
      if (lower.includes('그게아닌')) return '/not_that.jpg';
      if (lower.includes('김종욱')) return '/finding_mr_destiny.jpg';
      if (lower.includes('배영')) return '/baeyoung_kindergarten.jpg';
      if (lower.includes('판타스틱')) return '/fantastic_date.jpg';
      if (lower.includes('옥탑')) return '/rooftop_war.jpg';
      if (lower.includes('가족')) return '/my_family.jpg';

      return url;
    };

    try {
      const savedRecordThumbnails = localStorage.getItem('nakguk_custom_record_thumbnails');
      const savedEventThumbnails = localStorage.getItem('nakguk_custom_event_thumbnails');

      if (savedRecordThumbnails) {
        const overrides = JSON.parse(savedRecordThumbnails) as Record<string, string>;
        // 마이그레이션된 오버라이드 맵 재생성 및 로컬스토리지 영구 반영
        const migratedOverrides: Record<string, string> = {};
        let changed = false;
        
        Object.keys(overrides).forEach(key => {
          const original = overrides[key];
          const corrected = migrateUrl(original);
          migratedOverrides[key] = corrected;
          if (original !== corrected) changed = true;
        });

        if (changed) {
          localStorage.setItem('nakguk_custom_record_thumbnails', JSON.stringify(migratedOverrides));
        }

        setRecords(prev =>
          prev.map(rec => migratedOverrides[rec.id] ? { ...rec, thumbnailUrl: migratedOverrides[rec.id] } : rec)
        );
      }

      if (savedEventThumbnails) {
        const overrides = JSON.parse(savedEventThumbnails) as Record<string, string>;
        const migratedOverrides: Record<string, string> = {};
        let changed = false;

        Object.keys(overrides).forEach(key => {
          const original = overrides[key];
          const corrected = migrateUrl(original);
          migratedOverrides[key] = corrected;
          if (original !== corrected) changed = true;
        });

        if (changed) {
          localStorage.setItem('nakguk_custom_event_thumbnails', JSON.stringify(migratedOverrides));
        }

        setEvents(prev =>
          prev.map(evt => migratedOverrides[evt.id] ? { ...evt, thumbnailUrl: migratedOverrides[evt.id] } : evt)
        );
      }
    } catch (e) {
      console.error("Failed to load custom thumbnails from localStorage:", e);
    }
  }, []);

  // 특정 기록물의 썸네일 경로 업데이트
  const updateRecordThumbnail = (recordId: string, url: string) => {
    setRecords(prev => {
      const updated = prev.map(rec => rec.id === recordId ? { ...rec, thumbnailUrl: url } : rec);
      
      // 로컬 스토리지 업데이트
      try {
        const saved = localStorage.getItem('nakguk_custom_record_thumbnails');
        const overrides = saved ? JSON.parse(saved) : {};
        overrides[recordId] = url;
        localStorage.setItem('nakguk_custom_record_thumbnails', JSON.stringify(overrides));
      } catch (e) {
        console.error("Failed to save custom record thumbnail:", e);
      }
      
      return updated;
    });
  };

  // 특정 공연(Event)의 썸네일 경로 업데이트
  const updateEventThumbnail = (eventId: string, url: string) => {
    setEvents(prev => {
      const updated = prev.map(evt => evt.id === eventId ? { ...evt, thumbnailUrl: url } : evt);
      
      // 로컬 스토리지 업데이트
      try {
        const saved = localStorage.getItem('nakguk_custom_event_thumbnails');
        const overrides = saved ? JSON.parse(saved) : {};
        overrides[eventId] = url;
        localStorage.setItem('nakguk_custom_event_thumbnails', JSON.stringify(overrides));
      } catch (e) {
        console.error("Failed to save custom event thumbnail:", e);
      }
      
      return updated;
    });
  };

  // 모든 오버라이드 초기화
  const resetAllThumbnails = () => {
    localStorage.removeItem('nakguk_custom_record_thumbnails');
    localStorage.removeItem('nakguk_custom_event_thumbnails');
    setRecords(FACET_RECORDS);
    setEvents(FACET_EVENTS);
  };

  return (
    <ArchiveContext.Provider value={{
      records,
      events,
      updateRecordThumbnail,
      updateEventThumbnail,
      resetAllThumbnails
    }}>
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive() {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
}
