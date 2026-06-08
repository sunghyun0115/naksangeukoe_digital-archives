import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Archive, Info, Home, List, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import NaksanLogo from './NaksanLogo';

export default function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '아카이브 탐색', path: '/archive', icon: List },
    { name: '아카이브 소개', path: '/about', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <NaksanLogo size={42} className="shrink-0 transition-transform group-hover:scale-105 duration-300" />
            <span className="font-extrabold text-xl tracking-tight text-stone-900">
              낙산극회 <span className="text-stone-500">디지털 아카이브</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-colors hover:text-stone-950",
                    isActive ? "text-stone-950 font-bold" : "text-stone-600"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-stone-500 hover:text-stone-950 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
