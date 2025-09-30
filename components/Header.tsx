import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-white border-b border-slate-200">
      <h1 className="text-3xl md:text-4xl font-bold text-indigo-600">
        Trình Kiểm Tra Nội Dung AI & Đạo Văn
      </h1>
      <p className="mt-2 text-slate-500 max-w-2xl mx-auto">
        Phân tích văn bản để phát hiện dấu hiệu được viết bởi AI hoặc đạo văn. Nhận các đề xuất chi tiết để làm cho nội dung của bạn trở nên độc đáo và tự nhiên hơn.
      </p>
    </header>
  );
};

export default Header;