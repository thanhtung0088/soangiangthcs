import React, { useState } from 'react';
import Modal from './Modal';
import { LicenseStore, AuthStore } from '../utils/localStore';

const GOI = [
  {
    key: 'thang',
    ten: 'Gói Tháng',
    gia: '99.000đ',
    chuKy: '/ tháng',
    diem: ['Không giới hạn số bài soạn/tháng', 'Xuất Word/PPT/PDF không giới hạn', 'Hỗ trợ qua Zalo trong giờ hành chính'],
  },
  {
    key: 'nam',
    ten: 'Gói Năm học',
    gia: '699.000đ',
    chuKy: '/ năm học',
    diem: ['Toàn bộ quyền lợi Gói Tháng', 'Tiết kiệm hơn 40% so với mua theo tháng', 'Ưu tiên hỗ trợ, cập nhật tính năng mới sớm'],
    noiBat: true,
  },
  {
    key: 'truong',
    ten: 'Gói Trường học',
    gia: 'Liên hệ',
    chuKy: '',
    diem: ['Cấp phát license cho nhiều giáo viên', 'Tuỳ biến theo đặc thù đơn vị', 'Hỗ trợ triển khai và tập huấn riêng'],
  },
];

const PricingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [goiChon, setGoiChon] = useState<string | null>(null);
  const [license, setLicense] = useState<string | null>(null);

  const handleTaoMa = () => {
    const user = AuthStore.getUser();
    const code = LicenseStore.generate(user?.hoTen || 'GV');
    setLicense(code);
  };

  return (
    <Modal title="Nâng cấp tài khoản Pro" onClose={onClose} wide>
      {!goiChon ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOI.map((g) => (
            <div
              key={g.key}
              className={`rounded-lg p-5 border-2 flex flex-col ${
                g.noiBat ? 'border-orange-400 bg-orange-50/70' : 'border-slate-100 bg-white/60'
              }`}
            >
              {g.noiBat && <p className="text-[10px] font-black text-orange-500 uppercase mb-1">Được chọn nhiều nhất</p>}
              <p className="font-black text-slate-800 uppercase text-sm mb-1">{g.ten}</p>
              <p className="text-2xl font-black text-brand mb-1">
                {g.gia} <span className="text-xs text-slate-400 font-medium">{g.chuKy}</span>
              </p>
              <ul className="text-xs text-slate-500 space-y-1 mb-4 flex-1">
                {g.diem.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <i className="fas fa-check text-green-500 mt-0.5"></i> {d}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setGoiChon(g.key)}
                className="w-full bg-brand text-white font-black py-3 rounded-md uppercase text-[11px] tracking-widest"
              >
                Chọn gói này
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setGoiChon(null)} className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <i className="fas fa-arrow-left text-[10px]"></i> Chọn gói khác
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="font-black text-sm uppercase text-slate-700 mb-2">Thông tin chuyển khoản</p>
              <div className="bg-white/70 rounded-md p-4 text-sm space-y-1">
                <p><b>Chủ tài khoản:</b> Nguyễn Thanh Tùng</p>
                <p><b>Số điện thoại:</b> 0916033681</p>
                <p><b>Số tài khoản:</b> 916033681</p>
                <p><b>Ngân hàng:</b> Đông Á (Vikki Digital Bank)</p>
                <p className="text-slate-400 italic text-xs mt-2">Nội dung chuyển khoản: Họ tên - Gói đăng ký (VD: "Nguyen Van A - Goi Nam")</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-black text-sm uppercase text-slate-700 mb-2">Quét mã Zalo / QR</p>
              <img src="/assets/zalo-qr-thanhtung.png" alt="QR liên hệ Zalo Nguyễn Thanh Tùng" className="rounded-lg w-40 h-auto shadow-md" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            {!license ? (
              <button onClick={handleTaoMa} className="w-full bg-orange-500 text-white font-black py-3 rounded-md uppercase text-xs tracking-widest">
                Tạo mã kích hoạt (License) sau khi đã chuyển khoản
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <p className="text-[11px] text-slate-500 mb-1">Mã license của bạn</p>
                <p className="font-black text-lg text-green-700 tracking-widest">{license}</p>
                <p className="text-[10px] text-slate-400 mt-2">
                  Gửi mã này kèm ảnh chụp chuyển khoản qua Zalo 0916033681 để được kích hoạt chính thức.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PricingModal;
