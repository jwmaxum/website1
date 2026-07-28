import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageCode, supportedLanguages, translations } from '../i18n';
import { LegalTermsModal } from './LegalTermsModal';
import { CartModal } from './CartModal';

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

  // Dynamic Brand & Favicon States
  const [brandNameKo, setBrandNameKo] = useState('원데이즈뷰티');
  const [brandNameEn, setBrandNameEn] = useState('ONEDAYS BEAUTY');
  const [faviconUrl, setFaviconUrl] = useState('');

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

    const savedShowMall = localStorage.getItem('show_shopping_mall');
    if (savedShowMall !== null) {
      setShowShoppingMall(JSON.parse(savedShowMall));
    }

    const savedLang = localStorage.getItem('selected_language') as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

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

            {/* Console / Admin Link */}
            <Link
              to="/admin/dashboard"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold rounded-full transition-all shadow-lg hover:shadow-[0_0_15px_rgba(216,27,96,0.5)]"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>{t('console')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B0B0B] border-b border-[#D6A56D]/30 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
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
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#D81B60]"
            >
              {t('console')}
            </Link>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-h-screen">
        {children}
      </main>

      {/* Cart Modal Container */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Legal Terms Modal Container */}
      {legalModalType && (
        <LegalTermsModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      )}

      {/* Pure Black Luxury Footer */}
      <footer className="w-full bg-[#050505] border-t border-[#D6A56D]/20 pt-20 pb-12 px-6 md:px-12">
        <div className="max-w-[1536px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <h4 className="text-2xl font-serif uppercase tracking-[0.2em] text-[#D6A56D]">
              {brandNameEn || 'ONEDAYS BEAUTY'}
            </h4>
            <p className="text-xs font-bold text-[#B7B7B7]">{brandNameKo || '원데이즈뷰티'}</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              고급스러운 감성과 현대 피부 과학의 조화로 탄생한 하이 패션 플래그십 클린 뷰티 브랜드.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#D6A56D]">Navigation</h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/company" className="hover:text-[#D81B60] transition-colors">{t('company')}</Link></li>
              <li><Link to="/brand" className="hover:text-[#D81B60] transition-colors">{t('brand')}</Link></li>
              <li><Link to="/media" className="hover:text-[#D81B60] transition-colors">{t('media')}</Link></li>
              <li><Link to="/" className="hover:text-[#D81B60] transition-colors">{t('shop')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#D6A56D]">Customer & Legal</h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => setLegalModalType('terms')} className="hover:text-[#D81B60] transition-colors text-left">
                  {t('terms')}
                </button>
              </li>
              <li>
                <button onClick={() => setLegalModalType('privacy')} className="hover:text-[#D81B60] transition-colors text-left font-bold text-white">
                  {t('privacy')}
                </button>
              </li>
              <li>
                <button onClick={() => setLegalModalType('businessInfo')} className="hover:text-[#D81B60] transition-colors text-left">
                  {t('businessInfo')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#D6A56D]">Newsletter</h5>
            <p className="text-xs text-slate-400">럭셔리 컬렉션 신규 출시 및 프라이빗 이벤트를 구독하세요.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#141414] border border-[#D6A56D]/30 px-3.5 py-2 text-xs text-white rounded-l-lg focus:outline-none focus:border-[#D81B60] flex-1"
              />
              <button className="bg-[#D81B60] hover:bg-[#A80F48] text-white px-4 py-2 text-xs font-bold rounded-r-lg transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1536px] mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>Copyright © {brandNameEn || 'ONEDAYS BEAUTY'} {t('rights')}</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">YouTube</span>
            <span className="hover:text-white cursor-pointer">Vogue Media</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
