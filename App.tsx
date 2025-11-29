import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookManagement from './components/BookManagement';
import Circulation from './components/Circulation';
import AIAssistant from './components/AIAssistant';
import { Users } from 'lucide-react';

const ReadersPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <Users size={64} className="mb-4 opacity-50" />
    <h2 className="text-xl font-semibold">读者管理模块</h2>
    <p>该模块在演示版本中暂未完全展开，您可以在"流通借还"中查看模拟读者数据。</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BookManagement />;
      case 'readers':
        return <ReadersPlaceholder />;
      case 'circulation':
        return <Circulation />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
