import React from 'react';
import { AnalysisReportData, RevisionSuggestion } from '../types';

interface AnalysisReportProps {
  report: AnalysisReportData;
}

const SuggestionCard: React.FC<{ suggestion: RevisionSuggestion, index: number }> = ({ suggestion, index }) => (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 rounded-full h-6 w-6 flex items-center justify-center mr-3 font-bold text-sm">{index + 1}</span>
            Gợi ý để viết tự nhiên hơn
        </h4>
        <div className="space-y-3 text-sm">
            <p className="text-slate-500 italic border-l-4 border-red-300 pl-3 py-1">
                <strong className="text-slate-600 not-italic">Đoạn văn giống AI:</strong> "{suggestion.suspicious_passage}"
            </p>
            <p className="text-slate-700">
                <strong className="text-slate-600">Đề xuất sửa:</strong> {suggestion.suggestion}
            </p>
            <p className="text-slate-600 bg-green-50 border-l-4 border-green-400 pl-3 py-1 rounded-r-md">
                <strong className="text-slate-600">Ví dụ viết lại tự nhiên hơn:</strong> "{suggestion.rewritten_example}"
            </p>
        </div>
    </div>
);


const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  const percentage = report.ai_detection_percentage;
  const percentageColor = percentage >= 75 
    ? 'text-red-600' 
    : percentage >= 40 
    ? 'text-yellow-600' 
    : 'text-green-600';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
      
      {/* Conclusion & Percentage */}
      <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Kết luận</h3>
          <p className="text-slate-600">{report.conclusion}</p>
        </div>
        <div className="mt-4 md:mt-0 flex-shrink-0 bg-slate-100 rounded-lg p-4 text-center border border-slate-200">
          <div className={`text-4xl font-bold ${percentageColor}`}>{report.ai_detection_percentage}%</div>
          <div className="text-sm text-slate-500 font-medium">Phát Hiện AI</div>
        </div>
      </div>
      
      {/* Key Evidence */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Bằng chứng chính</h3>
        <ul className="space-y-2 list-inside">
          {report.key_evidence.map((evidence, index) => (
            <li key={index} className="flex items-start text-slate-600">
              <i className="fas fa-quote-left text-indigo-300 mr-3 mt-1 flex-shrink-0"></i>
              <span>{evidence}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Revision Suggestions */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Đề xuất sửa đổi nổi bật</h3>
        <div className="space-y-4">
          {report.revision_suggestions.map((suggestion, index) => (
            <SuggestionCard key={index} suggestion={suggestion} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;