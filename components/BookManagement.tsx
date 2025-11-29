import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter, BookOpen } from 'lucide-react';
import { useStore } from '../store';
import { BookStatus } from '../types';

const BookManagement: React.FC = () => {
  const { books } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.isbn.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookStatus) => {
    switch (status) {
      case BookStatus.AVAILABLE:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">在架</span>;
      case BookStatus.BORROWED:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">已借出</span>;
      case BookStatus.MAINTENANCE:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">维护中</span>;
      case BookStatus.LOST:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">遗失</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">图书管理</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={18} />
          <span>新书入库</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="搜索书名、作者、ISBN..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="text-slate-400" size={20} />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">所有状态</option>
            <option value={BookStatus.AVAILABLE}>在架</option>
            <option value={BookStatus.BORROWED}>已借出</option>
            <option value={BookStatus.MAINTENANCE}>维护中</option>
          </select>
        </div>
      </div>

      {/* Book List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">图书信息</th>
              <th className="px-6 py-4">ISBN / 分类</th>
              <th className="px-6 py-4">索书号</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm bg-slate-200" />
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">{book.title}</p>
                      <p className="text-sm text-slate-500">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-800">{book.isbn}</p>
                  <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{book.category}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    {book.location}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(book.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBooks.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>未找到匹配的图书</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManagement;