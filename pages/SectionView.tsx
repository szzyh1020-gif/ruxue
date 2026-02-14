import React, { useState, useEffect } from 'react';
import { SectionContent } from '../types';
import { Button } from '../components/Button';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

interface SectionViewProps {
  section: SectionContent;
  onBack: () => void;
}

export const SectionView: React.FC<SectionViewProps> = ({ section, onBack }) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Scroll spy to highlight active chapter
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky header/padding

      // Find which chapter is currently in view
      let currentId = '';
      for (const chapter of section.chapters) {
        const element = document.getElementById(chapter.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentId = chapter.id;
            break; 
          }
        }
      }
      if (currentId) setActiveChapterId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [section.chapters]);

  const scrollToChapter = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100; // Adjust for sticky header
          window.scrollTo({top: y, behavior: 'smooth'});
          setActiveChapterId(id);
          setIsMobileTocOpen(false); // Close mobile menu after click
      }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="pl-0 text-gray-600 hover:text-imu-blue hover:bg-white/50 backdrop-blur-sm rounded-full px-4">
              <i className="fas fa-arrow-left mr-2"></i> <span className="hidden sm:inline">返回首页</span><span className="sm:hidden">返回</span>
          </Button>
      </div>

      {/* Module Header Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mb-8 relative border border-white/20">
          <div className="h-48 sm:h-64 relative">
             <img 
                src={section.imageUrl} 
                alt={section.title} 
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
             <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white max-w-3xl w-full">
                <div className="inline-block bg-imu-gold text-white text-xs px-2 py-1 rounded mb-2 font-bold uppercase tracking-wide">
                    {section.type}
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold mb-2 drop-shadow-md leading-tight">{section.title}</h1>
                <p className="text-sm sm:text-lg text-gray-200 drop-shadow-sm line-clamp-2 sm:line-clamp-none">{section.description}</p>
             </div>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Collapsible on Mobile, Sticky on Desktop */}
          <aside className="lg:w-1/4 flex-shrink-0 order-1 lg:order-1 relative z-20">
              {/* Mobile Toggle Button */}
              <div className="lg:hidden mb-4">
                  <button 
                    onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                    className="w-full flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40 text-gray-800 font-bold"
                  >
                      <span className="flex items-center"><i className="fas fa-list-ul mr-2 text-imu-blue"></i> 目录导航</span>
                      <i className={`fas fa-chevron-down transition-transform duration-300 ${isMobileTocOpen ? 'rotate-180' : ''}`}></i>
                  </button>
              </div>

              {/* Navigation List */}
              <div className={`${isMobileTocOpen ? 'block' : 'hidden'} lg:block sticky top-24 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-4 transition-all`}>
                  <h3 className="hidden lg:flex text-lg font-bold text-gray-900 mb-4 px-2 border-b border-gray-200/50 pb-2 items-center">
                      <i className="fas fa-list-ul mr-2 text-imu-blue"></i> 目录导航
                  </h3>
                  <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                      {section.chapters.length === 0 && (
                          <p className="text-gray-400 text-sm px-2 italic">暂无文章</p>
                      )}
                      {section.chapters.map((chapter, index) => (
                          <button
                              key={chapter.id}
                              onClick={() => scrollToChapter(chapter.id)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-start group ${
                                  activeChapterId === chapter.id 
                                  ? 'bg-imu-blue text-white shadow-md font-medium transform scale-[1.02]' 
                                  : 'text-gray-600 hover:bg-white/60 hover:text-imu-blue'
                              }`}
                          >
                              <span className={`mr-2.5 font-mono text-xs mt-0.5 opacity-80 ${activeChapterId === chapter.id ? 'text-blue-100' : 'text-gray-400 group-hover:text-imu-blue/70'}`}>
                                  {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className="line-clamp-2 leading-relaxed">{chapter.title}</span>
                          </button>
                      ))}
                  </nav>
              </div>
          </aside>

          {/* Main Content Feed */}
          <div className="flex-1 min-w-0 order-2 lg:order-2">
              <div className="space-y-8">
                  {section.chapters.length === 0 ? (
                      <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-xl border border-white/30">
                          <p className="text-gray-500 text-lg">暂无内容，敬请期待...</p>
                      </div>
                  ) : (
                      section.chapters.map((chapter) => (
                          <div 
                            id={chapter.id}
                            key={chapter.id} 
                            className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/40 scroll-mt-28 transition-all duration-300 hover:shadow-xl"
                          >
                              {chapter.imageUrl && (
                                  <div className="h-48 md:h-64 w-full relative">
                                      <img src={chapter.imageUrl} alt={chapter.title} className="w-full h-full object-cover" />
                                  </div>
                              )}
                              <div className="p-6 sm:p-8">
                                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{chapter.title}</h2>
                                  <div className="text-sm text-gray-400 mb-6 pb-4 border-b border-gray-200/50 flex items-center">
                                      <i className="far fa-clock mr-2"></i>
                                      发布时间: {new Date(chapter.createdAt).toLocaleDateString()}
                                  </div>
                                  <MarkdownRenderer content={chapter.content} />
                              </div>
                          </div>
                      ))
                  )}
              </div>
              
              <div className="mt-12 text-center pb-8 lg:hidden">
                  <Button variant="secondary" onClick={onBack} className="bg-white/80 backdrop-blur-sm">返回模块列表</Button>
              </div>
          </div>
      </div>
    </div>
  );
};