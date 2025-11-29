import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Users, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { BookStatus } from '../types';

const Dashboard: React.FC = () => {
  const { books, loans, readers } = useStore();

  const totalBooks = books.length;
  const activeLoans = loans.filter(l => l.status === 'ACTIVE').length;
  const overdueLoans = loans.filter(l => {
    if (l.status !== 'ACTIVE') return false;
    return new Date(l.dueDate) < new Date();
  }).length;
  
  // 简单的分类统计数据
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    books.forEach(book => {
      counts[book.category] = (counts[book.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [books]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ title, value, icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color} text-white shadow-lg shadow-opacity-20`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">图书馆概览</h2>
        <span className="text-sm text-slate-500">今日: {new Date().toLocaleDateString()}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="馆藏图书" 
          value={totalBooks} 
          icon={<BookOpen size={24} />} 
          color="bg-blue-500"
          subtext="本月新增 +5 本"
        />
        <StatCard 
          title="注册读者" 
          value={readers.length} 
          icon={<Users size={24} />} 
          color="bg-emerald-500"
          subtext="活跃用户占比 85%"
        />
        <StatCard 
          title="当前借出" 
          value={activeLoans} 
          icon={<Clock size={24} />} 
          color="bg-amber-500"
          subtext={`流通率 ${((activeLoans/totalBooks)*100).toFixed(1)}%`}
        />
        <StatCard 
          title="即将逾期" 
          value={overdueLoans} 
          icon={<AlertCircle size={24} />} 
          color="bg-red-500"
          subtext="需发送提醒通知"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">图书分类统计</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">快捷操作</h3>
          <div className="space-y-3 flex-1">
             <button className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 group">
                <span className="font-medium text-slate-700">新书入库</span>
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">+</span>
             </button>
             <button className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 group">
                <span className="font-medium text-slate-700">办理借阅</span>
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">→</span>
             </button>
             <button className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 group">
                <span className="font-medium text-slate-700">导出报表</span>
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">↓</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
