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
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-h-screen">
        {children}
      </main>

      {/* Cart Modal Container */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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

