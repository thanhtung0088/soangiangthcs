import React, { useState } from 'react';
import Modal from './Modal';
import { ApiKeyStore } from '../utils/localStore';

const ApiKeyModal: React.FC<{ onClose: () => void; onChanged: () => void }> = ({ onClose, onChanged }) => {
  const [key, setKey] = useState(ApiKeyStore.get() || '');
  const [showGuide, setShowGuide] = useState(false);
  const [show, setShow] = useState(false);
  const daKetNoi = !!ApiKeyStore.get();
  const laDinhDangAQ = key.trim().startsWith('AQ.');

  const handleConnect = () => {
    if (!key.trim()) return alert('Vui lòng dán API key trước khi kết nối.');
    ApiKeyStore.set(key);
    onChanged();
    onClose();
  };

  const handleDisconnect = () => {
    ApiKeyStore.clear();
    setKey('');
    onChanged();
  };

  return (
    <Modal title="Kết nối API key cá nhân" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          Để tránh bị giới hạn dùng chung, mỗi Thầy/Cô nên dùng <b>API key Gemini của riêng mình</b> (miễn phí).
          Key chỉ lưu trên trình duyệt của bạn, không gửi đi đâu khác.
        </p>

        <div className="flex items-center gap-2">
          {daKetNoi && (
            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
              <i className="fas fa-circle-check"></i> Đã kết nối
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Dán API key Gemini vào đây (VD: AIzaSy...)"
            className="w-full bg-white/70 border border-white/60 rounded-md px-4 py-3 pr-10 text-sm font-bold"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            title={show ? 'Ẩn key' : 'Hiện key'}
          >
            <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        {laDinhDangAQ && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-[11px] text-amber-700 leading-relaxed flex gap-2">
            <i className="fas fa-triangle-exclamation mt-0.5"></i>
            <span>
              Key này có định dạng mới <b>"AQ...."</b> — hiện đang bị Google từ chối trên API này (lỗi đã biết,
              chưa có bản vá). Bạn vẫn có thể thử kết nối, nhưng nếu báo lỗi 401, hãy vào aistudio.google.com/apikey
              lấy key dạng cũ <b>"AIzaSy..."</b> thay vào.
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleConnect} className="flex-1 bg-brand text-white font-black py-3 rounded-md uppercase text-xs tracking-widest">
            Kết nối
          </button>
          {daKetNoi && (
            <button onClick={handleDisconnect} className="px-4 bg-slate-100 text-slate-500 font-black rounded-md text-xs uppercase">
              Ngắt kết nối
            </button>
          )}
        </div>

        <button
          onClick={() => setShowGuide((v) => !v)}
          className="text-[11px] font-bold text-brand flex items-center gap-1"
        >
          <i className={`fas fa-chevron-${showGuide ? 'up' : 'down'} text-[9px]`}></i> Cách lấy key
        </button>

        {showGuide && (
          <div className="bg-slate-50 rounded-md p-4 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p><b>1.</b> Vào <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-brand underline">aistudio.google.com/apikey</a> (đăng nhập bằng tài khoản Google).</p>
            <p><b>2.</b> Bấm <b>Create API key</b> → chọn <b>Create API key in new project</b>.</p>
            <p><b>3.</b> Bấm nút copy cạnh key vừa tạo (dạng bắt đầu bằng "AIzaSy...").</p>
            <p><b>4.</b> Quay lại đây, dán vào ô phía trên và bấm <b>Kết nối</b>.</p>
            <p className="text-slate-400 italic">Key miễn phí, mỗi tài khoản Google có hạn mức sử dụng riêng hằng ngày.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ApiKeyModal;
