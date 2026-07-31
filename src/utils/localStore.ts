// Lưu ý: đây là lớp lưu trữ phía client (localStorage), phù hợp cho bản demo/nội bộ.
// Khi triển khai chính thức cho nhiều người dùng, nên thay bằng backend thực (Firebase Auth,
// Firestore...) để đăng ký/đăng nhập, xác thực license và đếm lượt truy cập chính xác, dùng chung
// giữa nhiều thiết bị thay vì chỉ lưu trên trình duyệt hiện tại.

const KEY_AVATAR = 'sgai_avatar';
const KEY_USER = 'sgai_user';
const KEY_LICENSE = 'sgai_license';
const KEY_TOTAL_VISITS = 'sgai_total_visits';

export interface MockUser {
  hoTen: string;
  email: string;
}

const KEY_TRIAL_START = 'sgai_trial_start';

/** Theo dõi ngày dùng thử miễn phí (chỉ mang tính thông báo, KHÔNG chặn tính năng khi hết hạn). */
const KEY_USER_API_KEY = 'sgai_user_api_key';

/** Cho phép mỗi người dùng dán API key Gemini CỦA RIÊNG HỌ, lưu trên trình duyệt của họ.
 * Ưu tiên dùng key này nếu có; nếu chưa dán, ứng dụng sẽ dùng key mặc định của hệ thống (nếu có cấu hình). */
export const ApiKeyStore = {
  get: (): string | null => localStorage.getItem(KEY_USER_API_KEY),
  set: (key: string) => localStorage.setItem(KEY_USER_API_KEY, key.trim()),
  clear: () => localStorage.removeItem(KEY_USER_API_KEY),
};

export const TrialStore = {
  getDaysLeft: (): number => {
    let start = localStorage.getItem(KEY_TRIAL_START);
    if (!start) {
      start = String(Date.now());
      localStorage.setItem(KEY_TRIAL_START, start);
    }
    const daDaTrai = Math.floor((Date.now() - Number(start)) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daDaTrai);
  },
};

export const AvatarStore = {
  get: (): string | null => localStorage.getItem(KEY_AVATAR),
  set: (dataUrl: string) => localStorage.setItem(KEY_AVATAR, dataUrl),
};

export const AuthStore = {
  getUser: (): MockUser | null => {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : null;
  },
  login: (user: MockUser) => localStorage.setItem(KEY_USER, JSON.stringify(user)),
  logout: () => localStorage.removeItem(KEY_USER),
};

export const LicenseStore = {
  get: (): string | null => localStorage.getItem(KEY_LICENSE),
  generate: (hoTen: string): string => {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const initials = (hoTen || 'GV').replace(/[^a-zA-ZÀ-ỹ]/g, '').slice(0, 2).toUpperCase() || 'GV';
    const code = `SGAI-${initials}-${ts}-${rand}`;
    localStorage.setItem(KEY_LICENSE, code);
    return code;
  },
};

/** Đếm tổng lượt truy cập (tăng 1 mỗi khi tải lại trang trên trình duyệt này). */
export const VisitStore = {
  bumpAndGet: (): number => {
    const current = Number(localStorage.getItem(KEY_TOTAL_VISITS) || '0');
    const next = current + 1;
    localStorage.setItem(KEY_TOTAL_VISITS, String(next));
    return next;
  },
};
