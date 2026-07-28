import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product, initialProducts, initialCategories } from './ProductManagement';
import { CartItem } from '../types/OrderTypes';
import { AnatoliaHeroConfig, defaultAnatoliaHeroConfig } from '../types/BrandTypes';

export function LandingPage() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  // Anatolia Hero & Intro Animation Config State
  const [heroConfig, setHeroConfig] = useState<AnatoliaHeroConfig>(defaultAnatoliaHeroConfig);
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedHero = localStorage.getItem('anatolia_hero_config');
    if (savedHero) {
      try {
        setHeroConfig(JSON.parse(savedHero));
      } catch (e) {
        console.error('Failed to parse anatolia_hero_config:', e);
      }
    }
  }, []);


  useEffect(() => {
    const savedProducts = localStorage.getItem('shop_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }

    const savedCategories = localStorage.getItem('shop_categories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        setCategories(initialCategories);
      }
    } else {
      setCategories(initialCategories);
    }

    // Sync initial cart count from localStorage
    const savedCart = localStorage.getItem('shop_cart_items');
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
      } catch (e) {
        // default
      }
    }
  }, []);

  useEffect(() => {
    if (filterParam === 'bestsellers') {
      setSelectedCategory('베스트셀러');
      const elem = document.getElementById('product-catalog');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filterParam]);

  const bestsellers = products.filter((p) => p.isBestseller && p.status !== '숨김');

  const filteredProducts = products.filter((p) => {
    if (p.status === '숨김') return false;
    if (selectedCategory === '베스트셀러') return p.isBestseller;
    if (selectedCategory === '전체') return true;
    return p.category === selectedCategory;
  });

  const handleAddToCart = (prd: Product) => {
    const savedCart = localStorage.getItem('shop_cart_items');
    let cartItems: CartItem[] = [];
    if (savedCart) {
      try {
        cartItems = JSON.parse(savedCart);
      } catch (e) {
        cartItems = [];
      }
    }

    const existingIndex = cartItems.findIndex((item) => item.productId === prd.id);
    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push({
        productId: prd.id,
        code: prd.code,
        name: prd.name,
        price: prd.price,
        salePrice: prd.salePrice,
        brand: prd.brand,
        imageUrl: prd.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem('shop_cart_items', JSON.stringify(cartItems));
    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalQty);
    alert(`'${prd.name}' 제품이 장바구니에 담겼습니다.`);
  };

  return (
    <div className="bg-[#050505] text-[#FAFAFA] min-h-screen selection:bg-[#D81B60] selection:text-white">
      {/* 1. Anatolia Style Cinematic Fullscreen Video Mask Hero & Staggered Reveal */}
      <section className="relative w-full min-h-[110vh] flex flex-col justify-between overflow-hidden bg-[#050505] pt-24 pb-16">
        {/* Background Ambient Pink & Rose Gold Glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#D81B60]/20 rounded-full blur-[160px] pointer-events-none transition-transform duration-700"
          style={{ transform: `translate(-50%, ${scrollY * 0.25}px)` }}
        />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#D6A56D]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Anatolia Scroll-Driven Video Mask Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div
            className="w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${1 + Math.min(scrollY / 1000, 0.25)})`,
              filter: `brightness(${Math.max(0.4, 0.75 - scrollY / 1200)}) contrast(1.1)`,
            }}
          >
            {heroConfig.videoUrl ? (
              <video
                src={heroConfig.videoUrl}
                poster={heroConfig.posterUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={heroConfig.posterUrl}
                alt="Anatolia Hero Visual"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* Subtle Mask Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#050505]/70" />
        </div>

        {/* Hero Top Tagline & Badge */}
        <div className="relative z-10 max-w-[1536px] w-full mx-auto px-6 md:px-16 flex justify-between items-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#D6A56D]/40 text-[#D6A56D] text-xs font-bold uppercase tracking-[0.35em] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D81B60] animate-ping" />
            {heroConfig.badgeText || 'ARCHITECTURAL BEAUTY'}
          </span>
          <span className="text-xs font-serif tracking-[0.3em] text-slate-400 uppercase hidden sm:inline">
            EST. ANATOLIA HOUSE
          </span>
        </div>

        {/* Hero Center Staggered Typography Reveal */}
        <div className="relative z-10 max-w-[1536px] w-full mx-auto px-6 md:px-16 my-auto pt-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 space-y-6 text-left">
            <p className="text-xs md:text-sm font-sans font-bold text-[#D6A56D] uppercase tracking-[0.5em] animate-in fade-in duration-700">
              {heroConfig.introSubtitle}
            </p>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif leading-[1.05] tracking-tight text-white font-extralight uppercase">
              {heroConfig.introTitle.split('\n').map((line, idx) => (
                <span key={idx} className="block overflow-hidden">
                  <span
                    className="inline-block transform transition-transform duration-1000 ease-out"
                    style={{ transform: `translateY(${Math.max(0, 50 - scrollY * 0.1)}px)` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p className="text-sm md:text-base text-[#B7B7B7] max-w-2xl font-light leading-relaxed pt-2">
              {heroConfig.introDescription}
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <Link
                to={heroConfig.ctaLink || '/brand'}
                className="px-8 py-4 bg-gradient-to-r from-[#D81B60] to-[#A80F48] hover:from-[#A80F48] hover:to-[#D81B60] text-white text-xs font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-300 shadow-[0_0_35px_rgba(216,27,96,0.4)] border border-[#D81B60]"
              >
                {heroConfig.ctaText || 'EXPLORE COLLECTION'}
              </Link>
              <a
                href="#brand-story"
                className="px-8 py-4 bg-white/5 hover:bg-[#D6A56D]/15 text-[#D6A56D] hover:text-white text-xs font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-300 border border-[#D6A56D]/40 backdrop-blur-md"
              >
                DISCOVER PHILOSOPHY
              </a>
            </div>
          </div>

          {/* Right Floating Indicator */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end text-right space-y-4">
            <div className="w-32 h-[1px] bg-gradient-to-l from-[#D6A56D] to-transparent" />
            <span className="text-[11px] font-serif tracking-[0.3em] text-[#D6A56D] uppercase">
              ANATOLIA CINEMATIC EXPERIENCE
            </span>
            <p className="text-[10px] text-slate-400 max-w-[200px]">
              스크롤을 내려 건축적 아우라와 시네마틱 스토리를 감상하세요.
            </p>
          </div>
        </div>

        {/* Hero Bottom Parallax Cards Preview */}
        <div className="relative z-10 max-w-[1536px] w-full mx-auto px-6 md:px-16 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {heroConfig.parallaxCards.map((card) => (
              <div
                key={card.id}
                className="group relative p-6 rounded-2xl bg-[#141414]/80 border border-[#D6A56D]/20 backdrop-blur-xl hover:border-[#D81B60]/60 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
              >
                <span className="text-[10px] font-bold text-[#D6A56D] uppercase tracking-[0.25em] block mb-2">
                  {card.category}
                </span>
                <h4 className="text-lg font-serif text-white tracking-wide group-hover:text-[#D6A56D] transition-colors mb-2">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Brand Story Section */}
      <section id="brand-story" className="py-28 px-6 md:px-12 max-w-[1536px] mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#D6A56D]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1608248597260-50c39f70a784?q=80&w=1000&auto=format&fit=crop"
                alt="Brand Craftsmanship"
                className="w-full h-[520px] object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-[#141414]/80 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-[10px] font-mono text-[#D6A56D] uppercase tracking-widest">Heritage Craftsmanship</span>
                <p className="text-sm font-serif italic text-slate-200 mt-1">"Quiet elegance, profound dermatological efficacy."</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-[#D81B60] uppercase tracking-[0.25em]">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              KOREAN HERITAGE MEETS <br />
              <span className="italic text-[#D6A56D]">HIGH FASHION</span> DERMATOLOGY
            </h2>
            <p className="text-sm md:text-base text-[#B7B7B7] font-light leading-relaxed">
              자연에서 엄선한 최상급 원료(인삼, 쌀겨수, 붉은팥 PDRN)에 현대 피부 과학의 정교함을 더했습니다.
              피부에 부담 없는 100% 클린 비건 처방으로 매일 완성하는 독보적인 스킨케어 의식을 선사합니다.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <span className="text-3xl font-serif text-[#D6A56D] font-bold">100%</span>
                <p className="text-xs text-[#B7B7B7] uppercase tracking-wider mt-1">Vegan Formula Certified</p>
              </div>
              <div>
                <span className="text-3xl font-serif text-[#D6A56D] font-bold">60+</span>
                <p className="text-xs text-[#B7B7B7] uppercase tracking-wider mt-1">Global Luxury Outlets</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/company"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-[#D81B60] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/20 hover:border-[#D81B60]"
              >
                <span>Read Full Philosophy</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Signature Collection (Luxury Masonry Layout) */}
      <section className="py-24 px-6 md:px-12 max-w-[1536px] mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#D6A56D] uppercase tracking-[0.3em]">Signature Line</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">THE MASONRY SELECTION</h2>
          <p className="text-xs md:text-sm text-[#B7B7B7] font-light">엄선된 시그니처 럭셔리 라인업을 에디토리얼 비주얼로 경험해 보세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Masonry Big Item 1 */}
          <div className="md:col-span-7 bg-[#141414] rounded-3xl border border-white/10 overflow-hidden relative group shadow-2xl">
            <div className="h-[480px] overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80"
                alt="Signature Collection 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
            <div className="p-8 absolute bottom-0 left-0 right-0 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-[#D81B60] uppercase tracking-widest">Iconic Cream</span>
                <h3 className="text-2xl font-serif text-white font-bold mt-1">인삼 탄력 크림 60ml</h3>
                <p className="text-xs text-[#B7B7B7] mt-1">깊은 영양감으로 주름과 장벽을 탄탄하게 케어</p>
              </div>
              <span className="text-2xl font-serif font-bold text-[#D6A56D]">₩20,400</span>
            </div>
          </div>

          {/* Masonry Big Item 2 */}
          <div className="md:col-span-5 bg-[#141414] rounded-3xl border border-white/10 overflow-hidden relative group shadow-2xl">
            <div className="h-[480px] overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
                alt="Signature Collection 2"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
            <div className="p-8 absolute bottom-0 left-0 right-0 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-[#D6A56D] uppercase tracking-widest">Global Bestseller</span>
                <h3 className="text-xl font-serif text-white font-bold mt-1">맑은쌀선크림 (SPF 50+)</h3>
              </div>
              <span className="text-xl font-serif font-bold text-[#D6A56D]">₩15,300</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Luxury Editorial Section (Vogue Magazine Layout) */}
      <section className="py-24 bg-[#0B0B0B] border-t border-white/10">
        <div className="max-w-[1536px] mx-auto px-6 md:px-12">
          <div className="bg-gradient-to-r from-[#141414] via-[#1E1E1E] to-[#141414] rounded-3xl border border-[#D6A56D]/30 p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#D81B60]/20 border border-[#D81B60]/50 text-[#D81B60] text-xs font-bold uppercase tracking-widest">
                  EDITORIAL FEATURE — VOGUE LUXURY
                </span>
                <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                  THE NEW DEFINITION <br />
                  <span className="italic text-[#D6A56D]">OF K-BEAUTY ELEGANCE</span>
                </h2>
                <p className="text-sm text-[#B7B7B7] leading-relaxed font-light">
                  "보그 라이프스타일 매거진 선정 2026년 가장 주목받는 클린 뷰티 브랜드.
                  정제된 블랙 앤 로즈 골드 비주얼과 압도적인 피부 효능의 조화."
                </p>
                <div className="pt-4">
                  <Link
                    to="/media"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(216,27,96,0.3)]"
                  >
                    Read Editorial Article
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                    alt="Editorial Model"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Main Product Catalog Section (Dark Cards `#141414` + Rose Gold Badges) */}
      <section id="product-catalog" className="py-28 px-6 md:px-12 max-w-[1536px] mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#D81B60] uppercase tracking-[0.3em]">Flagship Boutique</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">THE PRODUCT COLLECTION</h2>
          <p className="text-xs md:text-sm text-[#B7B7B7] font-light">원데이즈뷰티의 모든 컬렉션을 라이프스타일에 맞게 탐색하세요.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center items-center gap-3 mb-12 flex-wrap">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
              selectedCategory === '전체'
                ? 'bg-[#D81B60] text-white shadow-[0_0_20px_rgba(216,27,96,0.4)]'
                : 'bg-[#141414] text-[#B7B7B7] hover:bg-[#1E1E1E] border border-white/10'
            }`}
          >
            All Products ({products.filter((p) => p.status !== '숨김').length})
          </button>
          
          <button
            onClick={() => setSelectedCategory('베스트셀러')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${
              selectedCategory === '베스트셀러'
                ? 'bg-[#D6A56D] text-[#050505] shadow-[0_0_20px_rgba(214,165,109,0.4)]'
                : 'bg-[#141414] text-[#D6A56D] hover:bg-[#1E1E1E] border border-[#D6A56D]/30'
            }`}
          >
            ★ Bestsellers ({bestsellers.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat && p.status !== '숨김').length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                  selectedCategory === cat
                    ? 'bg-[#D81B60] text-white shadow-[0_0_20px_rgba(216,27,96,0.4)]'
                    : 'bg-[#141414] text-[#B7B7B7] hover:bg-[#1E1E1E] border border-white/10'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-[#141414] rounded-3xl border border-white/10">
            <span className="material-symbols-outlined text-[48px] text-[#D6A56D] mb-2">inventory_2</span>
            <p className="text-sm font-bold text-white">해당 카테고리에 등록된 제품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((prd) => (
              <article
                key={prd.id}
                onClick={() => setSelectedProduct(prd)}
                className="group cursor-pointer bg-[#141414] rounded-3xl border border-white/10 hover:border-[#D81B60]/60 overflow-hidden transition-all duration-500 luxury-card-shadow pink-glow-hover flex flex-col justify-between"
              >
                <div className="w-full aspect-square bg-[#0B0B0B] relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  {prd.isBestseller && (
                    <span className="absolute top-4 left-4 bg-[#D6A56D] text-[#050505] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest z-10 shadow-lg">
                      BEST
                    </span>
                  )}
                  {prd.status === '품절' && (
                    <div className="absolute inset-0 bg-[#050505]/70 backdrop-blur-xs flex items-center justify-center z-10">
                      <span className="bg-[#A80F48] text-white text-xs font-bold px-4 py-1.5 rounded-md uppercase tracking-wider">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  <img
                    src={prd.imageUrl}
                    alt={prd.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#D6A56D] uppercase tracking-widest">{prd.brand}</span>
                    <h3 className="text-base font-serif font-semibold text-white mt-1 line-clamp-2 leading-snug group-hover:text-[#D81B60] transition-colors">
                      {prd.name}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      {prd.salePrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-serif font-bold text-[#D81B60]">₩{prd.salePrice.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 line-through">₩{prd.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-serif font-bold text-white">₩{prd.price.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(prd);
                      }}
                      className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D81B60] text-white flex items-center justify-center transition-colors border border-white/10"
                      title="Add to Bag"
                    >
                      <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 6. Product Detail Modal Viewer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#141414] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D6A56D]/30">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="aspect-square bg-[#0B0B0B] relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                {selectedProduct.isBestseller && (
                  <span className="absolute top-4 left-4 bg-[#D6A56D] text-[#050505] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">
                    BEST SELLER
                  </span>
                )}
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info & Actions */}
              <div className="p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[#D6A56D] uppercase tracking-widest">{selectedProduct.brand}</span>
                    <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-white">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <h2 className="text-2xl font-serif font-bold text-white mb-2 leading-snug">{selectedProduct.name}</h2>
                  <p className="text-xs font-mono text-slate-500 mb-4">Code: {selectedProduct.code} | Category: {selectedProduct.category}</p>

                  <div className="bg-[#0B0B0B] p-4 rounded-2xl border border-white/10 mb-6">
                    <div className="flex items-baseline gap-3">
                      {selectedProduct.salePrice ? (
                        <>
                          <span className="text-2xl font-serif font-bold text-[#D81B60]">₩{selectedProduct.salePrice.toLocaleString()}</span>
                          <span className="text-sm text-slate-500 line-through">₩{selectedProduct.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-serif font-bold text-white">₩{selectedProduct.price.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Stock Availability: {selectedProduct.stock} units ({selectedProduct.status})</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold text-[#D6A56D] uppercase tracking-widest">Product Description</h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#1E1E1E] border border-white/5 p-4 rounded-xl">
                      {selectedProduct.description || '최상급 자연 한방 원료와 현대 더마 스킨케어 기술의 조화로 완성된 럭셔리 뷰티 에디션입니다.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="flex-1 py-3.5 border border-[#D81B60] text-[#D81B60] hover:bg-[#D81B60] hover:text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => {
                      alert('주문 결제 페이지로 이동합니다.');
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-[#D81B60] hover:bg-[#A80F48] text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)]"
                  >
                    Purchase Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
