/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import ArchiveList from './pages/ArchiveList';
import ArchiveDetail from './pages/ArchiveDetail';
import About from './pages/About';
import { ArchiveProvider } from './contexts/ArchiveContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ArchiveProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white font-sans text-stone-900 antialiased selection:bg-stone-900 selection:text-white">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/archive" element={<ArchiveList />} />
              <Route path="/archive/:id" element={<ArchiveDetail />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          
          <footer className="bg-stone-50 border-t border-stone-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <div className="font-sans font-bold text-xl mb-2 tracking-tight text-stone-900">낙산극회 <span className="text-stone-550 font-normal">디지털 아카이브</span></div>
                  <p className="text-xs font-semibold text-stone-500">한성대학교 대학문화의 보편적 가치를 기록하는 창구입니다.</p>
                </div>
                <div className="flex items-center gap-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  <span className="hover:text-stone-900 transition-colors cursor-pointer">이용약관</span>
                  <span className="hover:text-stone-900 transition-colors cursor-pointer">개인정보처리방침</span>
                  <span className="hover:text-stone-900 transition-colors cursor-pointer">수집요청</span>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-stone-100 flex justify-between items-center text-[10px] font-bold text-stone-400">
                <div>© naksangeukoe. ALL RIGHTS RESERVED.</div>
                <div className="font-mono">BUILT WITH PASSION FOR DRAMA</div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ArchiveProvider>
  );
}

