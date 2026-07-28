import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/Input';
import { StaffUser, initialStaffUsers } from './UserManagement';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function LoginPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Configurable Company / Brand Info loaded from Admin Site Management
  const [brandNameKo, setBrandNameKo] = useState('원데이즈뷰티');
  const [brandNameEn, setBrandNameEn] = useState('ONEDAYS BEAUTY');
  const [faviconUrl, setFaviconUrl] = useState('');

  useEffect(() => {
    const savedKo = localStorage.getItem('site_brand_name_ko');
    if (savedKo) setBrandNameKo(savedKo);

    const savedEn = localStorage.getItem('site_brand_name_en');
    if (savedEn) setBrandNameEn(savedEn);

    const savedFav = localStorage.getItem('site_favicon_url');
    if (savedFav) setFaviconUrl(savedFav);
  }, []);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const validatePasswordStrength = (pwd: string) => {
    const hasMinLength = pwd.length >= 6;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return hasMinLength && hasLetter && hasNumber && hasSpecial;
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedId = userId.trim();
    if (!trimmedId) {
      setErrorMessage('아이디를 입력해주세요.');
      return;
    }

    let staffList: StaffUser[] = initialStaffUsers;
    const savedStaff = localStorage.getItem('admin_staff_users');
    if (savedStaff) {
      try {
        staffList = JSON.parse(savedStaff);
      } catch (err) {
        staffList = initialStaffUsers;
      }
    }

    const foundUser = staffList.find((u) => u.id === trimmedId);
    if (!foundUser) {
      setErrorMessage('존재하지 않는 직원 또는 관리자 아이디입니다.');
      return;
    }

    const isPasswordChanged = localStorage.getItem(`isPasswordChanged_${foundUser.id}`) === 'true' || foundUser.isPasswordChanged;
    const storedHash = localStorage.getItem(`admin_password_hash_${foundUser.id}`) || foundUser.passwordHash;

    if (!isPasswordChanged) {
      if (password === '!admin1004' || password === 'admin1004') {
        setShowResetModal(true);
      } else {
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {
      const inputHash = await hashPassword(password);
      if (storedHash && inputHash === storedHash) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_logged_user_id', foundUser.id);
        localStorage.setItem('admin_logged_user_name', foundUser.name);
        localStorage.setItem('admin_logged_user_role', foundUser.role);
        localStorage.setItem('admin_logged_user_permissions', JSON.stringify(foundUser.permissions));
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    }
  };

  const handleForceResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!validatePasswordStrength(newPassword)) {
      setModalError('비밀번호는 6자리 이상의 영문, 숫자, 특수기호 조합이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmittingModal(true);
    try {
      const trimmedId = userId.trim() || 'siteadmin';
      const hashedPassword = await hashPassword(newPassword);

      localStorage.setItem(`admin_password_hash_${trimmedId}`, hashedPassword);
      localStorage.setItem(`isPasswordChanged_${trimmedId}`, 'true');

      const savedStaff = localStorage.getItem('admin_staff_users');
      let staffList: StaffUser[] = savedStaff ? JSON.parse(savedStaff) : initialStaffUsers;
      const foundUser = staffList.find((u) => u.id === trimmedId);

      const userPermissions = foundUser ? foundUser.permissions : {
        dashboard: true, site: true, content: true, products: true, shop: true, orders: true, customers: true, system: true
      };

      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_logged_user_id', trimmedId);
      localStorage.setItem('admin_logged_user_name', foundUser ? foundUser.name : '최고 관리자');
      localStorage.setItem('admin_logged_user_role', foundUser ? foundUser.role : 'superadmin');
      localStorage.setItem('admin_logged_user_permissions', JSON.stringify(userPermissions));

      setShowResetModal(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setModalError('비밀번호 암호화 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingModal(false);
    }
  };

  return (
    <main className="w-full min-h-screen relative flex items-center justify-center overflow-hidden bg-[#050505] text-[#FAFAFA]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D81B60]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#D6A56D]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Login Card Canvas */}
      <div className="w-full max-w-md mx-4 md:mx-auto relative z-10">
        <div className="bg-[#141414] rounded-3xl shadow-2xl border border-[#D6A56D]/30 overflow-hidden flex flex-col">
          
          {/* Card Header / Brand */}
          <div className="p-8 pb-6 flex flex-col items-center justify-center border-b border-white/10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0B0B0B] flex items-center justify-center mb-4 shadow-inner border border-white/10 overflow-hidden p-2">
              <img 
                className="w-full h-full object-contain" 
                alt={brandNameKo} 
                src={faviconUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzdKFsdPnKcTZgizNUKNAQm4C7c0rxBrNMlB3K5hpuP-ZtI39somkJYvZ44418CAGbL_oNOOYdt8XvN0xntUda3uvRiJ7ClsESuUvSTvxQunbLKo_chpYgvscwiltagl-nk3eNRXa02lkJl6B4_pZWgWYXcljNDFz49O07dhycfXCfTqEtc38vlmTd0bJKETS9M_mviIM6bAh3DgLQkcfOqeoWpGwIjzFuMVamK28DEASUmEFHTskKTA"} 
              />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-[0.2em] text-[#D6A56D] uppercase">
              {brandNameEn}
            </h1>
            <p className="text-xs font-bold text-slate-300 mt-1">{brandNameKo} 통합 관리자 콘솔 (Console CMS)</p>
          </div>

          {/* Form Body */}
          <form className="p-8 flex flex-col gap-6" onSubmit={handleLoginSubmit}>
            {errorMessage && (
              <div className="p-3 bg-[#A80F48]/20 border border-[#D81B60] rounded-xl text-xs text-[#D81B60] font-bold">
                {errorMessage}
              </div>
            )}

            {/* ID Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="userId" className="text-xs font-bold text-[#D6A56D] uppercase tracking-widest">
                ID (관리자 아이디)
              </label>
              <Input 
                id="userId"
                name="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="관리자 아이디 입력"
                icon="badge"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-bold text-[#D6A56D] uppercase tracking-widest">
                Password (비밀번호)
              </label>
              <Input 
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                icon="lock"
              />
            </div>

            {/* Actions / Options Row */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-[#1E1E1E] border-white/20 text-[#D81B60] focus:ring-[#D81B60]" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">Keep me logged in</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('초기 비밀번호는 !admin1004 이며, 미설정 시 비밀번호 강제 변경 창이 표시됩니다.'); }} className="text-xs font-bold text-[#D6A56D] hover:underline transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="mt-3 w-full py-3.5 px-6 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(216,27,96,0.4)] hover:shadow-[0_0_30px_rgba(216,27,96,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Login Console</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Footer Encryption Text */}
          <div className="bg-[#0B0B0B] px-6 py-4 border-t border-white/10 flex justify-center">
            <span className="text-[11px] font-mono font-medium text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#D6A56D]">security</span>
              SHA-256 Web Crypto Encrypted Session
            </span>
          </div>
        </div>
      </div>

      {/* Force Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#141414] rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#D6A56D]/40">
            <div className="flex items-center gap-3 mb-4 text-[#D6A56D]">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h2 className="text-xl font-serif font-bold text-white">비밀번호 변경 강제 (Force Reset)</h2>
            </div>
            
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              최초 임시 비밀번호로 로그인하셨습니다. 보안 강화를 위해 **안전한 새 비밀번호**를 설정해야 콘솔 대시보드 접근이 가능합니다.
            </p>

            <form onSubmit={handleForceResetSubmit} className="space-y-4">
              {modalError && (
                <div className="p-3 bg-[#A80F48]/20 border border-[#D81B60] rounded-xl text-xs text-[#D81B60] font-bold">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#D6A56D] mb-1">새 비밀번호</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6자리 이상 영문/숫자/특수기호 조합"
                  className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-[#D81B60] transition-colors placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D6A56D] mb-1">새 비밀번호 확인</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-[#D81B60] transition-colors placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingModal}
                  className="w-full py-3.5 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)] disabled:opacity-50"
                >
                  {isSubmittingModal ? 'SHA-256 암호화 저장 중...' : '비밀번호 변경 및 콘솔 입장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
