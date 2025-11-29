import React, { useState } from 'react';
import { useStore } from '../store';
import { BookStatus } from '../types';
import { Check, X, Search, ArrowRight, UserCheck, BookOpenCheck } from 'lucide-react';

const Circulation: React.FC = () => {
  const { books, readers, loans, borrowBook, returnBook } = useStore();
  const [activeTab, setActiveTab] = useState<'BORROW' | 'RETURN'>('BORROW');
  
  // Borrow State
  const [selectedReaderId, setSelectedReaderId] = useState<string>('');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');

  // Return State
  const [returnLoanId, setReturnLoanId] = useState<string>('');

  const handleBorrow = () => {
    if (!selectedReaderId || !selectedBookId) return;
    borrowBook(selectedBookId, selectedReaderId);
    setSuccessMsg('借阅成功！');
    setSelectedBookId('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleReturn = (loanId: string) => {
    returnBook(loanId);
    setSuccessMsg('归还成功！');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const activeLoansList = loans.filter(l => l.status === 'ACTIVE');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">流通借还</h2>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1 rounded-lg inline-flex">
        <button 
          onClick={() => setActiveTab('BORROW')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'BORROW' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          图书借阅
        </button>
        <button 
          onClick={() => setActiveTab('RETURN')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'RETURN' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          图书归还
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center animate-pulse">
          <Check size={20} className="mr-2" />
          {successMsg}
        </div>
      )}

      {activeTab === 'BORROW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reader Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <UserCheck size={20} className="mr-2 text-blue-500" /> 第一步：选择读者
            </h3>
            <div className="space-y-3">
              {readers.map(reader => (
                <div 
                  key={reader.id}
                  onClick={() => setSelectedReaderId(reader.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center space-x-3 ${selectedReaderId === reader.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <img src={reader.avatarUrl} className="w-10 h-10 rounded-full" alt="avatar" />
                  <div>
                    <p className="font-medium text-slate-800">{reader.name}</p>
                    <p className="text-xs text-slate-500">{reader.type}</p>
                  </div>
                  {selectedReaderId === reader.id && <Check size={16} className="ml-auto text-blue-600" />}
                </div>
              ))}
            </div>
          </div>

          {/* Book Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <BookOpenCheck size={20} className="mr-2 text-emerald-500" /> 第二步：选择图书
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {books.filter(b => b.status === BookStatus.AVAILABLE).map(book => (
                <div 
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start space-x-3 ${selectedBookId === book.id ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <img src={book.coverUrl} className="w-8 h-12 object-cover rounded bg-slate-200" alt="cover" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{book.title}</p>
                    <p className="text-xs text-slate-500">{book.author}</p>
                    <p className="text-xs text-slate-400 mt-1">ISBN: {book.isbn}</p>
                  </div>
                  {selectedBookId === book.id && <Check size={16} className="mt-2 text-emerald-600" />}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleBorrow}
              disabled={!selectedReaderId || !selectedBookId}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                (!selectedReaderId || !selectedBookId) 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              <span>确认借阅</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'RETURN' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-semibold text-lg mb-6 text-slate-800">当前借阅中</h3>
           {activeLoansList.length === 0 ? (
             <div className="text-center py-12 text-slate-400">
                <p>当前没有借出的图书</p>
             </div>
           ) : (
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                 <tr>
                   <th className="px-4 py-3">借阅单号</th>
                   <th className="px-4 py-3">图书名称</th>
                   <th className="px-4 py-3">借阅人</th>
                   <th className="px-4 py-3">应还日期</th>
                   <th className="px-4 py-3 text-right">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {activeLoansList.map(loan => {
                   const book = books.find(b => b.id === loan.bookId);
                   const reader = readers.find(r => r.id === loan.readerId);
                   const isOverdue = new Date(loan.dueDate) < new Date();

                   return (
                     <tr key={loan.id} className="hover:bg-slate-50">
                       <td className="px-4 py-3 text-sm font-mono text-slate-500">#{loan.id}</td>
                       <td className="px-4 py-3 font-medium text-slate-800">{book?.title || 'Unknown'}</td>
                       <td className="px-4 py-3 text-slate-600">{reader?.name || 'Unknown'}</td>
                       <td className="px-4 py-3 text-sm">
                         <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}>
                           {loan.dueDate}
                         </span>
                         {isOverdue && <span className="ml-2 text-xs text-red-500 bg-red-50 px-1 rounded">逾期</span>}
                       </td>
                       <td className="px-4 py-3 text-right">
                         <button 
                            onClick={() => handleReturn(loan.id)}
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                         >
                           归还
                         </button>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           )}
        </div>
      )}
    </div>
  );
};

export default Circulation;
