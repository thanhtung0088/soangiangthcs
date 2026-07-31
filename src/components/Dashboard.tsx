import React from 'react';
import { ModuleKey } from '../types';
import { AccentKey } from './ModuleShell';

const MODULES: { key: ModuleKey; label: string; desc: string; icon: string; accent: AccentKey }[] = [
  { key: 'khbd5512', label: 'KHBD - CV 5512', desc: 'Soạn kế hoạch bài dạy đầy đủ 4 hoạt động', icon: 'fa-book-open', accent: 'khbd' },
  { key: 'slideppt', label: 'Bài giảng PPT', desc: 'Slide + ảnh minh hoạ AI + liên kết Canva', icon: 'fa-display', accent: 'ppt' },
  { key: 'outline', label: 'Đề cương ôn tập', desc: 'Hệ thống kiến thức + câu hỏi ôn luyện', icon: 'fa-list-check', accent: 'outline' },
  { key: 'test7991', label: 'Đề kiểm tra - CV 7991', desc: 'Ma trận, bản đặc tả, đề bài, đáp án', icon: 'fa-file-circle-check', accent: 'test' },
  { key: 'worksheet', label: 'Phiếu học tập', desc: 'Nhiệm vụ học tập trên lớp/tự học', icon: 'fa-file-lines', accent: 'worksheet' },
  { key: 'game', label: 'Trò chơi tương tác', desc: 'Bộ câu hỏi củng cố kiến thức sinh động', icon: 'fa-gamepad', accent: 'game' },
  { key: 'video', label: 'Kịch bản video minh hoạ', desc: 'Storyboard cho Canva Video/CapCut', icon: 'fa-clapperboard', accent: 'video' },
  { key: 'skkn', label: 'Sáng kiến kinh nghiệm', desc: 'Báo cáo SKKN đúng thể thức', icon: 'fa-award', accent: 'skkn' },
];

// Class Tailwind viết tường minh theo từng accent để được quét đúng khi build.
const ICON_WRAP: Record<AccentKey, string> = {
  khbd: 'bg-khbd/10 group-hover:bg-khbd',
  ppt: 'bg-ppt/10 group-hover:bg-ppt',
  outline: 'bg-outline/10 group-hover:bg-outline',
  test: 'bg-test/10 group-hover:bg-test',
  worksheet: 'bg-worksheet/10 group-hover:bg-worksheet',
  game: 'bg-game/10 group-hover:bg-game',
  video: 'bg-video/10 group-hover:bg-video',
  skkn: 'bg-skkn/10 group-hover:bg-skkn',
};
const ICON_COLOR: Record<AccentKey, string> = {
  khbd: 'text-khbd',
  ppt: 'text-ppt',
  outline: 'text-outline',
  test: 'text-test',
  worksheet: 'text-worksheet',
  game: 'text-game',
  video: 'text-video',
  skkn: 'text-skkn',
};
const TOP_BAR: Record<AccentKey, string> = {
  khbd: 'from-khbd to-sky-400',
  ppt: 'from-ppt to-amber-400',
  outline: 'from-outline to-teal-300',
  test: 'from-test to-rose-400',
  worksheet: 'from-worksheet to-indigo-400',
  game: 'from-game to-pink-400',
  video: 'from-video to-purple-400',
  skkn: 'from-skkn to-amber-500',
};

const Dashboard: React.FC<{ onSelect: (m: ModuleKey) => void }> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-amber-300 font-black text-xs uppercase tracking-[0.4em] mb-3">Trợ lý soạn giảng</p>
        <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">SOẠN GIẢNG AI CHUYÊN NGHIỆP</h1>
        <p className="text-white/70 mt-3 font-medium">Dành cho giáo viên THCS - 8 luồng soạn thảo, xuất Word/PPT/PDF đúng chuẩn</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {MODULES.map((m) => (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            className="glass-card rounded-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all text-left group"
          >
            <div className={`h-1.5 bg-gradient-to-r ${TOP_BAR[m.accent]}`}></div>
            <div className="p-7">
              <div className={`w-14 h-14 rounded-md flex items-center justify-center mb-5 transition-all ${ICON_WRAP[m.accent]}`}>
                <i className={`fas ${m.icon} ${ICON_COLOR[m.accent]} group-hover:text-white text-xl transition-all`}></i>
              </div>
              <p className="font-black text-slate-800 text-sm uppercase tracking-wide mb-1">{m.label}</p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
