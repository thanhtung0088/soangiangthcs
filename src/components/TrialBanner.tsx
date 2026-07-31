import React, { useEffect, useState } from 'react';
import { TrialStore } from '../utils/localStore';
import PricingModal from './PricingModal';

const TrialBanner: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    setDaysLeft(TrialStore.getDaysLeft());
  }, []);

  if (hidden || daysLeft === null) return null;

  return (
    <>
      <div className="mx-4 mt-4 rounded-lg bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-5 py-3 flex items-center justify-between gap-3 shadow-md">
        <p className="text-white font-bold text-xs sm:text-sm flex items-center gap-2">
          <span className="text-lg">🎉</span>
          Bạn đang dùng thử MIỄN PHÍ toàn bộ tính năng trong 30 ngày
          {daysLeft > 0 ? <span className="hidden sm:inline"> - còn {daysLeft} ngày</span> : null}
          !
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowPricing(true)}
            className="bg-white text-orange-600 text-[11px] font-black uppercase px-3 py-1.5 rounded-md whitespace-nowrap"
          >
            Xem gói Pro
          </button>
          <button onClick={() => setHidden(true)} className="text-white/80 hover:text-white" title="Đóng thông báo">
            <i className="fas fa-xmark"></i>
          </button>
        </div>
      </div>
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </>
  );
};

export default TrialBanner;
