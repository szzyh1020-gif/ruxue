import React, { useState } from 'react';
import { SectionContent, Question, Chapter, GlobalSettings } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { generateSectionContent, answerStudentQuestion } from '../services/geminiService';

interface AdminDashboardProps {
  sections: SectionContent[];
  questions: Question[];
  settings: GlobalSettings;
  onUpdateSection: (updatedSection: SectionContent) => void;
  onUpdateQuestion: (updatedQuestion: Question) => void;
  onUpdateSettings: (settings: GlobalSettings) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  sections, 
  questions, 
  settings,
  onUpdateSection, 
  onUpdateQuestion,
  onUpdateSettings,
  onExitAdmin 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'qa' | 'settings'>('content');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  // Section Editing State (Module Covers)
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<SectionContent>>({});

  // Chapter Editing State
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Partial<Chapter>>({});
  const [aiLoading, setAiLoading] = useState(false);

  // QA Editing State
  const [replyingQuestion, setReplyingQuestion] = useState<Question | null>(null);
  const [replyText, setReplyText] = useState('');

  // Settings State
  const [localSettings, setLocalSettings] = useState<GlobalSettings>(settings);

  // Helper to read file as Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Module (Section) Logic ---

  const handleEditSectionInfo = (section: SectionContent) => {
      setCurrentSection({...section});
      setIsEditingSection(true);
  };

  const handleSaveSectionInfo = () => {
      if (!currentSection.id) return;
      const updatedSection = { ...sections.find(s => s.id === currentSection.id), ...currentSection } as SectionContent;
      updatedSection.lastUpdated = Date.now();
      onUpdateSection(updatedSection);
      setIsEditingSection(false);
      setCurrentSection({});
  };

  const handleOpenModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
  };

  const handleBackToModules = () => {
    setActiveModuleId(null);
  };

  // --- Chapter Logic ---

  const handleNewChapter = () => {
    setCurrentChapter({ id: '', title: '', content: '', imageUrl: '' });
    setIsEditingChapter(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setCurrentChapter({ ...chapter });
    setIsEditingChapter(true);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!activeModuleId) return;
    if (confirm('确定要删除这篇文章吗？')) {
        const module = sections.find(s => s.id === activeModuleId);
        if (module) {
            const updatedChapters = module.chapters.filter(c => c.id !== chapterId);
            onUpdateSection({ ...module, chapters: updatedChapters, lastUpdated: Date.now() });
        }
    }
  };

  const handleMoveChapter = (chapterId: string, direction: 'up' | 'down') => {
      if (!activeModuleId) return;
      const module = sections.find(s => s.id === activeModuleId);
      if (!module) return;

      const idx = module.chapters.findIndex(c => c.id === chapterId);
      if (idx === -1) return;
      if (direction === 'up' && idx === 0) return;
      if (direction === 'down' && idx === module.chapters.length - 1) return;

      const newChapters = [...module.chapters];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newChapters[idx], newChapters[swapIdx]] = [newChapters[swapIdx], newChapters[idx]];

      onUpdateSection({ ...module, chapters: newChapters, lastUpdated: Date.now() });
  };

  const handleSaveChapter = () => {
    if (!activeModuleId) return;
    const module = sections.find(s => s.id === activeModuleId);
    if (!module) return;

    let updatedChapters = [...module.chapters];
    
    if (currentChapter.id) {
        // Edit existing
        updatedChapters = updatedChapters.map(c => c.id === currentChapter.id ? { ...c, ...currentChapter } as Chapter : c);
    } else {
        // Create new
        const newChapter: Chapter = {
            ...currentChapter,
            id: Date.now().toString(),
            createdAt: Date.now(),
            content: currentChapter.content || '',
            title: currentChapter.title || '无标题'
        } as Chapter;
        updatedChapters.push(newChapter);
    }

    onUpdateSection({ ...module, chapters: updatedChapters, lastUpdated: Date.now() });
    setIsEditingChapter(false);
    setCurrentChapter({});
  };

  // --- AI Logic ---

  const handleAiGenerate = async (type: 'polish' | 'expand') => {
    if (!currentChapter.content) return;
    setAiLoading(true);
    const newContent = await generateSectionContent(currentChapter.title || 'Section', currentChapter.content, type);
    setCurrentChapter({ ...currentChapter, content: newContent });
    setAiLoading(false);
  };

  // --- QA Logic ---

  const handleOpenReply = (question: Question) => {
      setReplyingQuestion(question);
      setReplyText(question.answer || '');
  };

  const handleAiAnswer = async () => {
      if (!replyingQuestion) return;
      setAiLoading(true);
      const aiAnswer = await answerStudentQuestion(replyingQuestion.content);
      setReplyText(aiAnswer);
      setAiLoading(false);
  };

  const handleSaveReply = () => {
      if (!replyingQuestion) return;
      onUpdateQuestion({
          ...replyingQuestion,
          answer: replyText,
          isAnswered: true
      });
      setReplyingQuestion(null);
      setReplyText('');
  };

  const toggleFeatured = (question: Question) => {
    onUpdateQuestion({
        ...question,
        isFeatured: !question.isFeatured
    });
  };

  // --- Settings Logic ---
  const saveSettings = () => {
      onUpdateSettings(localSettings);
      alert('设置已保存');
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Admin Header */}
      <div className="bg-slate-800 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <i className="fas fa-university text-imu-gold text-2xl"></i>
                <div className="hidden sm:block">
                    <h1 className="text-xl font-bold">团委管理后台</h1>
                    <div className="text-xs text-gray-400">IMU 2026 CMS</div>
                </div>
                <div className="sm:hidden">
                    <h1 className="text-lg font-bold">后台管理</h1>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="danger" size="sm" onClick={onExitAdmin}>
                    <i className="fas fa-sign-out-alt mr-2 sm:mr-0"></i> <span className="hidden sm:inline">退出登录</span>
                </Button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 border-b border-gray-300 pb-1 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => { setActiveTab('content'); setActiveModuleId(null); }}
                className={`px-4 sm:px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center whitespace-nowrap text-sm sm:text-base ${activeTab === 'content' ? 'bg-white text-imu-blue border border-gray-200 border-b-white shadow-sm -mb-px' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                <i className="fas fa-th-large mr-2"></i> 模块与文章
            </button>
            <button 
                onClick={() => setActiveTab('qa')}
                className={`px-4 sm:px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center whitespace-nowrap text-sm sm:text-base ${activeTab === 'qa' ? 'bg-white text-imu-blue border border-gray-200 border-b-white shadow-sm -mb-px' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                <i className="fas fa-comments mr-2"></i> 问答 
                {questions.filter(q => !q.isAnswered).length > 0 && 
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{questions.filter(q => !q.isAnswered).length}</span>
                }
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 sm:px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center whitespace-nowrap text-sm sm:text-base ${activeTab === 'settings' ? 'bg-white text-imu-blue border border-gray-200 border-b-white shadow-sm -mb-px' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                <i className="fas fa-cog mr-2"></i> 设置
            </button>
        </div>

        {/* --- Content Management Tab --- */}
        {activeTab === 'content' && !activeModuleId && (
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2">
                {sections.map(section => (
                    <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-32 sm:h-40 relative group">
                             <img src={section.imageUrl} alt="preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button size="sm" variant="secondary" onClick={() => handleEditSectionInfo(section)}>
                                     <i className="fas fa-image mr-1"></i> 修改封面/信息
                                 </Button>
                             </div>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 pointer-events-none">
                                <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1">{section.title}</h3>
                             </div>
                        </div>
                        <div className="p-4 sm:p-6 flex-1 flex flex-col">
                            <p className="text-gray-600 mb-4 text-xs sm:text-sm line-clamp-2 flex-grow">{section.description}</p>
                            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mb-4">
                                <span><i className="fas fa-file-alt mr-1"></i> {section.chapters.length} 篇文章</span>
                                <span>{new Date(section.lastUpdated).toLocaleDateString()}</span>
                            </div>
                            <Button onClick={() => handleOpenModule(section.id)} variant="primary" className="w-full">
                                <i className="fas fa-edit mr-2"></i> 管理文章内容
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* --- Single Module Management (Chapter List) --- */}
        {activeTab === 'content' && activeModuleId && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 rounded-t-xl gap-4">
                     <div className="flex items-center w-full sm:w-auto">
                        <Button variant="ghost" size="sm" onClick={handleBackToModules} className="mr-3 pl-0">
                            <i className="fas fa-arrow-left mr-1"></i> 返回
                        </Button>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                                {sections.find(s => s.id === activeModuleId)?.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">管理该模块下的文章内容与顺序</p>
                        </div>
                     </div>
                     <Button variant="primary" onClick={handleNewChapter} className="w-full sm:w-auto">
                         <i className="fas fa-plus mr-2"></i> 新建文章
                     </Button>
                </div>

                {/* Chapter List */}
                <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                        {sections.find(s => s.id === activeModuleId)?.chapters.length === 0 && (
                            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <i className="fas fa-file-alt text-4xl mb-4"></i>
                                <p>该模块下暂无文章，点击右上角新建</p>
                            </div>
                        )}
                        {sections.find(s => s.id === activeModuleId)?.chapters.map((chapter, index, arr) => (
                            <div key={chapter.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-imu-blue transition-colors group gap-4">
                                <div className="flex items-center w-full sm:w-auto">
                                    <div className="text-gray-400 font-bold w-8 text-center">{index + 1}</div>
                                    <div className="h-14 w-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3 border border-gray-100 relative">
                                        {chapter.imageUrl ? 
                                            <img src={chapter.imageUrl} className="w-full h-full object-cover" alt="cover" /> :
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><i className="fas fa-image"></i></div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0 sm:mr-4 sm:hidden">
                                        <h4 className="text-base font-bold text-gray-900 truncate">{chapter.title}</h4>
                                        <p className="text-xs text-gray-500 truncate">{new Date(chapter.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0 hidden sm:block">
                                    <h4 className="text-lg font-bold text-gray-900 truncate">{chapter.title}</h4>
                                    <p className="text-xs text-gray-500 truncate">{new Date(chapter.createdAt).toLocaleString()}</p>
                                </div>

                                <div className="flex items-center justify-end w-full sm:w-auto gap-2 border-t pt-3 sm:border-t-0 sm:pt-0 border-gray-100 mt-2 sm:mt-0">
                                    <div className="flex gap-1 mr-2">
                                        <button 
                                            onClick={() => handleMoveChapter(chapter.id, 'up')}
                                            disabled={index === 0}
                                            className="p-2 text-gray-400 hover:text-imu-blue disabled:opacity-30 disabled:cursor-not-allowed border rounded hover:bg-gray-50"
                                        >
                                            <i className="fas fa-chevron-up"></i>
                                        </button>
                                        <button 
                                            onClick={() => handleMoveChapter(chapter.id, 'down')}
                                            disabled={index === arr.length - 1}
                                            className="p-2 text-gray-400 hover:text-imu-blue disabled:opacity-30 disabled:cursor-not-allowed border rounded hover:bg-gray-50"
                                        >
                                            <i className="fas fa-chevron-down"></i>
                                        </button>
                                    </div>
                                    <Button size="sm" variant="secondary" onClick={() => handleEditChapter(chapter)}>编辑</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteChapter(chapter.id)}>删除</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* --- QA Management Tab --- */}
        {activeTab === 'qa' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                     <h2 className="text-lg sm:text-xl font-bold text-gray-800">问答管理</h2>
                     <p className="text-gray-500 text-xs sm:text-sm mt-1">回复新生提问，设置精选问题</p>
                </div>
                <div className="divide-y divide-gray-100">
                    {questions.length === 0 && (
                        <div className="p-12 text-center text-gray-400">暂无提问</div>
                    )}
                    {questions.map((q) => (
                        <div key={q.id} className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${!q.isAnswered ? 'bg-red-50/30' : ''}`}>
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="font-bold text-gray-900">{q.studentName}</span>
                                    <span className="text-xs text-gray-400">{new Date(q.timestamp).toLocaleString()}</span>
                                    {!q.isAnswered && <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">待回复</span>}
                                    {q.isFeatured && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded text-xs font-bold"><i className="fas fa-star mr-1"></i>精选</span>}
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    <Button size="sm" variant={q.isFeatured ? 'secondary' : 'ghost'} onClick={() => toggleFeatured(q)} title="设为精选" className="flex-1 sm:flex-none">
                                        <i className={`fas fa-star ${q.isFeatured ? 'text-yellow-400' : 'text-gray-300'}`}></i> <span className="sm:hidden ml-1">精选</span>
                                    </Button>
                                    <Button size="sm" variant="primary" onClick={() => handleOpenReply(q)} className="flex-1 sm:flex-none">
                                        <i className="fas fa-reply mr-1"></i> {q.isAnswered ? '修改回复' : '回复'}
                                    </Button>
                                </div>
                            </div>
                            <div className="mb-3">
                                <p className="text-gray-800 font-medium text-sm sm:text-base">{q.content}</p>
                            </div>
                            {q.answer && (
                                <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
                                    <span className="font-bold text-imu-blue mr-1">回复:</span> {q.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- Global Settings Tab --- */}
        {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6 text-gray-800">全局设置</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">网站标题</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={localSettings.siteTitle}
                            onChange={(e) => setLocalSettings({...localSettings, siteTitle: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">欢迎动态 (首页顶部通知)</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={localSettings.welcomeMessage || ''}
                            onChange={(e) => setLocalSettings({...localSettings, welcomeMessage: e.target.value})}
                            placeholder="例如：热烈欢迎2026级新同学..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">招新链接 (点击页脚"学生社区团工委"跳转)</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={localSettings.recruitmentUrl || ''}
                            onChange={(e) => setLocalSettings({...localSettings, recruitmentUrl: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">全站背景图片</label>
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="w-full sm:w-32 h-32 sm:h-20 bg-gray-100 rounded border border-gray-300 overflow-hidden flex items-center justify-center">
                                {localSettings.backgroundImageUrl ? (
                                    <img src={localSettings.backgroundImageUrl} alt="bg" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-gray-400">无背景</span>
                                )}
                            </div>
                            <div className="flex-1 w-full">
                                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 block sm:inline-block mb-2 text-center sm:text-left">
                                    上传图片
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setLocalSettings({...localSettings, backgroundImageUrl: url}))} />
                                </label>
                                <p className="text-xs text-gray-500">支持 jpg, png 格式。建议尺寸 1920x1080。</p>
                                {localSettings.backgroundImageUrl && (
                                    <button onClick={() => setLocalSettings({...localSettings, backgroundImageUrl: ''})} className="text-xs text-red-500 mt-2 hover:underline">清除背景</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex justify-end">
                        <Button onClick={saveSettings} className="w-full sm:w-auto">保存设置</Button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Edit Section (Module Cover) Modal */}
      <Modal isOpen={isEditingSection} onClose={() => setIsEditingSection(false)} title="编辑模块信息">
          <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">模块名称</label>
                  <input 
                    type="text" 
                    value={currentSection.title || ''} 
                    onChange={(e) => setCurrentSection({...currentSection, title: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">模块描述</label>
                  <textarea 
                    value={currentSection.description || ''} 
                    onChange={(e) => setCurrentSection({...currentSection, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    rows={3}
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">封面图片</label>
                  <div className="mt-1 flex items-center gap-3">
                      <div className="h-16 w-24 bg-gray-100 border rounded overflow-hidden">
                          {currentSection.imageUrl && <img src={currentSection.imageUrl} className="h-full w-full object-cover" />}
                      </div>
                      <label className="cursor-pointer text-sm text-imu-blue hover:text-blue-700 font-medium">
                          更改封面
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setCurrentSection({...currentSection, imageUrl: url}))} />
                      </label>
                  </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                  <Button variant="secondary" onClick={() => setIsEditingSection(false)}>取消</Button>
                  <Button variant="primary" onClick={handleSaveSectionInfo}>保存修改</Button>
              </div>
          </div>
      </Modal>

      {/* Edit Chapter Modal */}
      <Modal isOpen={isEditingChapter} onClose={() => setIsEditingChapter(false)} title={currentChapter.id ? "编辑文章" : "新建文章"}>
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">文章标题</label>
                  <input 
                    type="text" 
                    value={currentChapter.title || ''} 
                    onChange={(e) => setCurrentChapter({...currentChapter, title: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-imu-blue focus:border-imu-blue"
                    placeholder="请输入标题"
                  />
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700">封面图片</label>
                  <div className="mt-1 flex items-center gap-3">
                      <div className="h-12 w-20 bg-gray-100 border rounded overflow-hidden">
                          {currentChapter.imageUrl && <img src={currentChapter.imageUrl} className="h-full w-full object-cover" />}
                      </div>
                      <label className="cursor-pointer text-sm text-imu-blue hover:text-blue-700 font-medium">
                          上传图片
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setCurrentChapter({...currentChapter, imageUrl: url}))} />
                      </label>
                      {currentChapter.imageUrl && (
                          <button onClick={() => setCurrentChapter({...currentChapter, imageUrl: ''})} className="text-sm text-red-500">移除</button>
                      )}
                  </div>
              </div>

              <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">内容 (Markdown)</label>
                    <div className="space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleAiGenerate('polish')} isLoading={aiLoading} className="text-purple-600 text-xs">
                            <i className="fas fa-magic mr-1"></i> AI润色
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleAiGenerate('expand')} isLoading={aiLoading} className="text-purple-600 text-xs">
                            <i className="fas fa-expand mr-1"></i> AI扩写
                        </Button>
                    </div>
                  </div>
                  <textarea 
                    rows={12}
                    value={currentChapter.content || ''} 
                    onChange={(e) => setCurrentChapter({...currentChapter, content: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 font-mono text-sm focus:ring-imu-blue focus:border-imu-blue"
                    placeholder="在此输入内容..."
                  />
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                  <Button variant="secondary" onClick={() => setIsEditingChapter(false)}>取消</Button>
                  <Button variant="primary" onClick={handleSaveChapter}>保存</Button>
              </div>
          </div>
      </Modal>

      {/* Reply Question Modal */}
      <Modal isOpen={!!replyingQuestion} onClose={() => setReplyingQuestion(null)} title="回复提问">
          <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 mb-1">{replyingQuestion?.studentName}:</p>
                  <p className="text-gray-700">{replyingQuestion?.content}</p>
              </div>
              <div>
                  <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">回复内容</label>
                      <Button size="sm" variant="ghost" onClick={handleAiAnswer} isLoading={aiLoading} className="text-purple-600 text-xs">
                          <i className="fas fa-robot mr-1"></i> AI生成回复
                      </Button>
                  </div>
                  <textarea 
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                      placeholder="请输入回复..."
                  />
              </div>
              <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setReplyingQuestion(null)}>取消</Button>
                  <Button variant="primary" onClick={handleSaveReply}>提交回复</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};