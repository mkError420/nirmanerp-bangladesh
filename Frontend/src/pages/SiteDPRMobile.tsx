import React, { useState } from 'react';
import {
  HardHat,
  Users,
  Camera,
  Sun,
  CloudRain,
  Cloud,
  Send,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Package
} from 'lucide-react';
import { Project, DailyProgressReport } from '../types';

interface SiteDPRMobileProps {
  project: Project;
  dprs: DailyProgressReport[];
  onSubmitDpr: (newDpr: Omit<DailyProgressReport, 'id'>) => void;
}

export const SiteDPRMobile: React.FC<SiteDPRMobileProps> = ({
  project,
  dprs,
  onSubmitDpr,
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  // Form State
  const [engineerName, setEngineerName] = useState('Engr. Kamrul Hasan (Site Engineer)');
  const [weather, setWeather] = useState('Sunny & Clear (28°C)');
  const [masonCount, setMasonCount] = useState(16);
  const [rodBinderCount, setRodBinderCount] = useState(22);
  const [carpenterCount, setCarpenterCount] = useState(10);
  const [electricianCount, setElectricianCount] = useState(4);
  const [helperCount, setHelperCount] = useState(30);

  const [executionSummary, setExecutionSummary] = useState(
    'Casting 10th Floor Column C1-C8 with 1:1.5:3 concrete mix. Rebar binding for Beam B10 completed.'
  );
  const [storeIssuesSummary, setStoreIssuesSummary] = useState(
    'Issued 12 Ton Steel Rebar (16mm) and 220 Bags PCC Cement from Site Store.'
  );

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80'
  ]);

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handlePhotoAdd = () => {
    // Simulate photo capture/upload
    const placeholderPhotos = [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'
    ];
    const randomPhoto = placeholderPhotos[Math.floor(Math.random() * placeholderPhotos.length)];
    setUploadedPhotos([...uploadedPhotos, randomPhoto]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmitDpr({
      project_id: project.id,
      project_name: project.project_name,
      dpr_date: new Date().toISOString().split('T')[0],
      weather_condition: weather,
      site_engineer_name: engineerName,
      mason_count: masonCount,
      rod_binder_count: rodBinderCount,
      carpenter_count: carpenterCount,
      electrician_count: electricianCount,
      helper_count: helperCount,
      execution_summary: executionSummary,
      store_issues_summary: storeIssuesSummary,
      site_photo_urls: uploadedPhotos,
      status: 'Submitted'
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('history');
    }, 1500);
  };

  const totalLabor = masonCount + rodBinderCount + carpenterCount + electricianCount + helperCount;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <HardHat className="w-4 h-4" />
            <span>Mobile Site Operations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Daily Progress Report (DPR)</h2>
          <p className="text-xs text-slate-500 mt-1">Site Engineer Mobile Entry Form for {project.project_name}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'new' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log Today's DPR
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DPR History ({dprs.length})
          </button>
        </div>
      </div>

      {activeTab === 'new' ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5 text-xs">
          {submittedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>DPR Submitted Successfully! Redirecting to history...</span>
            </div>
          )}

          {/* Engineer & Weather Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Site Engineer Name *</label>
              <input
                type="text"
                required
                value={engineerName}
                onChange={(e) => setEngineerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Site Weather Condition</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
              >
                <option value="Sunny & Clear (28°C)">Sunny & Clear (28°C)</option>
                <option value="Overcast / Cloudy">Overcast / Cloudy</option>
                <option value="Heavy Rain / Site Halted">Heavy Rain / Site Halted</option>
              </select>
            </div>
          </div>

          {/* Labor Headcount Breakdown */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900 text-xs">Labor Headcount Breakdown</span>
              </div>
              <span className="font-bold text-blue-700 text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                Total: {totalLabor} Workers
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[10px] text-slate-500 font-semibold mb-1">Masons</label>
                <input
                  type="number"
                  min="0"
                  value={masonCount}
                  onChange={(e) => setMasonCount(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded p-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[10px] text-slate-500 font-semibold mb-1">Rod Binders</label>
                <input
                  type="number"
                  min="0"
                  value={rodBinderCount}
                  onChange={(e) => setRodBinderCount(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded p-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[10px] text-slate-500 font-semibold mb-1">Carpenters</label>
                <input
                  type="number"
                  min="0"
                  value={carpenterCount}
                  onChange={(e) => setCarpenterCount(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded p-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[10px] text-slate-500 font-semibold mb-1">Electricians</label>
                <input
                  type="number"
                  min="0"
                  value={electricianCount}
                  onChange={(e) => setElectricianCount(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded p-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-slate-500 font-semibold mb-1">Helpers</label>
                <input
                  type="number"
                  min="0"
                  value={helperCount}
                  onChange={(e) => setHelperCount(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded p-1"
                />
              </div>
            </div>
          </div>

          {/* Execution Log */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Today's BOQ Execution Work Log *</label>
            <textarea
              required
              rows={3}
              value={executionSummary}
              onChange={(e) => setExecutionSummary(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800"
              placeholder="Describe column casting, shuttering, plastering, or masonry work done today..."
            />
          </div>

          {/* Site Store Issue Summary */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Material Store Issues & Consumption</label>
            <textarea
              rows={2}
              value={storeIssuesSummary}
              onChange={(e) => setStoreIssuesSummary(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800"
              placeholder="Specify rebar tons, cement bags, sand CFT issued from site store today..."
            />
          </div>

          {/* Photo Upload Simulator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-700">Site Progress Photo Uploads</label>
              <button
                type="button"
                onClick={handlePhotoAdd}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Capture Site Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {uploadedPhotos.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={url} alt={`Site photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    Photo #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Site DPR to Head Office</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {dprs.map((dpr) => (
            <div key={dpr.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-lg bg-blue-50 text-blue-600 font-bold">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">DPR Date: {dpr.dpr_date}</h4>
                    <p className="text-[11px] text-slate-500">{dpr.site_engineer_name} • {dpr.weather_condition}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {dpr.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <p className="font-semibold text-slate-900">Execution Summary:</p>
                <p className="text-slate-700">{dpr.execution_summary}</p>
                <p className="font-semibold text-slate-900 pt-1">Store Issues:</p>
                <p className="text-slate-700">{dpr.store_issues_summary}</p>
              </div>

              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                <span>
                  Labor Headcount: <strong>{dpr.mason_count} Masons, {dpr.rod_binder_count} Rod Binders, {dpr.helper_count} Helpers</strong>
                </span>
                <span>{dpr.site_photo_urls.length} Site Photos Attached</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
