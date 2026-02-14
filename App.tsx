import React, { useState, useEffect } from 'react';
import { SectionContent, Question, ViewState, GlobalSettings } from './types';
import { MOCK_SECTIONS, MOCK_QUESTIONS, DEFAULT_SETTINGS } from './constants';
import { PublicHome } from './pages/PublicHome';
import { SectionView } from './pages/SectionView';
import { QAPage } from './pages/QA';
import { AdminDashboard } from './admin/AdminDashboard';
import { Button } from './components/Button';
import { Modal } from './components/Modal';

// Persistence Keys
const STORAGE_KEYS = {
    SECTIONS: 'imu_sections_v2',
    QUESTIONS: 'imu_questions',
    SETTINGS: 'imu_settings'
};

const loadData = () => {
  const savedSections = localStorage.getItem(STORAGE_KEYS.SECTIONS);
  const savedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  
  return {
    sections: savedSections ? JSON.parse(savedSections) : MOCK_SECTIONS,
    questions: savedQuestions ? JSON.parse(savedQuestions) : MOCK_QUESTIONS,
    settings: savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS
  };
};

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Data State
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);

  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Initialize Data
  useEffect(() => {
    const data = loadData();
    setSections(data.sections);
    setQuestions(data.questions);
    setSettings(data.settings);
  }, []);

  // Persistence
  useEffect(() => {
    if (sections.length > 0) localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    if (questions.length > 0) localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [sections, questions, settings]);

  // Handlers
  const handleNavigate = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setViewState(ViewState.SECTION_DETAIL);
    window.scrollTo(0,0);
  };

  const handleGoHome = () => {
    setViewState(ViewState.HOME);
    setActiveSectionId(null);
    window.scrollTo(0,0);
  };

  const handleAskQuestion = (content: string, studentName: string) => {
    const newQ: Question = {
        id: Date.now().toString(),
        studentName,
        content,
        timestamp: Date.now(),
        isFeatured: false,
        isAnswered: false
    };
    setQuestions(prev => [newQ, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (username === 'imu2026' && password === 'nmgdxxssqtgw2026') {
          setIsAdmin(true);
          setShowLoginModal(false);
          setViewState(ViewState.ADMIN_DASHBOARD);
          setUsername('');
          setPassword('');
          setLoginError('');
      } else {
          setLoginError('账号或密码错误');
      }
  };

  // Admin View
  if (isAdmin || viewState === ViewState.ADMIN_DASHBOARD) {
    return (
      <AdminDashboard 
        sections={sections}
        questions={questions}
        settings={settings}
        onUpdateSection={(updated) => setSections(prev => prev.map(s => s.id === updated.id ? updated : s))}
        onUpdateQuestion={(updated) => setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q))}
        onUpdateSettings={setSettings}
        onExitAdmin={() => {
            setIsAdmin(false);
            setViewState(ViewState.HOME);
        }}
      />
    );
  }

  // Public View
  return (
    <div className="min-h-screen flex flex-col font-sans transition-all duration-500 relative bg-gray-50/50">
      {/* Background Image Layer with Blur */}
      {settings.backgroundImageUrl && (
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ 
            backgroundImage: `url(${settings.backgroundImageUrl})`,
            filter: 'blur(8px)'
          }}
        >
          {/* Overlay to ensure text readability on top of blurred image */}
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
      )}

      {/* Navbar - Glassmorphism */}
      <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={handleGoHome}>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-imu-blue rounded-full flex items-center justify-center text-white font-serif font-bold shadow-sm">U</div>
                <span className="font-bold text-xl text-imu-blue hidden md:block">{settings.siteTitle}</span>
                <span className="font-bold text-lg text-imu-blue md:hidden">IMU Guide</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
               <button onClick={handleGoHome} className="text-gray-700 hover:text-imu-blue px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/50">首页</button>
               <button onClick={() => setViewState(ViewState.QA)} className="text-gray-700 hover:text-imu-blue px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/50">答疑</button>
               <Button size="sm" variant="ghost" onClick={() => setShowLoginModal(true)} className="px-2">
                 <i className="fas fa-user-cog sm:mr-1"></i> <span className="hidden sm:inline">管理员</span>
               </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pb-12 relative z-0">
        {viewState === ViewState.HOME && (
          <PublicHome 
            sections={sections} 
            onNavigate={handleNavigate} 
            onGoToQA={() => {
                setViewState(ViewState.QA);
                window.scrollTo(0,0);
            }}
            settings={settings}
          />
        )}

        {viewState === ViewState.SECTION_DETAIL && activeSectionId && (
            <SectionView 
                section={sections.find(s => s.id === activeSectionId)!} 
                onBack={handleGoHome} 
            />
        )}

        {viewState === ViewState.QA && (
            <QAPage 
                questions={questions} 
                onAskQuestion={handleAskQuestion} 
                onBack={handleGoHome} 
            />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-md text-white relative z-10 border-t border-white/10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-medium text-gray-200 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <a 
                           href={settings.recruitmentUrl || '#'} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="font-bold text-white hover:text-imu-gold transition-all duration-300 border-b border-dashed border-gray-600 hover:border-imu-gold pb-1 cursor-pointer group"
                           title="点击查看招新信息"
                        >
                           <i className="fas fa-users text-imu-gold mr-2 opacity-80 group-hover:opacity-100"></i>
                           内蒙古大学学生社区团工委 制
                        </a>
                        <span className="hidden md:inline text-gray-600 text-sm">|</span>
                        <span className="text-sm md:text-base text-gray-400">共青团内蒙古大学委员会 监制</span>
                    </h3>
                    <p className="text-gray-500 text-xs mt-3 tracking-wider">服务同学 · 引领思想 · 凝聚青年</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-1 text-gray-500 text-xs">
                    <div>&copy; 2026 IMU Freshman Guide.</div>
                    <div className="opacity-60">Designed for the Future</div>
                </div>
            </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="管理员登录">
          <form onSubmit={handleLogin} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">账号</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-imu-blue focus:border-imu-blue"
                    required
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">密码</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-imu-blue focus:border-imu-blue"
                    required
                  />
              </div>
              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
              <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowLoginModal(false)}>取消</Button>
                  <Button type="submit" variant="primary">登录</Button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default App;