import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product, initialProducts, initialCategories } from './ProductManagement';

export function LandingPage() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter'); // 'bestsellers' or category name

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // Load products from localStorage
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

    // Load categories
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
  }, []);

  // Handle URL search params if navigated from Header links
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
    setCartCount((prev) => prev + 1);
    alert(`'${prd.name}' 제품이 장바구니에 담겼습니다.`);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-16">
      {/* Hero Banner Section */}
      <section className="mt-6 mb-16 w-full h-[55vh] md:h-[75vh] relative flex items-center border border-slate-200 overflow-hidden rounded-2xl">
        <img 
          src="https://lh3.googleusercontent.com/aida/AP1WRLtwbpLR0OrlYn4dNF3tqH_42Aj4oMGBojFifs3u0hC1FGVJZitGN2H2vJNH1c97S7473i6ycdPbD_oUZX62wI6GTJ1I1j-ciBWMH2LJbHk7cg857jBsi8xSaC4_CC-BiNnzLXvoDdX0ZNA3FCreYP-RqDDvMK303JTP_8bfq00cq1N3lfOZSvC6TBZUzvitSmd7HwqfQx86VqCwSGclWFvuVNUBajQAdv3Lz24O1rZQa8G148-0AD7JvROx" 
          alt="Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
        <div className="relative z-10 p-8 md:p-14 max-w-lg bg-white/80 backdrop-blur-md border border-white/60 ml-4 md:ml-12 rounded-xl shadow-lg">
          <span className="inline-block text-xs font-bold text-amber-800 tracking-widest uppercase mb-3 bg-amber-50 px-2.5 py-1 rounded-md">
            New Onedays Arrival
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 leading-tight">
            무결점 피부<br />붉은팥 PDRN 세럼
          </h1>
          <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed">
            조선시대 한방 성분과 현대 비건 PDRN의 모공 탄력 시너지 케어.
          </p>
          <a
            href="#product-catalog"
            className="inline-block bg-slate-900 text-white text-xs font-bold px-7 py-3.5 uppercase tracking-widest hover:bg-slate-700 transition-colors rounded-lg shadow-sm"
          >
            Discover Collection
          </a>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Editor's Pick</span>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900">Best Sellers (베스트 셀러)</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('베스트셀러');
              const elem = document.getElementById('product-catalog');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-1"
          >
            전체 보기 +
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.slice(0, 3).map((prd, idx) => (
            <article
              key={prd.id}
              onClick={() => setSelectedProduct(prd)}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="w-full aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                <div className="absolute top-4 left-4 z-10 flex gap-1">
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    BEST #{idx + 1}
                  </span>
                  {prd.salePrice && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      SALE
                    </span>
                  )}
                </div>
                <img 
                  src={prd.imageUrl} 
                  alt={prd.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-1">{prd.brand}</p>
                <h3 className="text-base text-slate-900 font-semibold mb-2 line-clamp-1 group-hover:text-amber-800 transition-colors">
                  {prd.name}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    {prd.salePrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">{prd.salePrice.toLocaleString()}원</span>
                        <span className="text-xs text-slate-400 line-through">{prd.price.toLocaleString()}원</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-slate-900">{prd.price.toLocaleString()}원</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">재고 {prd.stock}개</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <section id="product-catalog" className="mb-20 pt-8 border-t border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-3">제품 컬렉션 (Product Catalog)</h2>
          <p className="text-sm text-slate-500">관리자 콘솔에서 등록된 모든 신제품 및 카테고리를 실시간으로 만나보세요.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center items-center gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === '전체'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 보기 ({products.filter((p) => p.status !== '숨김').length})
          </button>
          
          <button
            onClick={() => setSelectedCategory('베스트셀러')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              selectedCategory === '베스트셀러'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            ⭐ 베스트셀러 ({bestsellers.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat && p.status !== '숨김').length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="material-symbols-outlined text-[40px] mb-2">inventory_2</span>
            <p className="text-sm font-bold">해당 카테고리에 등록된 제품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prd) => (
              <article
                key={prd.id}
                onClick={() => setSelectedProduct(prd)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-400 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col"
              >
                <div className="w-full aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                  {prd.isBestseller && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs z-10">
                      BEST
                    </span>
                  )}
                  {prd.status === '품절' && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-10">
                      <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md">품절 (Out of Stock)</span>
                    </div>
                  )}
                  <img
                    src={prd.imageUrl}
                    alt={prd.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{prd.brand}</span>
                    <h3 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
                      {prd.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {prd.salePrice ? (
                        <div>
                          <span className="text-base font-bold text-slate-900">{prd.salePrice.toLocaleString()}원</span>
                          <span className="text-xs text-slate-400 line-through ml-1">{prd.price.toLocaleString()}원</span>
                        </div>
                      ) : (
                        <span className="text-base font-bold text-slate-900">{prd.price.toLocaleString()}원</span>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-900 transition-colors text-[20px]">
                      shopping_bag
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Bento Section */}
      <section className="mb-20 border-t border-slate-200 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Story Hero Bento Box */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[380px]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4 border border-white/10">
                Heritage & Science
              </span>
              <h2 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">
                Blend heritage,<br />Create beauty.
              </h2>
              <p className="text-sm md:text-base text-slate-300 max-w-lg leading-relaxed">
                자연 성분에 현대 피부 공학 과학을 더해 피부 본연의 투명한 기품과 건강함을 되찾아 드립니다.
              </p>
            </div>
            <div className="relative z-10 pt-8">
              <Link
                to="/company"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest shadow-md"
              >
                <span>Read Brand Story</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Secondary Bento Specs Box */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-8 border border-amber-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Global Craftsmanship</span>
                <h3 className="text-2xl font-serif text-slate-900 mt-2 mb-3">ONEDAYS BEAUTY</h3>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Quiet elegance, profound dermatological efficacy."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-200/40 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">100% Vegan & Clean Beauty</span>
                <span className="text-xs font-mono font-bold text-amber-800">Global 60+ Countries</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Rating</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-2xl font-serif font-bold text-slate-900">4.9 / 5.0</span>
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                </div>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                Verified Global Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal Viewer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                {selectedProduct.isBestseller && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs z-10">
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
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">{selectedProduct.brand}</span>
                    <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-700">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{selectedProduct.name}</h2>
                  <p className="text-xs font-mono text-slate-400 mb-4">코드: {selectedProduct.code} | 카테고리: {selectedProduct.category}</p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                    <div className="flex items-baseline gap-3">
                      {selectedProduct.salePrice ? (
                        <>
                          <span className="text-2xl font-bold text-rose-600">{selectedProduct.salePrice.toLocaleString()}원</span>
                          <span className="text-sm text-slate-400 line-through">{selectedProduct.price.toLocaleString()}원</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-slate-900">{selectedProduct.price.toLocaleString()}원</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">남은 재고: {selectedProduct.stock}개 ({selectedProduct.status})</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">제품 설명</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">
                      {selectedProduct.description || '조선시대 한방 미용법과 현대 기술의 만남으로 완성된 피부 친화적 뷰티 케어 라인입니다.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="flex-1 py-3.5 border-2 border-slate-900 text-slate-900 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                    장바구니 담기
                  </button>
                  <button
                    onClick={() => {
                      alert('주문 결제 페이지로 이동합니다.');
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    바로 구매하기
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
