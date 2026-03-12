export type Tab = 'dashboard' | 'preflight' | 'backup' | 'restore' | 'chat' | 'search';

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
