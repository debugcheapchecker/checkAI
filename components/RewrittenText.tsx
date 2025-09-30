import React, { useState } from 'react';

interface RewrittenTextProps {
  text: string;
}

const RewrittenText: React.FC<RewrittenTextProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-6 bg-green-50 p-6 rounded-lg shadow-sm border border-green-200 relative">
      <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center">
        <i className="fas fa-magic-wand-sparkles mr-3"></i>
        Văn bản đã được viết lại (Tự nhiên hơn)
      </h3>
      <p className="text-slate-700 whitespace-pre-wrap font-serif leading-relaxed">
        {text}
      </p>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 bg-white border border-slate-300 text-slate-600 px-3 py-1 rounded-md text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
        aria-label="Copy rewritten text"
      >
        {copied ? (
            <>
                <i className="fas fa-check text-green-500"></i>
                <span>Đã sao chép!</span>
            </>
        ) : (
            <>
                <i className="far fa-copy"></i>
                <span>Sao chép</span>
            </>
        )}
      </button>
    </div>
  );
};

export default RewrittenText;
