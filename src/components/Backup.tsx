import React, { useState, useRef, useEffect } from 'react';
import { Database, HardDrive, FileText, Settings, Play, Loader2, CheckCircle } from 'lucide-react';
import { LogEntry } from '../types';

export default function Backup() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState({
    metadata: true,
    super: false,
    userdataBlock: false,
    userdataFile: true,
    misc: true
  });

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

  const runBackup = async () => {
    setIsRunning(true);
    setLogs([]);
    setProgress(0);

    const date = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 15);
    const backupDir = `/storage/5221-113D/Backup/SM-A165M/A16_FullBackup_${date}`;

    addLog('==========================================', 'info');
    addLog('Samsung A16 Full System Backup', 'info');
    addLog('Model: SM-A165M', 'info');
    addLog(`Destination: ${backupDir}`, 'info');
    addLog('Compression: gzip', 'info');
    addLog(`Started: ${new Date().toLocaleString()}`, 'info');
    addLog('==========================================', 'info');

    await new Promise(r => setTimeout(r, 1000));
    addLog('[*] Checking available space on external storage...', 'info');
    addLog('    Data partition size: 42 GB', 'info');
    addLog('    Available space: 115 GB', 'info');
    setProgress(5);

    await new Promise(r => setTimeout(r, 1000));
    addLog('[*] Saving partition table...', 'info');
    setProgress(10);

    // Phase 1
    addLog('', 'info');
    addLog('[*] PHASE 1: Critical Device-Specific Partitions', 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Backing up efs -> efs_imei.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    addLog('    [✓] efs completed (12M)', 'success');
    
    addLog('[*] Backing up sec_efs -> sec_efs.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 1000));
    addLog('    [✓] sec_efs completed (4M)', 'success');
    
    addLog('[*] Backing up persist -> persist_calibration.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 1200));
    addLog('    [✓] persist completed (32M)', 'success');
    setProgress(25);

    // Phase 2
    addLog('', 'info');
    addLog('[*] PHASE 2: Boot Chain', 'warning');
    await new Promise(r => setTimeout(r, 800));
    addLog('[*] Backing up boot -> boot.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 2000));
    addLog('    [✓] boot completed (64M)', 'success');
    
    addLog('[*] Backing up recovery -> recovery.img.gz...', 'info');
    await new Promise(r => setTimeout(r, 2000));
    addLog('    [✓] recovery completed (64M)', 'success');
    setProgress(40);

    // Phase 3
    if (config.metadata) {
      addLog('', 'info');
      addLog('[*] PHASE 3: Encryption Metadata (ESSENTIAL)', 'warning');
      await new Promise(r => setTimeout(r, 800));
      addLog('[*] Backing up metadata -> metadata.img.gz...', 'info');
      await new Promise(r => setTimeout(r, 1500));
      addLog('    [✓] metadata completed (16M)', 'success');
      setProgress(50);
    }

    // Phase 4
    if (config.super) {
      addLog('', 'info');
      addLog('[*] PHASE 4: Super Partition (8GB+)', 'warning');
      await new Promise(r => setTimeout(r, 800));
      addLog('[*] Backing up super -> super_dynamic.img.gz...', 'info');
      for(let i=1; i<=5; i++) {
        await new Promise(r => setTimeout(r, 1000));
        addLog(`    Progress: ${i * 20}%...`, 'info');
      }
      addLog('    [✓] super completed (3.2G)', 'success');
    }
    setProgress(65);

    // Phase 6
    if (config.userdataFile) {
      addLog('', 'info');
      addLog('[*] PHASE 6: File-Level User Data', 'warning');
      await new Promise(r => setTimeout(r, 800));
      addLog('[*] Starting file-level backup of /data...', 'info');
      for(let i=1; i<=4; i++) {
        await new Promise(r => setTimeout(r, 1500));
        addLog(`    Compressing data... (${i * 10}GB processed)`, 'info');
      }
      addLog('    [✓] File-level backup complete (18G)', 'success');
    }
    setProgress(85);

    // Phase 7
    if (config.misc) {
      addLog('', 'info');
      addLog('[*] PHASE 7: System Configurations', 'warning');
      await new Promise(r => setTimeout(r, 800));
      addLog('[*] Backing up Magisk configuration...', 'info');
      await new Promise(r => setTimeout(r, 500));
      addLog('    [✓] Magisk backup complete', 'success');
      
      addLog('[*] Backing up WiFi/Bluetooth configurations...', 'info');
      await new Promise(r => setTimeout(r, 500));
      addLog('    [✓] WiFi/Bluetooth configs backed up', 'success');
    }
    setProgress(95);

    await new Promise(r => setTimeout(r, 1000));
    addLog('', 'info');
    addLog('[*] Creating checksums...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    setProgress(100);

    addLog('', 'info');
    addLog('==========================================', 'info');
    addLog('[✓] BACKUP COMPLETE', 'success');
    addLog(`Location: ${backupDir}`, 'info');
    addLog('==========================================', 'info');

    setIsRunning(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-4">Backup Configuration</h2>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-3 rounded-lg bg-black/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700 transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.metadata}
                  onChange={e => setConfig({...config, metadata: e.target.checked})}
                  disabled={isRunning}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                />
                <div>
                  <div className="font-medium text-zinc-200">Metadata & EFS</div>
                  <div className="text-xs text-zinc-500">Critical for FBE encryption and IMEI. Highly recommended.</div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-lg bg-black/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700 transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.super}
                  onChange={e => setConfig({...config, super: e.target.checked})}
                  disabled={isRunning}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                />
                <div>
                  <div className="font-medium text-zinc-200">Super Partition</div>
                  <div className="text-xs text-zinc-500">System, Vendor, Product. Very large (8GB+).</div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-lg bg-black/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700 transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.userdataFile}
                  onChange={e => setConfig({...config, userdataFile: e.target.checked})}
                  disabled={isRunning}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                />
                <div>
                  <div className="font-medium text-zinc-200">File-Level Userdata</div>
                  <div className="text-xs text-zinc-500">Apps and app data via tar. Recommended over block backup.</div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-lg bg-black/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700 transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.misc}
                  onChange={e => setConfig({...config, misc: e.target.checked})}
                  disabled={isRunning}
                  className="mt-1 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                />
                <div>
                  <div className="font-medium text-zinc-200">System Configs</div>
                  <div className="text-xs text-zinc-500">Magisk modules, WiFi/BT pairings, Accounts.</div>
                </div>
              </label>
            </div>

            <button
              onClick={runBackup}
              disabled={isRunning}
              className="w-full mt-6 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
              <span>{isRunning ? 'Backup in Progress...' : 'Start Full Backup'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col bg-black rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">/system/bin/sh full-backup.sh</span>
            {isRunning && (
              <div className="flex items-center space-x-2 w-1/3">
                <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400">{progress}%</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto relative min-h-[400px]">
            {logs.length === 0 && !isRunning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                <HardDrive className="w-12 h-12 mb-2 opacity-50" />
                <p>Configure options and start backup</p>
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
        </div>
      </div>
    </div>
  );
}
