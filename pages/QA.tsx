import React, { useState } from 'react';
import { Question } from '../types';
import { Button } from '../components/Button';

interface QAPageProps {
  questions: Question[];
  onAskQuestion: (content: string, name: string) => void;
  onBack: () => void;
}

export const QAPage: React.FC<QAPageProps> = ({ questions, onAskQuestion, onBack }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [studentName, setStudentName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() && studentName.trim()) {
      onAskQuestion(newQuestion, studentName);
      setNewQuestion('');
      setShowForm(false);
      alert('提问提交成功！请等待学长学姐或AI的回复。');
    }
  };

  const featuredQuestions = questions.filter(q => q.isFeatured);
  const otherQuestions = questions.filter(q => !q.isFeatured);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <Button variant="ghost" onClick={onBack} className="mb-2 pl-0 hover:bg-white/50">
                <i className="fas fa-arrow-left mr-2"></i> 返回
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 drop-shadow-sm">新生答疑广场</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">不懂就问，学长学姐和AI助手都在线！</p>
        </div>
        <Button variant="primary" icon={<i className="fas fa-pen"></i>} onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
            我要提问
        </Button>
      </div>

      {showForm && (
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-md mb-8 border border-imu-blue/20 animate-slide-down">
          <h3 className="text-lg font-bold mb-4 text-imu-blue">提交你的问题</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">你的昵称</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imu-blue focus:border-transparent bg-white/80"
                placeholder="例如：26级萌新"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">问题内容</label>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imu-blue focus:border-transparent h-32 bg-white/80"
                placeholder="关于宿舍、食堂、选课..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>取消</Button>
              <Button type="submit" variant="primary">提交问题</Button>
            </div>
          </form>
        </div>
      )}

      {/* Featured Section */}
      {featuredQuestions.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-star text-yellow-400 text-xl drop-shadow-sm"></i>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 drop-shadow-sm">精选回答</h2>
          </div>
          <div className="grid gap-6">
            {featuredQuestions.map(q => (
              <div key={q.id} className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-yellow-100 p-4 sm:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-200 to-transparent opacity-50"></div>
                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-imu-blue rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 font-bold text-sm sm:text-base">Q</div>
                    <div className="flex-1">
                        <p className="font-bold text-base sm:text-lg text-gray-900">{q.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{q.studentName} · {new Date(q.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
                {q.answer && (
                    <div className="flex items-start gap-4 mt-4 bg-gray-50/80 p-3 sm:p-4 rounded-lg">
                        <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 font-bold text-sm sm:text-base">A</div>
                        <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{q.answer}</p>
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Questions */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 drop-shadow-sm">最新提问</h2>
        <div className="space-y-4">
          {otherQuestions.length === 0 ? (
             <p className="text-gray-500 text-center py-8 bg-white/60 backdrop-blur-sm rounded-lg">暂时没有其他问题，快来抢沙发吧！</p>
          ) : (
            otherQuestions.map(q => (
              <div key={q.id} className="bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 hover:bg-white/90 transition-colors">
                 <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                     <div>
                        <p className="font-medium text-gray-900">{q.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{q.studentName} · {new Date(q.timestamp).toLocaleString()}</p>
                     </div>
                     <span className={`px-2 py-1 rounded text-xs self-start ${q.isAnswered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                         {q.isAnswered ? '已回复' : '待回复'}
                     </span>
                 </div>
                 {q.answer && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                        <span className="font-bold text-imu-blue mr-2">回复:</span>
                        {q.answer}
                    </div>
                 )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};