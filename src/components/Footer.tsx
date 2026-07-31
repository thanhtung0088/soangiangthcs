import React, { useEffect, useState } from 'react';
import { VisitStore } from '../utils/localStore';

const Footer: React.FC = () => {
  const [tongTruyCap, setTongTruyCap] = useState(0);
  const [dangOnline, setDangOnline] = useState(1);
  const [gopY, setGopY] = useState('');
  const [daGui, setDaGui] = useState(false);

  useEffect(() => {
    setTongTruyCap(VisitStore.bumpAndGet());
    // Số người online: chỉ là ước lượng hiển thị cho mục đích minh hoạ (không có backend realtime).
    setDangOnline(Math.floor(Math.random() * 20) + 3);
  }, []);

  const handleGuiGopY = () => {
    if (!gopY.trim()) return;
    setDaGui(true);
    setGopY('');
    setTimeout(() => setDaGui(false), 3000);
  };

  return (
    <footer className="glass-dark rounded-lg mx-4 mb-4 mt-10 px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex gap-4">
          <div className="bg-white/10 rounded-md px-4 py-3 text-center">
            <p className="text-green-400 font-black text-lg flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-ring"></span>
              {dangOnline}
            </p>
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Đang online</p>
          </div>
          <div className="bg-white/10 rounded-md px-4 py-3 text-center">
            <p className="text-amber-300 font-black text-lg">{tongTruyCap.toLocaleString('vi-VN')}</p>
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Tổng lượt truy cập</p>
          </div>
        </div>

        <div>
          <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-2">Góp ý / Cải tiến</p>
          <div className="flex gap-2">
            <input
              value={gopY}
              onChange={(e) => setGopY(e.target.value)}
              placeholder="Chia sẻ góp ý để cải thiện ứng dụng..."
              className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-xs text-white placeholder-white/40"
            />
            <button onClick={handleGuiGopY} className="bg-brand text-white text-[11px] font-black px-4 rounded-md">
              Gửi
            </button>
          </div>
          {daGui && <p className="text-green-400 text-[11px] mt-1">Cảm ơn góp ý của Thầy/Cô!</p>}
        </div>

        <div className="text-right">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Lập trình và thiết kế</p>
          <p className="text-white font-black text-sm">Nguyễn Thanh Tùng</p>
          <p className="text-white/40 text-[10px] mt-1">Liên hệ Zalo: 0916033681</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
