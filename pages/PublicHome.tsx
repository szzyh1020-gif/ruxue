import React from 'react';
import { SectionContent, GlobalSettings } from '../types';
import { Button } from '../components/Button';

interface PublicHomeProps {
  sections: SectionContent[];
  onNavigate: (sectionId: string) => void;
  onGoToQA: () => void;
  settings: GlobalSettings;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ sections, onNavigate, onGoToQA, settings }) => {
  return (
    <div className="animate-fade-in pt-6">
      {/* Welcome Notification Banner */}
      {settings.welcomeMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-slide-down">
             <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm border-l-4 border-imu-gold flex items-center text-imu-blue">
                <i className="fas fa-bullhorn mr-3 text-xl animate-pulse"></i>
                <span className="font-medium text-lg">{settings.welcomeMessage}</span>
             </div>
          </div>
      )}

      {/* Hero Section - Frosted Glass */}
      <div className="relative bg-imu-blue/70 backdrop-blur-lg overflow-hidden text-white rounded-xl mb-12 shadow-2xl border border-white/20 mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto">
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 drop-shadow-md">
            崇尚真知 追求卓越
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto drop-shadow-sm">
            欢迎加入内蒙古大学大家庭！这里是你梦想起航的地方。
            <br />
            我们为2026级新生准备了这份专属入学指南。
          </p>
          <div className="mt-10 flex justify-center gap-4">
             <Button variant="secondary" size="lg" className="bg-white/90 hover:bg-white border-none shadow-lg text-imu-blue" onClick={() => document.getElementById('modules')?.scrollIntoView({behavior: 'smooth'})}>
                开始探索
             </Button>
             <Button variant="primary" size="lg" className="bg-imu-gold text-white hover:bg-yellow-600 border-none shadow-lg" onClick={onGoToQA}>
                新生提问
             </Button>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div id="modules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">入学指南模块</h2>
          <p className="mt-4 text-lg text-gray-600">点击下方卡片，解锁你的大学生活</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {sections.map((section) => (
            <div 
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="group relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-white/40 flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={section.imageUrl} 
                  alt={section.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-imu-blue transition-colors">
                    {section.title}
                    </h3>
                    <i className="fas fa-arrow-right text-gray-400 group-hover:text-imu-blue transform group-hover:translate-x-1 transition-all"></i>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {section.description}
                </p>
                <div className="mt-auto pt-4 text-sm text-gray-400">
                    最后更新: {new Date(section.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Featured QA Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/40">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    <i className="fas fa-fire text-red-500 mr-2"></i>
                    热门精选提问
                </h2>
                <Button variant="ghost" onClick={onGoToQA}>查看更多 <i className="fas fa-angle-right ml-1"></i></Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {/* This is a static preview, dynamic content is in QA page */}
                <div className="bg-gray-50/80 p-4 rounded-lg border-l-4 border-imu-gold">
                    <h4 className="font-bold text-gray-800 mb-2">Q: 大一新生必须住校吗？</h4>
                    <p className="text-gray-600 text-sm">A: 原则上要求大一新生统一住校，便于管理和融入集体...</p>
                </div>
                <div className="bg-gray-50/80 p-4 rounded-lg border-l-4 border-imu-gold">
                    <h4 className="font-bold text-gray-800 mb-2">Q: 怎么办理校园卡？</h4>
                    <p className="text-gray-600 text-sm">A: 入学报到时会统一发放校园一卡通，集成了食堂、门禁、借书功能...</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};