import { useState, useEffect } from 'react';
import { BrandStorySettings, defaultBrandStorySettings, MoodFilmItem } from '../types/BrandTypes';

export function BrandStory() {
  const [settings, setSettings] = useState<BrandStorySettings>(defaultBrandStorySettings);
  const [activeFilmModal, setActiveFilmModal] = useState<MoodFilmItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('brand_story_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        setSettings(defaultBrandStorySettings);
      }
    } else {
      setSettings(defaultBrandStorySettings);
      localStorage.setItem('brand_story_settings', JSON.stringify(defaultBrandStorySettings));
    }
  }, []);

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-700 pb-20 pt-16">
      {/* 1. Anatolia Style Hero & Staggered Reveal Header */}
      <section className="relative w-full min-h-[75vh] flex flex-col justify-between overflow-hidden bg-[#050505] rounded-3xl border border-[#D6A56D]/20 shadow-2xl p-8 md:p-16">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D81B60]/20 rounded-full blur-[140px] pointer-events-none" />

        {/* Video / Poster Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {settings.heroVideoUrl ? (
            <video
              src={settings.heroVideoUrl}
              poster={settings.heroPosterUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <img
              src={settings.heroPosterUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop'}
              alt="Brand Hero Visual"
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/70" />
        </div>

        {/* Top Tagline */}
        <div className="relative z-10 flex justify-between items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D6A56D]/40 text-[#D6A56D] text-xs font-bold uppercase tracking-[0.35em] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D81B60] animate-ping" />
            {settings.heroTagline || 'ARCHITECTURAL BEAUTY'}
          </span>
          <span className="text-xs font-serif tracking-[0.3em] text-slate-400 uppercase hidden sm:inline">
            BRAND PHILOSOPHY
          </span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl space-y-6 my-auto pt-10 pb-6 text-left">
          <p className="text-xs md:text-sm font-sans font-bold text-[#D6A56D] uppercase tracking-[0.5em]">
            THE HOUSE OF ONEDAYS BEAUTY
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-tight tracking-tight text-white font-extralight uppercase whitespace-pre-line">
            {settings.heroHeadline || 'CRAFTING TIMELESS ELEGANCE'}
          </h1>

          <p className="text-sm md:text-base text-[#B7B7B7] max-w-2xl font-light leading-relaxed">
            {settings.heroSubheadline || '시대를 초월하는 독보적인 감성과 웅장한 건축적 아름다움을 담아낸 럭셔리 플래그십 클린 스킨케어 컬렉션.'}
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <a
              href="#philosophy"
              className="px-8 py-4 bg-gradient-to-r from-[#D81B60] to-[#A80F48] hover:from-[#A80F48] hover:to-[#D81B60] text-white text-xs font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(216,27,96,0.4)] border border-[#D81B60] flex items-center gap-2"
            >
              <span>DISCOVER PHILOSOPHY</span>
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Full Philosophy & Heritage Section */}
      <section id="philosophy" className="py-12 px-6 md:px-12 max-w-[1536px] mx-auto border-t border-white/10 scroll-mt-28">
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
            <span className="text-xs font-bold text-[#D81B60] uppercase tracking-[0.25em]">Discover Philosophy</span>
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
          </div>
        </div>
      </section>

      {/* 3. Brand Philosophy Grid Section */}
      <section id="brand-values" className="max-w-[1536px] mx-auto px-6 md:px-12 space-y-12 pt-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#D6A56D] uppercase tracking-widest">
            {settings.philosophyTitle || 'CORE VALUES'}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            {settings.philosophySubtitle || '3대 핵심 가치 디테일'}
          </h2>
          <div className="w-12 h-0.5 bg-[#D6A56D] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {settings.philosophyCards.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={card.imageUrl || 'https://images.unsplash.com/photo-1608248597260-50c39f70a784?q=80&w=800&auto=format&fit=crop'}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {card.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 md:p-8 space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {card.subtitle}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mood Film & Video Showcase Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-16 max-w-6xl mx-auto space-y-10 shadow-2xl">
        <div className="flex justify-between items-end flex-wrap gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              {settings.filmSectionTitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
              {settings.filmSectionSubtitle}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {settings.moodFilms.length} Media Releases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings.moodFilms.map((film) => (
            <div
              key={film.id}
              onClick={() => setActiveFilmModal(film)}
              className="group cursor-pointer bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-amber-400/50 transition-all duration-300 shadow-md flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={film.thumbnailUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop'}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white text-[24px]">
                      {film.mediaType === 'video' ? 'play_arrow' : 'photo_library'}
                    </span>
                  </div>
                </div>
                {film.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded">
                    {film.badge}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {film.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {film.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Signature Quote Section */}
      <section className="max-w-4xl mx-auto text-center px-6 py-12 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <span className="material-symbols-outlined text-[36px] text-amber-700">format_quote</span>
        <blockquote className="text-xl md:text-2xl font-serif text-slate-900 leading-relaxed font-semibold italic">
          "{settings.signatureQuote}"
        </blockquote>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
          — {settings.signatureAuthor} —
        </p>
      </section>

      {/* Media Modal */}
      {activeFilmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative">
            <button
              onClick={() => setActiveFilmModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h3 className="text-lg font-bold font-serif text-white pr-10">
              {activeFilmModal.title}
            </h3>

            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800">
              {activeFilmModal.videoUrl ? (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  src={activeFilmModal.videoUrl}
                >
                  <source src={activeFilmModal.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={activeFilmModal.thumbnailUrl}
                  alt={activeFilmModal.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeFilmModal.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
