import React, { useState, useEffect } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  Database,
  ShieldCheck,
  Layers,
  Terminal
} from 'lucide-react';

export const PHPBackendCodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<
    'schema' | 'database' | 'auth' | 'ra_controller' | 'procurement_controller' | 'tax_controller'
  >('schema');

  const [sources, setSources] = useState<{ [key: string]: string }>({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/php-sources')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSources(res.data);
        }
      })
      .catch((err) => console.error('Failed to load sources', err))
      .finally(() => setLoading(false));
  }, []);

  const getSourceCode = () => {
    switch (activeFile) {
      case 'schema':
        return { filename: 'schema.sql', code: sources.schema_sql || '-- Loading schema.sql...' };
      case 'database':
        return { filename: 'config/Database.php', code: sources.database_php || '// Loading Database.php...' };
      case 'auth':
        return { filename: 'middleware/AuthMiddleware.php', code: sources.auth_middleware_php || '// Loading AuthMiddleware.php...' };
      case 'ra_controller':
        return { filename: 'controllers/RAContractorController.php', code: sources.ra_controller_php || '// Loading RAContractorController.php...' };
      case 'procurement_controller':
        return { filename: 'controllers/ProcurementController.php', code: sources.procurement_controller_php || '// Loading ProcurementController.php...' };
      case 'tax_controller':
        return { filename: 'controllers/TaxAitController.php', code: sources.tax_controller_php || '// Loading TaxAitController.php...' };
    }
  };

  const current = getSourceCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([current.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = current.filename.split('/').pop() || 'file.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Code2 className="w-4 h-4" />
            <span>Production Architecture Exporter</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">PHP REST API Backend & MySQL Database Schema</h2>
          <p className="text-xs text-slate-500 mt-1">
            Object-Oriented PHP 8.2+ PDO controllers, JWT authentication middleware, and normalized MySQL 8.0+ schema script.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-blue-900/30"
          >
            <Download className="w-4 h-4" />
            <span>Export File</span>
          </button>
        </div>
      </div>

      {/* Code File Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveFile('schema')}
          className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
            activeFile === 'schema'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>schema.sql</span>
        </button>

        <button
          onClick={() => setActiveFile('database')}
          className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
            activeFile === 'database'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>config/Database.php</span>
        </button>

        <button
          onClick={() => setActiveFile('auth')}
          className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
            activeFile === 'auth'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>middleware/AuthMiddleware.php</span>
        </button>

        <button
          onClick={() => setActiveFile('ra_controller')}
          className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
            activeFile === 'ra_controller'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>controllers/RAContractorController.php</span>
        </button>

        <button
          onClick={() => setActiveFile('procurement_controller')}
          className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
            activeFile === 'procurement_controller'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>controllers/ProcurementController.php</span>
        </button>

        <button
          onClick={() => setActiveFile('tax_controller')}
          className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
            activeFile === 'tax_controller'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>controllers/TaxAitController.php</span>
        </button>
      </div>

      {/* Code Editor Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
          <span className="font-semibold text-slate-200 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span>{current.filename}</span>
          </span>
          <span className="text-[10px] text-slate-500 uppercase">UTF-8 • Production Ready</span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto text-slate-200 leading-relaxed">
          <pre>
            <code>{current.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
