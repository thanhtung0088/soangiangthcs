import React, { useState } from 'react';
import Modal from './Modal';
import { AuthStore, MockUser } from '../utils/localStore';

const AuthModal: React.FC<{ mode: 'login' | 'register'; onClose: () => void; onSuccess: (u: MockUser) => void }> = ({
  mode,
  onClose,
  onSuccess,
}) => {
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email) return alert('Vui lòng nhập email');
    if (mode === 'register' && !hoTen) return alert('Vui lòng nhập họ tên');
    const user: MockUser = { hoTen: hoTen || email.split('@')[0], email };
    AuthStore.login(user);
    onSuccess(user);
    onClose();
  };

  return (
    <Modal title={mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'} onClose={onClose}>
      <div className="space-y-3">
        {mode === 'register' && (
          <input
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Họ và tên giáo viên..."
            className="w-full bg-white/70 border border-white/60 rounded-md px-4 py-3 text-sm font-bold"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
          className="w-full bg-white/70 border border-white/60 rounded-md px-4 py-3 text-sm font-bold"
        />
        <button onClick={handleSubmit} className="w-full bg-brand text-white font-black py-3 rounded-md uppercase text-xs tracking-widest">
          {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </button>
        <p className="text-[10px] text-slate-400 italic text-center">
          * Bản demo: tài khoản được lưu cục bộ trên trình duyệt này. Cần backend thực để dùng đa thiết bị.
        </p>
      </div>
    </Modal>
  );
};

export default AuthModal;
