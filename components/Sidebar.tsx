import React from 'react';
import { LayoutDashboard, BookOpen, Users, ArrowLeftRight, Sparkles, Library } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard size={20} /> },
    { id: 'books', label: '图书管理', icon: <BookOpen size={20} /> },
    { id: 'readers', label: '读者管理', icon: <Users size={20} /> },
    { id: 'circulation', label: '流通借还', icon: <ArrowLeftRight size={20} /> },
    { id: 'ai-assistant', label: 'AI 馆员', icon: <Sparkles size={20} className="text-yellow-400" /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <Library className="text-blue-400" size={28} />
        <div>
          <h1 className="text-xl font-bold tracking-tight">智图云</h1>
          <p className="text-xs text-slate-400">智能图书馆系统</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">管理员</p>
            <p className="text-xs text-slate-400 truncate">admin@lib.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
