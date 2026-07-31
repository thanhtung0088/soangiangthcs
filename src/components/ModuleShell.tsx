import React from 'react';

export type AccentKey = 'khbd' | 'ppt' | 'outline' | 'test' | 'worksheet' | 'game' | 'video' | 'skkn';

export interface ExportButton {
  label: string;
  icon: string; // font-awesome class, vd "fa-file-word"
  onClick: () => void;
  color?: string; // tailwind bg color class
}

interface ModuleShellProps {
  title: string;
  onBack: () => void;
  formArea: React.ReactNode;
  resultArea: React.ReactNode;
  loading: boolean;
  hasResult: boolean;
  onGenerate: () => void;
  generateLabel?: string;
  exportButtons?: ExportButton[];
  accent?: AccentKey;
  icon?: string; // font-awesome class cho icon module (vd "fa-book-open")
}

// Toàn bộ tên class Tailwind được viết TƯỜNG MINH (không ghép chuỗi động) để Tailwind
// quét và sinh đúng CSS cho từng màu riêng của từng luồng soạn giảng.
const ACCENT_STYLES: Record<
  AccentKey,
  { text: string; bg: string; bgHover: string; spinnerTop: string; spinnerBg: string; badgeBg: string; glow: string; gradient: string }
> = {
  khbd: {
    text: 'text-khbd',
    bg: 'bg-khbd',
    bgHover: 'hover:bg-khbd/90',
    spinnerTop: 'border-t-khbd',
    spinnerBg: 'border-khbd/10',
    badgeBg: 'bg-khbd',
    glow: 'shadow-[0_10px_30px_-8px_rgba(2,105,164,0.55)]',
    gradient: 'from-khbd to-sky-400',
  },
  ppt: {
    text: 'text-ppt',
    bg: 'bg-ppt',
    bgHover: 'hover:bg-ppt/90',
    spinnerTop: 'border-t-ppt',
    spinnerBg: 'border-ppt/10',
    badgeBg: 'bg-ppt',
    glow: 'shadow-[0_10px_30px_-8px_rgba(249,115,22,0.55)]',
    gradient: 'from-ppt to-amber-400',
  },
  outline: {
    text: 'text-outline',
    bg: 'bg-outline',
    bgHover: 'hover:bg-outline/90',
    spinnerTop: 'border-t-outline',
    spinnerBg: 'border-outline/10',
    badgeBg: 'bg-outline',
    glow: 'shadow-[0_10px_30px_-8px_rgba(13,148,136,0.55)]',
    gradient: 'from-outline to-teal-300',
  },
  test: {
    text: 'text-test',
    bg: 'bg-test',
    bgHover: 'hover:bg-test/90',
    spinnerTop: 'border-t-test',
    spinnerBg: 'border-test/10',
    badgeBg: 'bg-test',
    glow: 'shadow-[0_10px_30px_-8px_rgba(225,29,72,0.55)]',
    gradient: 'from-test to-rose-400',
  },
  worksheet: {
    text: 'text-worksheet',
    bg: 'bg-worksheet',
    bgHover: 'hover:bg-worksheet/90',
    spinnerTop: 'border-t-worksheet',
    spinnerBg: 'border-worksheet/10',
    badgeBg: 'bg-worksheet',
    glow: 'shadow-[0_10px_30px_-8px_rgba(79,70,229,0.55)]',
    gradient: 'from-worksheet to-indigo-400',
  },
  game: {
    text: 'text-game',
    bg: 'bg-game',
    bgHover: 'hover:bg-game/90',
    spinnerTop: 'border-t-game',
    spinnerBg: 'border-game/10',
    badgeBg: 'bg-game',
    glow: 'shadow-[0_10px_30px_-8px_rgba(219,39,119,0.55)]',
    gradient: 'from-game to-pink-400',
  },
  video: {
    text: 'text-video',
    bg: 'bg-video',
    bgHover: 'hover:bg-video/90',
    spinnerTop: 'border-t-video',
    spinnerBg: 'border-video/10',
    badgeBg: 'bg-video',
    glow: 'shadow-[0_10px_30px_-8px_rgba(124,58,237,0.55)]',
    gradient: 'from-video to-purple-400',
  },
  skkn: {
    text: 'text-skkn',
    bg: 'bg-skkn',
    bgHover: 'hover:bg-skkn/90',
    spinnerTop: 'border-t-skkn',
    spinnerBg: 'border-skkn/10',
    badgeBg: 'bg-skkn',
    glow: 'shadow-[0_10px_30px_-8px_rgba(180,83,9,0.55)]',
    gradient: 'from-skkn to-amber-500',
  },
};

const ModuleShell: React.FC<ModuleShellProps> = ({
  title,
  onBack,
  formArea,
  resultArea,
  loading,
  hasResult,
  onGenerate,
  generateLabel = 'BẮT ĐẦU SOẠN THẢO',
  exportButtons = [],
  accent = 'khbd',
  icon = 'fa-pen-nib',
}) => {
  const a = ACCENT_STYLES[accent];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-sm font-bold text-white/70 hover:text-white flex items-center gap-2 uppercase tracking-widest"
        >
          <i className="fas fa-arrow-left text-[10px]"></i> QUAY LẠI
        </button>
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-md ${a.badgeBg} flex items-center justify-center ${a.glow}`}>
            <i className={`fas ${icon} text-white text-xs`}></i>
          </span>
          <h1 className="text-sm font-black text-white uppercase tracking-widest drop-shadow">{title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card rounded-lg h-fit overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${a.gradient}`}></div>
          <div className="p-8 space-y-6">
            <h2 className={`font-extrabold uppercase text-xs border-b border-slate-200/50 pb-5 ${a.text}`}>
              Tham số đầu vào
            </h2>
            <div className="space-y-4">{formArea}</div>
            <button
              onClick={onGenerate}
              disabled={loading}
              className={`w-full ${a.bg} ${a.bgHover} disabled:opacity-60 text-white font-black py-5 rounded-md ${a.glow} uppercase text-[11px] tracking-widest transition-all active:scale-[0.98]`}
            >
              {loading ? 'ĐANG KHỞI TẠO...' : generateLabel}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card rounded-lg overflow-hidden flex flex-col min-h-[700px]">
          <div className={`h-1.5 bg-gradient-to-r ${a.gradient}`}></div>
          <div className="p-12 flex flex-col flex-1">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className={`w-20 h-20 border-4 ${a.spinnerBg} ${a.spinnerTop} rounded-full animate-spin`}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                  AI đang soạn bài cho Thầy/Cô...
                </p>
              </div>
            ) : hasResult ? (
              <div className="flex flex-col h-full">
                {exportButtons.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-slate-200/50">
                    {exportButtons.map((btn) => (
                      <button
                        key={btn.label}
                        onClick={btn.onClick}
                        className={`flex items-center gap-2 px-5 py-3 rounded-md text-[11px] font-black uppercase tracking-wider text-white shadow-md transition-transform hover:-translate-y-0.5 ${
                          btn.color || 'bg-slate-700'
                        }`}
                      >
                        <i className={`fas ${btn.icon}`}></i> {btn.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex-1 overflow-y-auto pr-2">{resultArea}</div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-32">
                <i className={`fas ${icon} text-8xl mb-8 opacity-10 ${a.text}`}></i>
                <p className="text-xs font-black uppercase tracking-[0.5em] opacity-30 text-center">
                  Nội dung sẽ hiển thị tại đây
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModuleInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-white/70 border border-white/60 rounded-md px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
  />
);

export const ModuleTextarea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-white/70 border border-white/60 rounded-md px-5 py-4 text-sm font-bold min-h-[120px] focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
  />
);

export const ModuleSelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-white/70 border border-white/60 rounded-md px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/30 transition"
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

export default ModuleShell;
