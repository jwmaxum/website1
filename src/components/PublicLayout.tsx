import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageCode, supportedLanguages, translations } from '../i18n';
import { LegalTermsModal } from './LegalTermsModal';
import { CartModal } from './CartModal';
import { AnatoliaFooterConfig, defaultAnatoliaFooterConfig } from '../types/BrandTypes';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [showShoppingMall, setShowShoppingMall] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('ko');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'businessInfo' | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Customer Member Auth State
  const [customerUser, setCustomerUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register_terms' | 'register_form'>('login');
  
  // Login Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Inputs & Terms
  const [regTermsAll, setRegTermsAll] = useState(false);
  const [regTermService, setRegTermService] = useState(false);
  const [regTermPrivacy, setRegTermPrivacy] = useState(false);
  const [regTermMarketing, setRegTermMarketing] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Dynamic Brand & Favicon States
  const [brandNameKo, setBrandNameKo] = useState('원데이즈뷰티');
  const [brandNameEn, setBrandNameEn] = useState('ONEDAYS BEAUTY');
  const [faviconUrl, setFaviconUrl] = useState('');

  // Anatolia Interactive Footer State
  const [footerConfig, setFooterConfig] = useState<AnatoliaFooterConfig>(defaultAnatoliaFooterConfig);
  const [openMobileCol, setOpenMobileCol] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedBrandKo = localStorage.getItem('site_brand_name_ko');
    if (savedBrandKo) setBrandNameKo(savedBrandKo);

    const savedBrandEn = localStorage.getItem('site_brand_name_en');
    if (savedBrandEn) setBrandNameEn(savedBrandEn);

    const savedFavicon = localStorage.getItem('site_favicon_url');
    if (savedFavicon) {
      setFaviconUrl(savedFavicon);
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = savedFavicon;
    }

    const savedFooter = localStorage.getItem('anatolia_footer_config');
    if (savedFooter) {
      try {
        setFooterConfig(JSON.parse(savedFooter));
      } catch (e) {
        console.error('Failed to parse anatolia_footer_config:', e);
      }
    }

    const savedShowMall = localStorage.getItem('show_shopping_mall');
    if (savedShowMall !== null) {
      setShowShoppingMall(JSON.parse(savedShowMall));
    }

    const savedLang = localStorage.getItem('selected_language') as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }

    const savedUser = localStorage.getItem('customer_user');
    if (savedUser) {
      try {
        setCustomerUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse customer_user:', e);
      }
    }
  }, []);

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    const userName = loginEmail.split('@')[0] || '회원';
    const userObj = {
      id: 'cust_' + Date.now(),
      name: userName,
      email: loginEmail,
    };
    localStorage.setItem('customer_user', JSON.stringify(userObj));
    setCustomerUser(userObj);
    setIsLoginModalOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    alert(`${userName}님 환영합니다! 쇼핑몰 로그인이 완료되었습니다.`);
  };

  const handleDemoLogin = () => {
    const userObj = {
      id: 'cust_demo',
      name: '김민서',
      email: 'minseo@example.com',
    };
    localStorage.setItem('customer_user', JSON.stringify(userObj));
    setCustomerUser(userObj);
    setIsLoginModalOpen(false);
    alert('김민서 회원님으로 로그인되었습니다.');
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customer_user');
    setCustomerUser(null);
    alert('로그아웃되었습니다.');
  };

  const handleToggleAllTerms = (checked: boolean) => {
    setRegTermsAll(checked);
    setRegTermService(checked);
    setRegTermPrivacy(checked);
    setRegTermMarketing(checked);
  };

  const handleProceedToRegisterForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regTermService || !regTermPrivacy) {
      alert('필수 약관에 모두 동의하셔야 회원가입 진행이 가능합니다.');
      return;
    }
    setAuthMode('register_form');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      alert('필수 정보를 모두 입력해 주세요.');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const newUser = {
      id: 'cust_' + Date.now(),
      name: regName,
      email: regEmail,
      phone: regPhone,
    };

    localStorage.setItem('customer_user', JSON.stringify(newUser));
    setCustomerUser(newUser);
    setIsLoginModalOpen(false);
    setAuthMode('login');

    // Clear inputs
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegPasswordConfirm('');
    setRegPhone('');
    setRegTermsAll(false);
    setRegTermService(false);
    setRegTermPrivacy(false);
    setRegTermMarketing(false);

    alert(`'${regName}'님, 회원가입이 성공적으로 완료되었습니다! 환영합니다.`);
  };


  const handleLanguageChange = (code: LanguageCode) => {
    setCurrentLang(code);
    localStorage.setItem('selected_language', code);
    setLangDropdownOpen(false);

    if (code === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const t = (key: string) => {
    return translations[currentLang]?.[key] || translations['ko']?.[key] || key;
  };

  const isShopPage = location.pathname === '/';
  const currentLangObj = supportedLanguages.find((l) => l.code === currentLang) || supportedLanguages[0];

  return (
    <div className="text-[#FAFAFA] font-sans antialiased min-h-screen flex flex-col bg-[#050505]">
      {/* Floating Transparent -> Black Glass Blur Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#050505]/90 backdrop-blur-md border-b border-[#D6A56D]/20 shadow-2xl py-3'
            : 'bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-transparent py-5'
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-[1536px] mx-auto">
          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-[#D81B60] transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest">
            <Link
              to="/company"
              className={`relative py-1 transition-colors duration-300 hover:text-[#D81B60] ${
                location.pathname === '/company' ? 'text-[#D81B60] font-bold' : 'text-slate-300'
              }`}
            >
              {t('company')}
              {location.pathname === '/company' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D81B60] rounded-full" />
              )}
            </Link>
            <Link
              to="/brand"
              className={`relative py-1 transition-colors duration-300 hover:text-[#D81B60] ${
                location.pathname === '/brand' ? 'text-[#D81B60] font-bold' : 'text-slate-300'
              }`}
            >
              {t('brand')}
              {location.pathname === '/brand' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D81B60] rounded-full" />
              )}
            </Link>
            <Link
              to="/media"
              className={`relative py-1 transition-colors duration-300 hover:text-[#D81B60] ${
                location.pathname === '/media' ? 'text-[#D81B60] font-bold' : 'text-slate-300'
              }`}
            >
              {t('media')}
              {location.pathname === '/media' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D81B60] rounded-full" />
              )}
            </Link>
            {showShoppingMall && (
              <Link
                to="/"
                className={`relative py-1 transition-colors duration-300 hover:text-[#D81B60] ${
                  isShopPage ? 'text-[#D81B60] font-bold' : 'text-slate-300'
                }`}
              >
                {t('shop')}
                {isShopPage && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D81B60] rounded-full" />
                )}
              </Link>
            )}
          </nav>

          {/* Logo Center */}
          <div className="flex-1 flex justify-center items-center">
            <Link
              to="/"
              className="text-xl md:text-3xl font-serif tracking-[0.25em] text-white hover:text-[#D6A56D] transition-colors uppercase flex items-center gap-3"
            >
              {faviconUrl && <img src={faviconUrl} alt="Logo Icon" className="w-8 h-8 object-contain" />}
              <span>{brandNameEn || 'ONEDAYS BEAUTY'}</span>
            </Link>
          </div>

          {/* Header Right Tools: Language Selector + Cart + Console */}
          <div className="flex gap-4 items-center text-white">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#D6A56D]/50 transition-colors text-xs font-semibold text-slate-200"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.label}</span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#141414] rounded-2xl shadow-2xl border border-[#D6A56D]/30 py-2 z-50 animate-in fade-in duration-200">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#D6A56D] uppercase tracking-wider border-b border-white/10">
                    Language
                  </div>
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-xs text-left flex items-center justify-between hover:bg-white/5 transition-colors ${
                        currentLang === lang.code ? 'font-bold text-[#D81B60] bg-white/5' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {currentLang === lang.code && (
                        <span className="material-symbols-outlined text-[14px] text-[#D81B60]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Auth User Info & Login/Logout Button */}
            {customerUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/mypage"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D6A56D]/15 border border-[#D6A56D]/40 text-[#D6A56D] hover:text-white hover:bg-[#D6A56D]/30 transition-all text-xs font-bold"
                  title="My Page"
                >
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  <span>{customerUser.name}님</span>
                </Link>
                <button
                  onClick={handleCustomerLogout}
                  className="px-3 py-1.5 rounded-full border border-white/20 hover:border-[#D81B60] text-slate-300 hover:text-[#D81B60] transition-colors text-xs font-semibold"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D81B60] to-[#A80F48] hover:from-[#A80F48] hover:to-[#D81B60] text-white text-xs font-bold transition-all shadow-md shadow-[#D81B60]/20"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>로그인</span>
              </button>
            )}

            {/* Cart Modal Trigger Button */}
            {showShoppingMall && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-slate-200 hover:text-[#D81B60] transition-colors relative"
                title="Shopping Bag"
              >
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B0B0B] border-b border-[#D6A56D]/30 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            {/* Mobile Auth Banner */}
            <div className="pb-3 border-b border-white/10 flex justify-between items-center">
              {customerUser ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#D6A56D] text-[20px]">account_circle</span>
                    <span className="text-xs font-bold text-white">{customerUser.name}님 (일반회원)</span>
                  </div>
                  <button
                    onClick={() => {
                      handleCustomerLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-[#D81B60] font-bold underline"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-[#D81B60] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  <span>일반회원 로그인</span>
                </button>
              )}
            </div>

            <Link
              to="/company"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold tracking-wider text-slate-200 hover:text-[#D81B60]"
            >
              {t('company')}
            </Link>
            <Link
              to="/brand"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold tracking-wider text-slate-200 hover:text-[#D81B60]"
            >
              {t('brand')}
            </Link>
            <Link
              to="/media"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold tracking-wider text-slate-200 hover:text-[#D81B60]"
            >
              {t('media')}
            </Link>
            {showShoppingMall && (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold tracking-wider text-slate-200 hover:text-[#D81B60]"
              >
                {t('shop')}
              </Link>
            )}
            {customerUser && (
              <Link
                to="/mypage"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold tracking-wider text-[#D6A56D] hover:text-white"
              >
                마이페이지 (My Page)
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-h-screen">
        {children}
      </main>

      {/* Cart Modal Container */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Customer Luxury Login & Registration Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#141414] border border-[#D6A56D]/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setAuthMode('login');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>

            {/* 1. LOGIN MODE */}
            {authMode === 'login' && (
              <>
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold text-[#D6A56D] uppercase tracking-[0.3em]">
                    SHOPPING MALL MEMBER ACCESS
                  </span>
                  <h3 className="text-2xl font-serif text-white font-bold">일반회원 로그인</h3>
                  <p className="text-xs text-slate-400">
                    원데이즈뷰티 회원으로 로그인하고 시그니처 혜택을 누려보세요.
                  </p>
                </div>

                <form onSubmit={handleCustomerLogin} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      이메일 주소
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D81B60] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      비밀번호
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D81B60] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#D81B60] to-[#A80F48] hover:from-[#A80F48] hover:to-[#D81B60] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#D81B60]/20"
                  >
                    로그인하기
                  </button>
                </form>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
                    <span className="bg-[#141414] px-3">빠른 원터치 체험</span>
                  </div>
                </div>

                <button
                  onClick={handleDemoLogin}
                  className="w-full py-3 bg-white/5 hover:bg-[#D6A56D]/20 border border-[#D6A56D]/40 text-[#D6A56D] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>데모 일반회원 (김민서) 즉시 로그인</span>
                </button>

                {/* Bottom Register Prompt Link */}
                <div className="pt-4 border-t border-white/10 text-center">
                  <p className="text-xs text-slate-400">
                    아직 원데이즈뷰티 회원이 아니신가요?{' '}
                    <button
                      onClick={() => setAuthMode('register_terms')}
                      className="text-[#D81B60] hover:text-[#D6A56D] font-bold underline transition-colors ml-1"
                    >
                      회원가입하기
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* 2. REGISTER STEP 1: TERMS AGREEMENT */}
            {authMode === 'register_terms' && (
              <form onSubmit={handleProceedToRegisterForm} className="space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold text-[#D6A56D] uppercase tracking-[0.3em]">
                    STEP 01 / 02
                  </span>
                  <h3 className="text-2xl font-serif text-white font-bold">약관 동의</h3>
                  <p className="text-xs text-slate-400">
                    원데이즈뷰티 서비스 이용을 위한 약관에 동의해 주세요.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Select All */}
                  <label className="flex items-center gap-3 p-3.5 bg-white/5 border border-[#D6A56D]/30 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={regTermsAll}
                      onChange={(e) => handleToggleAllTerms(e.target.checked)}
                      className="w-4 h-4 accent-[#D81B60] rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white">전체 약관에 동의합니다.</span>
                  </label>

                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-start gap-3 p-3 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                      <input
                        type="checkbox"
                        required
                        checked={regTermService}
                        onChange={(e) => setRegTermService(e.target.checked)}
                        className="w-4 h-4 accent-[#D81B60] rounded mt-0.5 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#D81B60]">[필수]</span>{' '}
                        <span className="text-slate-200">쇼핑몰 이용약관 동의</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          서비스 이용을 위한 표준약관 및 전자상거래 규정에 동의합니다.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                      <input
                        type="checkbox"
                        required
                        checked={regTermPrivacy}
                        onChange={(e) => setRegTermPrivacy(e.target.checked)}
                        className="w-4 h-4 accent-[#D81B60] rounded mt-0.5 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#D81B60]">[필수]</span>{' '}
                        <span className="text-slate-200">개인정보 수집 및 이용 동의</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          주문 배송 및 서비스 제공을 위한 최저한의 개인정보를 수집합니다.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={regTermMarketing}
                        onChange={(e) => setRegTermMarketing(e.target.checked)}
                        className="w-4 h-4 accent-[#D81B60] rounded mt-0.5 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-400">[선택]</span>{' '}
                        <span className="text-slate-300">쇼핑 혜택 및 마케팅 정보 수신 동의</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          신상품 출시 및 VIP 전용 혜택 소식을 수신합니다.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-1/3 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-gradient-to-r from-[#D81B60] to-[#A80F48] hover:from-[#A80F48] hover:to-[#D81B60] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#D81B60]/20"
                  >
                    다음 (정보입력)
                  </button>
                </div>
              </form>
            )}

            {/* 3. REGISTER STEP 2: USER INFORMATION FORM */}
            {authMode === 'register_form' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold text-[#D6A56D] uppercase tracking-[0.3em]">
                    STEP 02 / 02
                  </span>
                  <h3 className="text-2xl font-serif text-white font-bold">회원 정보 입력</h3>
                  <p className="text-xs text-slate-400">
                    회원가입에 필요한 정보를 입력해 주세요.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      이름 <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D81B60] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      이메일 주소 <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D81B60] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      비밀번호 <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="비밀번호 입력 (6자 이상)"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D81B60] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      비밀번호 확인 <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      placeholder="비밀번호 재입력"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D81B60] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      휴대폰 번호
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D81B60] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setAuthMode('register_terms')}
                    className="w-1/3 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-gradient-to-r from-[#D81B60] to-[#A80F48] hover:from-[#A80F48] hover:to-[#D81B60] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#D81B60]/20"
                  >
                    회원가입 완료
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Anatolia Style High-Fashion Interactive Luxury Footer */}
      <footer className="w-full bg-[#050505] text-[#FAFAFA] border-t border-[#D6A56D]/20 pt-24 pb-12 px-6 md:px-16 relative overflow-hidden select-none">
        {/* Giant Architectural Brand Watermark background */}
        <div className="w-full text-center py-10 opacity-15 hover:opacity-30 transition-opacity duration-700 pointer-events-none">
          <h2 className="text-[11vw] font-serif font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#FAFAFA] via-[#D6A56D] to-transparent uppercase leading-none whitespace-nowrap">
            {footerConfig.watermarkText || brandNameEn || 'ANATOLIA'}
          </h2>
          <p className="text-xs md:text-sm tracking-[0.6em] font-sans font-bold text-[#D6A56D] uppercase mt-2">
            {footerConfig.subTagline}
          </p>
        </div>

        {/* Interactive Column Navigation & Newsletter Grid */}
        <div className="max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 my-16 relative z-10">
          {/* Left Brand Identity & Tagline (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-serif tracking-[0.25em] text-[#D6A56D] hover:text-white transition-colors uppercase font-bold">
                {brandNameEn || 'ANATOLIA BEAUTY'}
              </span>
            </Link>
            <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-md">
              건축학적 우아함과 지중해 정취, 피부 과학의 조화로 태어난 하이 패션 플래그십 뷰티 하우스. 시대를 초월한 럭셔리 아우라를 선사합니다.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-[#D6A56D] pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D81B60] animate-pulse" />
              <span>GLOBAL FLAGSHIP EXPERIENCE</span>
            </div>
          </div>

          {/* Middle Columns (Dynamic Admin Configured Columns - 5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerConfig.columns.map((col) => (
              <div key={col.id} className="space-y-4">
                {/* Mobile Accordion Toggle Header */}
                <button
                  onClick={() => setOpenMobileCol(openMobileCol === col.id ? null : col.id)}
                  className="w-full flex justify-between items-center sm:block text-left group"
                >
                  <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6A56D] group-hover:text-[#D81B60] transition-colors pb-1 border-b border-[#D6A56D]/20 sm:border-none">
                    {col.title}
                  </h5>
                  <span className="sm:hidden material-symbols-outlined text-[16px] text-[#D6A56D]">
                    {openMobileCol === col.id ? 'remove' : 'add'}
                  </span>
                </button>

                {/* Submenu List */}
                <ul className={`space-y-2.5 text-xs font-medium text-slate-300 ${
                  openMobileCol === col.id ? 'block' : 'hidden sm:block'
                }`}>
                  {col.links.map((link) => (
                    <li key={link.id}>
                      {link.url === 'terms' || link.url === 'privacy' || link.url === 'businessInfo' ? (
                        <button
                          onClick={() => setLegalModalType(link.url as any)}
                          className="hover:text-[#D81B60] transition-colors text-left flex items-center gap-1.5 group/item"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover/item:bg-[#D81B60] transition-colors" />
                          <span>{link.label}</span>
                        </button>
                      ) : link.isExternal || link.url.startsWith('http') ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#D81B60] transition-colors flex items-center gap-1.5 group/item"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover/item:bg-[#D81B60] transition-colors" />
                          <span>{link.label}</span>
                        </a>
                      ) : (
                        <Link
                          to={link.url}
                          className="hover:text-[#D81B60] transition-colors flex items-center gap-1.5 group/item"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover/item:bg-[#D81B60] transition-colors" />
                          <span>{link.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Newsletter Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4 bg-[#141414]/60 p-6 rounded-2xl border border-[#D6A56D]/20">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6A56D]">
              {footerConfig.newsletterTitle}
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {footerConfig.newsletterDescription}
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('뉴스레터 구독 신청이 완료되었습니다.'); }} className="space-y-3 pt-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="w-full bg-[#050505] border border-[#D6A56D]/30 px-3.5 py-2.5 text-xs text-white rounded-lg focus:outline-none focus:border-[#D81B60] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D81B60] to-[#A80F48] hover:from-[#A80F48] hover:to-[#D81B60] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-lg shadow-[#D81B60]/20"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Rights & Social Bar */}
        <div className="max-w-[1536px] mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 relative z-10">
          <p className="tracking-wider">
            © {new Date().getFullYear()} {footerConfig.copyrightText || (brandNameEn + ' ALL RIGHTS RESERVED.')}
          </p>
          <div className="flex gap-8 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <a href={footerConfig.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-[#D81B60] transition-colors">
              INSTAGRAM
            </a>
            <a href={footerConfig.youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-[#D81B60] transition-colors">
              YOUTUBE
            </a>
            <a href={footerConfig.vogueUrl} target="_blank" rel="noreferrer" className="hover:text-[#D81B60] transition-colors">
              VOGUE MEDIA
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

