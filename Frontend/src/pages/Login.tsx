import React, { useState } from 'react';
import { Lock, User, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setUsername('rabbani');
    setPassword('sup123456123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication verification
    await new Promise(resolve => setTimeout(resolve, 400));

    if (username === 'rabbani' && password === 'sup123456123') {
      onLogin(username, password);
    } else {
      setError('Invalid username or password. Use demo credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-xl shadow-blue-500/20 ring-1 ring-white/20 mb-2">
            <span className="text-white font-extrabold text-2xl">N</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NirmanERP Bangladesh</h1>
          <p className="text-xs text-slate-400">Enterprise Civil Engineering & Construction Cloud Suite</p>
        </div>

        {/* Login Glass Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">System Access Portal</h2>
              <p className="text-xs text-slate-400">Sign in to your active role account</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 font-mono text-[10px] font-semibold border border-blue-800">
              v4.2 PRO
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="e.g. rabbani"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="bg-rose-950/50 border border-rose-800/80 rounded-xl p-3 text-rose-300 text-xs flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition duration-150 shadow-lg shadow-blue-600/25 disabled:opacity-50 flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating Role...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workstation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Fill Demo Credentials (Admin / MD)</span>
            </button>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="text-center space-y-1 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted RBAC • NBR & Bangladesh Bank BEFTN Compliant</span>
          </div>
          <p className="text-[11px] text-slate-600">&copy; {new Date().getFullYear()} NirmanERP Bangladesh. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
