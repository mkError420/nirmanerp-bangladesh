import React, { useState } from 'react';
import {
  FolderTree,
  FileText,
  FileCode,
  Image,
  Lock,
  Download,
  Eye,
  History,
  RotateCcw,
  Upload,
  Search,
  ShieldAlert,
  ChevronRight,
  Folder
} from 'lucide-react';
import { DocumentFile, FileVersion, DepartmentCode } from '../types';

interface DocumentLibraryProps {
  documents: DocumentFile[];
  onUploadDocument?: (doc: Partial<DocumentFile>) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ documents }) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(documents[0] || null);
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [versionSuccess, setVersionSuccess] = useState<string | null>(null);

  const folders = [
    { id: 'ALL', name: 'All Documents', count: documents.length },
    { id: 'ARCHITECTURAL_DRAWINGS', name: 'Architectural Drawings', count: documents.filter(d => d.category === 'ARCHITECTURAL_DRAWINGS').length },
    { id: 'STRUCTURAL_CAD', name: 'Structural CAD (.dwg)', count: documents.filter(d => d.category === 'STRUCTURAL_CAD').length },
    { id: 'CONTRACTS_AGREEMENTS', name: 'Subcontractor Contracts', count: documents.filter(d => d.category === 'CONTRACTS_AGREEMENTS').length },
    { id: 'TEST_REPORTS', name: 'BUET Material Test Reports', count: documents.filter(d => d.category === 'TEST_REPORTS').length },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesFolder = selectedFolder === 'ALL' || doc.category === selectedFolder;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleRollback = (ver: string) => {
    setVersionSuccess(`Reverted to Version ${ver} successfully. Version audit log logged.`);
    setTimeout(() => setVersionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Module 06
              </span>
              <h1 className="text-xl font-bold text-slate-900">Document Library & File Version Control</h1>
            </div>
            <p className="text-xs text-slate-500">
              Centralized project folder tree (Project → Sub-Project → Department), multi-format CAD/PDF previews, and rollback-ready version history.
            </p>
          </div>

          <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload New Version</span>
          </button>
        </div>
      </div>

      {versionSuccess && (
        <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-lg border border-emerald-500/50 text-xs font-medium animate-fade-in flex items-center justify-between">
          <span>{versionSuccess}</span>
          <span className="text-[10px] font-mono text-emerald-300">RBAC Rollback Authorized</span>
        </div>
      )}

      {/* Main Grid: Folder Tree + Document List + Version Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Folder Hierarchy Tree */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <FolderTree className="w-3.5 h-3.5 text-slate-500" />
            <span>Project Folder Tree</span>
          </div>

          <div className="space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedFolder === f.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{f.name}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/40 text-slate-300">
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Document Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search file name, title, drawing no..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>

          {filteredDocs.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            const isCad = doc.file_extension === 'dwg';

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${
                      isCad ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isCad ? <FileCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{doc.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{doc.filename}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold font-mono">
                    {doc.current_version}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                  <span>Size: {doc.file_size} | Dept: {doc.department}</span>
                  <span>{doc.upload_date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: File Details, Previews & Version History Rollback */}
        <div className="lg:col-span-4">
          {selectedDoc && (
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden sticky top-6 space-y-4">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold tracking-wide uppercase">File Details & Versioning</h3>
                </div>
                <button
                  onClick={() => setPreviewModalOpen(true)}
                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>

              <div className="p-4 space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedDoc.title}</h3>
                  <p className="text-[11px] font-mono text-slate-500">{selectedDoc.filename}</p>
                </div>

                {/* Sensitive Download Warning */}
                {selectedDoc.is_sensitive && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Restricted document. Watermarked on download.</span>
                  </div>
                )}

                {/* Version Control History */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    <span>Revision History</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg p-2 bg-slate-50">
                    {selectedDoc.versions.map((ver, idx) => (
                      <div key={idx} className="py-2 first:pt-0 last:pb-0 space-y-1">
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-blue-900">{ver.version}</span>
                          <span className="text-[10px] text-slate-400">{ver.uploaded_at}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{ver.change_log}</p>
                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <span className="text-slate-400">By: {ver.uploaded_by}</span>
                          {ver.version !== selectedDoc.current_version && (
                            <button
                              onClick={() => handleRollback(ver.version)}
                              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" /> Rollback
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File ({selectedDoc.file_size})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Preview Modal (CAD/PDF Simulator) */}
      {previewModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-5 border border-slate-200 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedDoc.title}</h3>
                <span className="text-[10px] font-mono text-slate-500">Format: .{selectedDoc.file_extension.toUpperCase()} | Version {selectedDoc.current_version}</span>
              </div>
              <button onClick={() => setPreviewModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg">×</button>
            </div>

            {/* Preview Box */}
            <div className="bg-slate-950 text-white rounded-lg h-72 flex flex-col items-center justify-center p-6 text-center space-y-3 border border-slate-800 font-mono">
              <div className="p-3 rounded-full bg-slate-800 text-amber-400">
                {selectedDoc.file_extension === 'dwg' ? <FileCode className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Interactive Technical Blueprint Rendering</h4>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  Rendering multi-layered architectural & structural layers for {selectedDoc.filename}. Vector coordinates validated.
                </p>
              </div>
              <div className="text-[10px] text-emerald-400 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                Digital Signature Verified • Arch-Reviewer: BUET Certified Lab
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
