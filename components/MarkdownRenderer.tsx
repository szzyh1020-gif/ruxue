import React from 'react';

// A simple approach to rendering content with line breaks and basic formatting
// In a real production app, use 'react-markdown'
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Rudimentary parser for demo purposes to avoid heavy dependencies
  const processText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-gray-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-imu-blue mt-6 mb-3 border-b pb-1">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-6 mb-4">{line.replace('# ', '')}</h1>;
      
      // List items
      if (line.startsWith('* ')) return <li key={index} className="ml-4 list-disc text-gray-700 mb-1">{line.replace('* ', '')}</li>;
      if (line.match(/^\d+\. /)) return <div key={index} className="ml-4 mb-1 text-gray-700"><span className="font-bold mr-2">{line.split('.')[0]}.</span>{line.substring(line.indexOf('.') + 1)}</div>;
      
      // Images
      const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden shadow-md">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto object-cover max-h-96" />
            <p className="text-center text-sm text-gray-500 mt-1">{imgMatch[1]}</p>
          </div>
        );
      }

      // Bold text handling (simple)
      const parts = line.split('**');
      if (parts.length > 1) {
          return (
              <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                  {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
              </p>
          )
      }

      // Empty lines
      if (line.trim() === '') return <br key={index} />;

      // Paragraphs
      return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  return <div className={`markdown-body ${className}`}>{processText(content)}</div>;
};