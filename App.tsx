import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import AnalysisReport from './components/AnalysisReport';
import Loader from './components/Loader';
import RewrittenText from './components/RewrittenText';
import { analyzeText, rewriteText } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [texts, setTexts] = useState<{ id: string; content: string }[]>([
    { id: uuidv4(), content: '' },
  ]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleTextChange = (id: string, newContent: string) => {
    setTexts(currentTexts =>
      currentTexts.map(text => (text.id === id ? { ...text, content: newContent } : text))
    );
  };

  const addTextField = () => {
    setTexts(currentTexts => [...currentTexts, { id: uuidv4(), content: '' }]);
  };

  const removeTextField = (id: string) => {
    if (texts.length > 1) {
      setTexts(currentTexts => currentTexts.filter(text => text.id !== id));
      setAnalysisResults(currentResults => currentResults.filter(result => result.id !== id));
    }
  };
  
  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setGlobalError(null);
    setAnalysisResults([]);

    const results: AnalysisResult[] = [];
    for (const text of texts) {
        if (!text.content.trim()) {
            results.push({
                id: text.id,
                originalText: text.content,
                report: null,
                error: "Văn bản trống, không thể phân tích."
            });
            continue;
        }

        try {
            const report = await analyzeText(text.content);
            let rewritten: string | undefined = undefined;
            try {
               rewritten = await rewriteText(text.content, report);
            } catch (rewriteError) {
              console.error("Rewrite failed, but analysis succeeded:", rewriteError);
              // Proceed without rewritten text if that step fails
            }
            results.push({
                id: text.id,
                originalText: text.content,
                report: report,
                rewrittenText: rewritten
            });
        } catch (error) {
            results.push({
                id: text.id,
                originalText: text.content,
                report: null,
                error: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định."
            });
        }
    }
    
    setAnalysisResults(results);
    setIsLoading(false);
  }, [texts]);

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Nội dung cần kiểm tra</h2>
            <div className="space-y-4 mb-4">
              {texts.map((text, index) => (
                <div key={text.id} className="relative group">
                  <textarea
                    value={text.content}
                    onChange={(e) => handleTextChange(text.id, e.target.value)}
                    placeholder={`Dán văn bản cần kiểm tra vào đây...`}
                    className="w-full h-48 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-y"
                  />
                  {texts.length > 1 && (
                     <button
                        onClick={() => removeTextField(text.id)}
                        className="absolute top-2 right-2 bg-red-100 text-red-600 h-7 w-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                        aria-label="Remove text field"
                      >
                       <i className="fas fa-times"></i>
                     </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={addTextField}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <i className="fas fa-plus"></i>
                Thêm văn bản
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-alt"></i>
                    <span>Kiểm Tra</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Output Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Kết quả phân tích</h2>
            {isLoading && analysisResults.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
                    <Loader />
                    <p className="text-slate-500">Đang xử lý, vui lòng chờ trong giây lát...</p>
                </div>
            )}
            
            {!isLoading && analysisResults.length === 0 && (
                 <div className="bg-white p-10 rounded-lg shadow-sm border-2 border-dashed border-slate-300 text-center">
                    <i className="fas fa-file-alt text-5xl text-slate-300 mb-4"></i>
                    <h3 className="text-lg font-semibold text-slate-600">Báo cáo của bạn sẽ xuất hiện ở đây</h3>
                    <p className="text-slate-400 mt-1">Nhấn nút "Kiểm Tra" để bắt đầu.</p>
                </div>
            )}
            
            {globalError && (
                 <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
                    <p className="font-bold">Lỗi</p>
                    <p>{globalError}</p>
                </div>
            )}

            <div className="space-y-8">
                {analysisResults.map((result, index) => (
                    <div key={result.id}>
                        <h3 className="text-lg font-semibold text-slate-500 mb-2 border-b-2 border-slate-200 pb-1">
                            Kết quả cho Văn bản #{index + 1}
                        </h3>
                        {result.report && <AnalysisReport report={result.report} />}
                        {result.rewrittenText && <RewrittenText text={result.rewrittenText} />}
                        {result.error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
                                <p className="font-bold">Không thể phân tích văn bản này</p>
                                <p>{result.error}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;