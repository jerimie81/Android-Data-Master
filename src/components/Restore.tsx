import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, AlertTriangle, Loader2, FolderArchive, Terminal } from 'lucide-react';
import { LogEntry } from '../types';

const MOCK_BACKUPS = [
  'A16_FullBackup_20260312_143000',
  'A16_FullBackup_20260310_091522',
  'A16_FullBackup_20260301_184510'
];

export default function Restore() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedBackup, setSelectedBackup] = useState(MOCK_BACKUPS[0]);
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
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

  const initiateRestore = () => {
    setShowConfirm(true);
    setConfirmText('');
  };

  const runRestore = async () => {
    if (confirmText !== 'RESTORE') return;
    
    setShowConfirm(false);
    setIsRunning(true);
    setLogs([]);

    const restoreDir = `/storage/5221-113D/Backup/SM-A165M/${selectedBackup}`;

    addLog('==========================================', 'info');
    addLog('Samsung A16 System Restore', 'info');
    addLog(`Source: ${restoreDir}`, 'info');
    addLog(`Started: ${new Date().toLocaleString()}`, 'info');
    addLog('==========================================', 'info');

    await new Promise(r => setTimeout(r, 1000));
    addLog('', 'info');
    addLog('[*] STEP 1: Critical Partitions (IMEI/Calibration)', 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Restoring efs from efs_imei.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    addLog('    [✓] efs restored', 'success');
    
    addLog('[*] Restoring sec_efs from sec_efs.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 1000));
    addLog('    [✓] sec_efs restored', 'success');
    
    addLog('[*] Restoring persist from persist_calibration.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 1200));
    addLog('    [✓] persist restored', 'success');

    addLog('', 'info');
    addLog('[*] STEP 2: Encryption Metadata (MUST be before first boot)', 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Restoring metadata from metadata.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    addLog('    [✓] metadata restored', 'success');

    addLog('', 'info');
    addLog('[*] STEP 3: Boot Chain', 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Restoring boot from boot.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 2000));
    addLog('    [✓] boot restored', 'success');
    
    addLog('[*] Restoring recovery from recovery.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 2000));
    addLog('    [✓] recovery restored', 'success');

    addLog('', 'info');
    addLog('[*] STEP 5: User Data', 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Restoring file-level backup (gzip compressed)...', 'info');
    for(let i=1; i<=3; i++) {
      await new Promise(r => setTimeout(r, 1500));
      addLog(`    Extracting data... (${i * 33}%)`, 'info');
    }
    addLog('[*] Setting correct permissions...', 'info');
    await new Promise(r => setTimeout(r, 1000));
    addLog('    [✓] File-level restore complete', 'success');

    addLog('', 'info');
    addLog('[*] STEP 6: System Configurations', 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog('    Restoring Magisk modules...', 'info');
    await new Promise(r => setTimeout(r, 500));
    addLog('    Restoring WiFi configurations...', 'info');
    await new Promise(r => setTimeout(r, 500));
    addLog('    [✓] Configurations restored', 'success');

    addLog('', 'info');
    addLog('==========================================', 'info');
    addLog('[✓] RESTORE COMPLETE', 'success');
    addLog('==========================================', 'info');
    addLog('', 'info');
    addLog('CRITICAL: Reboot immediately to prevent corruption', 'error');
    addLog('First boot may take 5-10 minutes for app optimization', 'warning');

    setIsRunning(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-4">Restore Source</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Select Backup Archive
                </label>
                <div className="relative">
                  <select 
                    value={selectedBackup}
                    onChange={(e) => setSelectedBackup(e.target.value)}
                    disabled={isRunning || showConfirm}
                    className="w-full bg-black border border-zinc-700 text-zinc-200 rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                  >
                    {MOCK_BACKUPS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <FolderArchive className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-900/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-200/80">
                    <p className="font-medium text-amber-400 mb-1">Warning</p>
                    Restoring will overwrite current partitions. Ensure you have selected the correct backup for your device model (SM-A165M).
                  </div>
                </div>
              </div>

              {!showConfirm ? (
                <button
                  onClick={initiateRestore}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Initiate Restore</span>
                </button>
              ) : (
                <div className="p-4 bg-red-950/40 border border-red-900 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm text-red-200 font-medium">Type 'RESTORE' to confirm:</p>
                  <input 
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="RESTORE"
                    className="w-full bg-black border border-red-900/50 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={runRestore}
                      disabled={confirmText !== 'RESTORE'}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col bg-black rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">/system/bin/sh restore.sh</span>
            {isRunning && <Loader2 className="w-4 h-4 text-red-500 animate-spin" />}
          </div>
          
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto relative min-h-[400px]">
            {logs.length === 0 && !isRunning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                <Terminal className="w-12 h-12 mb-2 opacity-50" />
                <p>Awaiting restore confirmation</p>
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
                    ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                  `}
                >
                  {log.message}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
