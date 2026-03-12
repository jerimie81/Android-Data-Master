import React, { useState } from 'react';
import { ShieldCheck, HardDrive, RotateCcw, MessageSquare, Search as SearchIcon, Smartphone } from 'lucide-react';
import { Tab } from './types';
import PreFlight from './components/PreFlight';
import Backup from './components/Backup';
import Restore from './components/Restore';
import Chatbot from './components/Chatbot';
import Search from './components/Search';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('preflight');

  const renderContent = () => {
    switch (activeTab) {
      case 'preflight':
        return <PreFlight />;
      case 'backup':
        return <Backup />;
      case 'restore':
        return <Restore />;
      case 'chat':
        return <Chatbot />;
      case 'search':
        return <Search />;
      default:
        return <PreFlight />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-emerald-500/30">
      {/* Top Navigation Bar */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-semibold text-white leading-tight">A16 Toolkit</h1>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">SM-A165M Root Utility</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Root Access: Granted</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <nav className="md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('preflight')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'preflight' 
                ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm' 
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab === 'preflight' ? 'text-emerald-400' : ''}`} />
            <span className="font-medium">Pre-flight Check</span>
          </button>
          
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'backup' 
                ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm' 
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <HardDrive className={`w-5 h-5 ${activeTab === 'backup' ? 'text-emerald-400' : ''}`} />
            <span className="font-medium">Full Backup</span>
          </button>
          
          <button
            onClick={() => setActiveTab('restore')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'restore' 
                ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm' 
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <RotateCcw className={`w-5 h-5 ${activeTab === 'restore' ? 'text-red-400' : ''}`} />
            <span className="font-medium">System Restore</span>
          </button>

          <div className="hidden md:block h-px bg-zinc-800 my-2"></div>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'chat' 
                ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm' 
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <MessageSquare className={`w-5 h-5 ${activeTab === 'chat' ? 'text-indigo-400' : ''}`} />
            <span className="font-medium">AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'search' 
                ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm' 
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <SearchIcon className={`w-5 h-5 ${activeTab === 'search' ? 'text-blue-400' : ''}`} />
            <span className="font-medium">Web Search</span>
          </button>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 h-full pb-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
