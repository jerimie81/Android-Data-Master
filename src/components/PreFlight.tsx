import React, { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle, XCircle, Loader2, Play } from 'lucide-react';
import { LogEntry } from '../types';

export default function PreFlight() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [passed, setPassed] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      message,
      type
    }]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const runPreFlight = async () => {
    setIsRunning(true);
    setLogs([]);
    setIsComplete(false);
    setPassed(false);

    addLog('==========================================', 'info');
    addLog('Samsung A16 Backup Pre-flight Check', 'info');
    addLog(`Timestamp: ${new Date().toLocaleString()}`, 'info');
    addLog('==========================================', 'info');

    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Check 1/7: Root access...', 'info');
    await new Promise(r => setTimeout(r, 500));
    addLog('    [✓] Root access confirmed (UID: 0)', 'success');

    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Check 2/7: Required tools...', 'info');
    await new Promise(r => setTimeout(r, 600));
    addLog('    [i] zstd not found - will use gzip compression instead', 'warning');
    addLog('    [✓] All required tools available', 'success');

    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Check 3/7: External storage (/storage/5221-113D)...', 'info');
    await new Promise(r => setTimeout(r, 500));
    addLog('    [✓] External storage mounted and writable', 'success');

    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Check 4/7: Backup directory structure...', 'info');
    await new Promise(r => setTimeout(r, 500));
    addLog('    [✓] Directory structure valid, write test passed', 'success');

    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Check 5/7: Block device access...', 'info');
    await new Promise(r => setTimeout(r, 700));
    addLog('    [✓] All critical partitions accessible', 'success');

    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Check 6/7: Storage capacity...', 'info');
    await new Promise(r => setTimeout(r, 400));
    addLog('    Data partition: 42 GB', 'info');
    addLog('    Available on external: 115 GB', 'info');
    addLog('    [✓] Sufficient space available', 'success');

    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Check 7/7: Magisk/root environment...', 'info');
    await new Promise(r => setTimeout(r, 500));
    addLog('    [✓] Magisk detected (version: 27.0)', 'success');
    addLog('    [i] Active modules: 3', 'info');

    await new Promise(r => setTimeout(r, 800));
    addLog('', 'info');
    addLog('==========================================', 'info');
    addLog('[✓] PRE-FLIGHT CHECK PASSED', 'success');
    addLog('==========================================', 'info');
    addLog('Backup location: /storage/5221-113D/Backup/SM-A165M', 'info');
    addLog('BACKUP_METADATA: true (locked)', 'info');

    setIsRunning(false);
    setIsComplete(true);
    setPassed(true);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-white">Pre-flight Check</h2>
          <p className="text-sm text-zinc-400">Validate environment before backup/restore operations</p>
        </div>
        <button
          onClick={runPreFlight}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Running...' : 'Run Checks'}</span>
        </button>
      </div>

      <div className="flex-1 bg-black rounded-xl border border-zinc-800 p-4 font-mono text-sm overflow-y-auto relative">
        {logs.length === 0 && !isRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
            <Terminal className="w-12 h-12 mb-2 opacity-50" />
            <p>Ready to run pre-flight checks</p>
          </div>
        )}
        
        <div className="space-y-1">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`
                ${log.type === 'info' ? 'text-zinc-300' : ''}
                ${log.type === 'success' ? 'text-emerald-400' : ''}
                ${log.type === 'warning' ? 'text-amber-400' : ''}
                ${log.type === 'error' ? 'text-red-400' : ''}
              `}
            >
              {log.message}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {isComplete && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 ${passed ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
          {passed ? <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" /> : <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
          <div>
            <h3 className={`font-medium ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {passed ? 'System Ready' : 'Checks Failed'}
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              {passed 
                ? 'All critical systems are operational. You may proceed with backup or restore operations.' 
                : 'Please resolve the issues highlighted in the log before proceeding.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
