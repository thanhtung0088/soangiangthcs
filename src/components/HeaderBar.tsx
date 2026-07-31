import React, { useRef, useState, useEffect } from 'react';
import { AvatarStore, AuthStore, MockUser, ApiKeyStore } from '../utils/localStore';
import AuthModal from './AuthModal';
import PricingModal from './PricingModal';
import ApiKeyModal from './ApiKeyModal';

const NGAY_THANG = () =>
  new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

const HeaderBar: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [user, setUser] = useState<MockUser | null>(null);
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [daKetNoiApi, setDaKetNoiApi] = useState(false);

  useEffect(() => {
    setAvatar(AvatarStore.get());
    setUser(AuthStore.getUser());
    setDaKetNoiApi(!!ApiKeyStore.get());
  }, []);

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      AvatarStore.set(dataUrl);
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    AuthStore.logout();
    setUser(null);
  };

  return (
    <>
      <header className="glass-dark rounded-lg mx-4 mt-4 px-5 py-4 flex items-center justify-between gap-4 sticky top-4 z-40">
        {/* Avatar bên trái */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60 flex items-center justify-center bg-white/20 flex-shrink-0"
            title="Tải ảnh đại diện từ máy"
          >
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-user text-white/70"></i>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          <div className="hidden sm:block">
            <p className="text-white font-black text-xs uppercase tracking-wide">{user ? user.hoTen : 'Khách'}</p>
            <p className="text-white/50 text-[10px]">{NGAY_THANG()}</p>
          </div>
        </div>

        {/* Giữa header */}
        <div className="flex-1 text-center hidden md:block">
          <p className="font-black text-4xl bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            CHÀO MỪNG ĐÃ TRỞ LẠI !
          </p>
        </div>

        {/* Bên phải */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => setShowApiKey(true)}
            className={`text-[11px] font-black uppercase px-4 py-2.5 rounded-md shadow-md whitespace-nowrap flex items-center gap-1.5 ${
              daKetNoiApi ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
            }`}
          >
            <i className={`fas ${daKetNoiApi ? 'fa-circle-check' : 'fa-key'}`}></i>
            {daKetNoiApi ? 'Đã kết nối API' : 'Kết nối API'}
          </button>
          <button
            onClick={() => setShowPricing(true)}
            className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-[11px] font-black uppercase px-4 py-2.5 rounded-md shadow-md whitespace-nowrap"
          >
            <i className="fas fa-crown mr-1"></i> Nâng cấp Pro
          </button>
          {user ? (
            <button onClick={handleLogout} className="bg-white/20 text-white text-[11px] font-black uppercase px-4 py-2.5 rounded-md whitespace-nowrap">
              Đăng xuất
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowAuth('login')}
                className="bg-white/20 text-white text-[11px] font-black uppercase px-4 py-2.5 rounded-md whitespace-nowrap"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setShowAuth('register')}
                className="bg-white text-brand text-[11px] font-black uppercase px-4 py-2.5 rounded-md whitespace-nowrap"
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </header>

      {showAuth && (
        <AuthModal mode={showAuth} onClose={() => setShowAuth(null)} onSuccess={(u) => setUser(u)} />
      )}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
      {showApiKey && (
        <ApiKeyModal onClose={() => setShowApiKey(false)} onChanged={() => setDaKetNoiApi(!!ApiKeyStore.get())} />
      )}
    </>
  );
};

export default HeaderBar;
