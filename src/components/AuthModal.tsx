import { useState, type FormEvent } from 'react';
import * as Icons from 'lucide-react';
import { apiClient, ApiError, type PublicUser } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  message?: string;
  onClose: () => void;
  onSuccess: (user: PublicUser) => void;
}

export function AuthModal({
  isOpen,
  initialMode = 'login',
  message,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  function switchMode(newMode: 'login' | 'register') {
    setMode(newMode);
    setErrorMessage('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await apiClient.auth.login({
          email: email.trim(),
          password,
        });
        onSuccess(res.user);
        onClose();
      } else {
        if (!displayName.trim()) {
          setErrorMessage('Vui lòng nhập tên hiển thị của bạn.');
          setLoading(false);
          return;
        }
        const res = await apiClient.auth.register({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
        });
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-card relative w-full max-w-md overflow-hidden rounded-[28px] border border-[rgba(23,25,29,0.12)] p-6 shadow-2xl sm:p-7">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(23,25,29,0.05)] text-[#5E6571] transition hover:bg-[rgba(23,25,29,0.1)] hover:text-[#17191D]"
          aria-label="Đóng"
        >
          <Icons.X className="h-5 w-5" />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-purple px-2.5 py-1 text-xs">
              <Icons.ShieldCheck className="h-3.5 w-3.5" />
              Tài khoản ECONVERSE
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-[#17191D]">
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản mới'}
          </h3>
          <p className="text-xs leading-5 text-[#5E6571]">
            {message ||
              'Lưu tiến độ bài học, tích lũy XP và nâng cấp pet của bạn trên mọi thiết bị.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-[rgba(23,25,29,0.05)] p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`rounded-xl py-2 text-xs font-semibold transition ${
              mode === 'login'
                ? 'bg-white text-[#17191D] shadow-sm'
                : 'text-[#7E8692] hover:text-[#17191D]'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`rounded-xl py-2 text-xs font-semibold transition ${
              mode === 'register'
                ? 'bg-white text-[#17191D] shadow-sm'
                : 'text-[#7E8692] hover:text-[#17191D]'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs leading-5 text-red-700">
            <Icons.AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7E8692]">
                Tên hiển thị
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ví dụ: Hoàng Long, Minh Anh..."
                className="field-input text-sm"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7E8692]">
              Địa chỉ Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@email.com"
              className="field-input text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7E8692]">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              className="field-input text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="accent-button mt-2 w-full justify-center py-3 text-sm font-bold disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Icons.Loader2 className="h-4 w-4 animate-spin" />
                Đang xử lý...
              </span>
            ) : mode === 'login' ? (
              'Đăng nhập ngay'
            ) : (
              'Tạo tài khoản & Bắt đầu học'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
