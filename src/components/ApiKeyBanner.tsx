import React, { useEffect, useState } from 'react';
import { ApiKeyStore } from '../utils/localStore';
import ApiKeyModal from './ApiKeyModal';

const ApiKeyBanner: React.FC = () => {
  const [connected, setConnected] = useState(true); // mặc định true để tránh nháy banner lúc chưa kịp đọc localStorage
  const [showModal, setShowModal] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setConnected(!!ApiKeyStore.get());
  }, []);

  if (connected || hidden) return null;

  return (
    <>
      <div className="mx-4 mt-3 rounded-lg bg-blue-50/90 border border-blue-200 px-5 py-3 flex items-center justify-between gap-3">
        <p className="text-blue-700 text-xs sm:text-sm font-bold flex items-center gap-2">
          <i className="fas fa-key"></i>
          Bạn chưa kết nối API key cá nhân — hãy dán API key Gemini miễn phí của bạn để soạn bài không giới hạn.
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-md whitespace-nowrap"
          >
            Kết nối ngay
          </button>
          <button onClick={() => setHidden(true)} className="text-blue-400 hover:text-blue-600" title="Đóng">
            <i className="fas fa-xmark"></i>
          </button>
        </div>
      </div>
      {showModal && (
        <ApiKeyModal onClose={() => setShowModal(false)} onChanged={() => setConnected(!!ApiKeyStore.get())} />
      )}
    </>
  );
};

export default ApiKeyBanner;
