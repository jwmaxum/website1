import { useState, useEffect, FormEvent } from 'react';
import {
  BrandStorySettings,
  defaultBrandStorySettings,
  PhilosophyCard,
  MoodFilmItem,
  AnatoliaHeroConfig,
  defaultAnatoliaHeroConfig,
  AnatoliaFooterConfig,
  defaultAnatoliaFooterConfig,
} from '../types/BrandTypes';

export function BrandManagement() {
  const [settings, setSettings] = useState<BrandStorySettings>(defaultBrandStorySettings);

  // Anatolia Management States
  const [anatoliaHero, setAnatoliaHero] = useState<AnatoliaHeroConfig>(defaultAnatoliaHeroConfig);
  const [anatoliaFooter, setAnatoliaFooter] = useState<AnatoliaFooterConfig>(defaultAnatoliaFooterConfig);
  const [activeTab, setActiveTab] = useState<'anatoliaHero' | 'anatoliaFooter' | 'heritage' | 'philosophy' | 'film'>('anatoliaHero');

  // Philosophy Editing state
  const [editingPhil, setEditingPhil] = useState<PhilosophyCard | null>(null);
  const [showPhilModal, setShowPhilModal] = useState(false);

  // Mood Film Editing state
  const [editingFilm, setEditingFilm] = useState<MoodFilmItem | null>(null);
  const [showFilmModal, setShowFilmModal] = useState(false);

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

    const savedAnatoliaHero = localStorage.getItem('anatolia_hero_config');
    if (savedAnatoliaHero) {
      try {
        setAnatoliaHero(JSON.parse(savedAnatoliaHero));
      } catch (e) {
        console.error(e);
      }
    }

    const savedAnatoliaFooter = localStorage.getItem('anatolia_footer_config');
    if (savedAnatoliaFooter) {
      try {
        setAnatoliaFooter(JSON.parse(savedAnatoliaFooter));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveAnatoliaHero = (newConfig: AnatoliaHeroConfig) => {
    setAnatoliaHero(newConfig);
    localStorage.setItem('anatolia_hero_config', JSON.stringify(newConfig));
    alert('Anatolia 시네마틱 히어로/회사소개 애니메이션 설정이 성공적으로 저장되었습니다.');
  };

  const saveAnatoliaFooter = (newConfig: AnatoliaFooterConfig) => {
    setAnatoliaFooter(newConfig);
    localStorage.setItem('anatolia_footer_config', JSON.stringify(newConfig));
    alert('Anatolia 푸터 메뉴 및 워터마크 설정이 성공적으로 저장되었습니다.');
  };


  const saveSettings = (newSettings: BrandStorySettings) => {
    setSettings(newSettings);
    localStorage.setItem('brand_story_settings', JSON.stringify(newSettings));
  };

  // Hero Video Upload Handler
  const handleHeroVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('영상 파일은 페이지 로딩 속도를 위해 10MB 이하만 등록 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = { ...settings, heroVideoUrl: dataUrl };
      saveSettings(updated);
    };
    reader.readAsDataURL(file);
  };

  // Hero Poster Upload Handler
  const handleHeroPosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('포스터 이미지 파일 크기는 2MB 이하만 등록 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = { ...settings, heroPosterUrl: dataUrl };
      saveSettings(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHeroSection = () => {
    saveSettings(settings);
    alert('브랜드 히어로 및 비디오 설정이 저장되었습니다!');
  };

  // Philosophy Handlers
  const handleSavePhilCard = (e: FormEvent) => {
    e.preventDefault();
    if (!editingPhil) return;

    const updatedCards = settings.philosophyCards.map((card) =>
      card.id === editingPhil.id ? editingPhil : card
    );
    saveSettings({ ...settings, philosophyCards: updatedCards });
    setShowPhilModal(false);
  };

  const handlePhilImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPhil) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingPhil({ ...editingPhil, imageUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Mood Film Handlers
  const handleSaveFilm = (e: FormEvent) => {
    e.preventDefault();
    if (!editingFilm) return;

    const exists = settings.moodFilms.some((f) => f.id === editingFilm.id);
    let updatedFilms: MoodFilmItem[];
    if (exists) {
      updatedFilms = settings.moodFilms.map((f) => (f.id === editingFilm.id ? editingFilm : f));
    } else {
      updatedFilms = [editingFilm, ...settings.moodFilms];
    }

    saveSettings({ ...settings, moodFilms: updatedFilms });
    setShowFilmModal(false);
  };

  const handleDeleteFilm = (id: string) => {
    if (window.confirm('이 무드 필름 미디어를 삭제하시겠습니까?')) {
      const updated = settings.moodFilms.filter((f) => f.id !== id);
      saveSettings({ ...settings, moodFilms: updated });
    }
  };

  const handleFilmVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingFilm) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('영상 파일은 10MB 이하만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingFilm({ ...editingFilm, videoUrl: event.target?.result as string, mediaType: 'video' });
    };
    reader.readAsDataURL(file);
  };

  const handleFilmThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingFilm) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingFilm({ ...editingFilm, thumbnailUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Anatolia Style Admin Management Header & Tabs */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D6A56D] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#D81B60]" />
              Anatolia Cinematic & Footer CMS
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-white font-bold mt-1">
              아나톨리아 시네마틱 애니메이션 및 푸터 관리
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Anatolia 스타일 대형 비디오 줌, 스크롤 타이포그래피 Reveal, 거대 워터마크 푸터 메뉴를 설정합니다.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('anatoliaHero')}
            className={`px-5 py-3 rounded-xl transition-all ${
              activeTab === 'anatoliaHero'
                ? 'bg-[#D81B60] text-white shadow-lg shadow-[#D81B60]/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            🎬 Anatolia 시네마틱 히어로/소개
          </button>
          <button
            onClick={() => setActiveTab('anatoliaFooter')}
            className={`px-5 py-3 rounded-xl transition-all ${
              activeTab === 'anatoliaFooter'
                ? 'bg-[#D81B60] text-white shadow-lg shadow-[#D81B60]/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            🏛️ Anatolia Interactive Footer 메뉴
          </button>
          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-5 py-3 rounded-xl transition-all ${
              activeTab === 'heritage'
                ? 'bg-[#D81B60] text-white shadow-lg shadow-[#D81B60]/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            기본 헤리티지 비디오 설정
          </button>
        </div>
      </div>

      {/* Tab 1: Anatolia Hero & Intro Video Form */}
      {activeTab === 'anatoliaHero' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Anatolia 스크롤 마스크 비디오 & 타이틀 설정</h3>
              <p className="text-xs text-slate-500">랜딩/회사소개 첫 진입 시 보여질 시네마틱 비디오 및 대형 문구</p>
            </div>
            <button
              onClick={() => saveAnatoliaHero(anatoliaHero)}
              className="px-6 py-2.5 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              저장하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">대형 타이틀 (줄바꿈 구분 가능)</label>
              <textarea
                rows={3}
                value={anatoliaHero.introTitle}
                onChange={(e) => setAnatoliaHero({ ...anatoliaHero, introTitle: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D81B60]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">서브 슬로건 (상단 붉은 텍스트)</label>
              <input
                type="text"
                value={anatoliaHero.introSubtitle}
                onChange={(e) => setAnatoliaHero({ ...anatoliaHero, introSubtitle: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D81B60]"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-700">브랜드 철학 설명 문구</label>
              <textarea
                rows={2}
                value={anatoliaHero.introDescription}
                onChange={(e) => setAnatoliaHero({ ...anatoliaHero, introDescription: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D81B60]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">시네마틱 배경 MP4 비디오 URL 또는 직접 업로드</label>
              <input
                type="text"
                value={anatoliaHero.videoUrl}
                onChange={(e) => setAnatoliaHero({ ...anatoliaHero, videoUrl: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D81B60]"
                placeholder="https://cdn.example.com/video.mp4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">비디오 뱃지 텍스트</label>
              <input
                type="text"
                value={anatoliaHero.badgeText}
                onChange={(e) => setAnatoliaHero({ ...anatoliaHero, badgeText: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D81B60]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Anatolia Footer & Watermark Form */}
      {activeTab === 'anatoliaFooter' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Anatolia Interactive Footer 메뉴 & 워터마크 설정</h3>
              <p className="text-xs text-slate-500">푸터의 거대 배경 워터마크 텍스트 및 3개 컬럼 메뉴 링크 설정</p>
            </div>
            <button
              onClick={() => saveAnatoliaFooter(anatoliaFooter)}
              className="px-6 py-2.5 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              저장하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">푸터 배경 거대 워터마크 문구</label>
              <input
                type="text"
                value={anatoliaFooter.watermarkText}
                onChange={(e) => setAnatoliaFooter({ ...anatoliaFooter, watermarkText: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 font-serif font-bold uppercase focus:outline-none focus:border-[#D81B60]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">워터마크 하단 서브 타이라인</label>
              <input
                type="text"
                value={anatoliaFooter.subTagline}
                onChange={(e) => setAnatoliaFooter({ ...anatoliaFooter, subTagline: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D81B60]"
              />
            </div>
          </div>

          {/* Columns Editor */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800">푸터 내비게이션 컬럼 및 메뉴 관리</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {anatoliaFooter.columns.map((col, cIdx) => (
                <div key={col.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">컬럼 #{cIdx + 1} 제목</label>
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const newCols = [...anatoliaFooter.columns];
                        newCols[cIdx].title = e.target.value;
                        setAnatoliaFooter({ ...anatoliaFooter, columns: newCols });
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 font-bold focus:outline-none focus:border-[#D81B60]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">서브 메뉴 항목</label>
                    {col.links.map((link, lIdx) => (
                      <div key={link.id} className="flex gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newCols = [...anatoliaFooter.columns];
                            newCols[cIdx].links[lIdx].label = e.target.value;
                            setAnatoliaFooter({ ...anatoliaFooter, columns: newCols });
                          }}
                          placeholder="메뉴명"
                          className="w-1/2 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const newCols = [...anatoliaFooter.columns];
                            newCols[cIdx].links[lIdx].url = e.target.value;
                            setAnatoliaFooter({ ...anatoliaFooter, columns: newCols });
                          }}
                          placeholder="이동 URL (예: /brand)"
                          className="w-1/2 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legacy Heritage Form Tab */}
      {activeTab === 'heritage' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-amber-700">movie</span>
                브랜드 히어로 비디오 & 타이틀 설정 (Hero Media)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                공개 `/brand` 스토리 상단의 메인 배경 비디오, 태그라인, 헤드라인을 관리합니다.
              </p>
            </div>
            <button
              onClick={handleSaveHeroSection}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              히어로 설정 저장
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">상단 태그라인 (Tagline)</label>
              <input
                type="text"
                value={settings.heroTagline}
                onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">메인 카피 헤드라인 (Headline)</label>
              <textarea
                rows={2}
                value={settings.heroHeadline}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">서브 설명 문구 (Subheadline)</label>
              <textarea
                rows={3}
                value={settings.heroSubheadline}
                onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                히어로 배경 비디오 URL 또는 직접 업로드
              </label>
              <input
                type="text"
                value={settings.heroVideoUrl}
                onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4 또는 파일 선택"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono mb-2"
              />
              <label className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                <span className="material-symbols-outlined text-[16px]">video_file</span>
                MP4 비디오 파일 직접 업로드 (최대 10MB)
                <input
                  type="file"
                  accept="video/mp4, video/webm"
                  onChange={handleHeroVideoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                히어로 배경 포스터 이미지 (Video Poster)
              </label>
              <input
                type="text"
                value={settings.heroPosterUrl || ''}
                onChange={(e) => setSettings({ ...settings, heroPosterUrl: e.target.value })}
                placeholder="https://example.com/poster.jpg 또는 파일 선택"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs mb-2"
              />
              <label className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                <span className="material-symbols-outlined text-[16px]">image</span>
                포스터 이미지 파일 직접 업로드 (최대 2MB)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroPosterUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* 2. Brand Philosophy Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-amber-700">spa</span>
            브랜드 철학 카드 관리 ({settings.philosophyCards.length}개)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            원데이즈뷰티 브랜드의 3가지 핵심 철학 카드 제목, 이미지, 가치관 설명을 수정합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings.philosophyCards.map((card) => (
            <div key={card.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-200">
                <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                  {card.badge}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{card.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{card.description}</p>
              </div>
              <button
                onClick={() => {
                  setEditingPhil(card);
                  setShowPhilModal(true);
                }}
                className="w-full py-2 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                ✏️ 철학 카드 편집
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Mood Films Showcase Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-amber-700">play_circle</span>
              브랜드 무드 필름 & 비주얼 미디어 갤러리 ({settings.moodFilms.length}개)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              홍보 영상(MP4/유튜브) 및 비주얼 카드를 등록하여 고객에게 브랜드 분위기를 선사합니다.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingFilm({
                id: `film-${Date.now()}`,
                title: '',
                caption: '',
                mediaType: 'video',
                badge: 'Brand Film',
              });
              setShowFilmModal(true);
            }}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_video</span>
            + 새 무드필름 등록
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings.moodFilms.map((film) => (
            <div key={film.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 relative">
                <img src={film.thumbnailUrl} alt={film.title} className="w-full h-full object-cover opacity-80" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded">
                  {film.badge}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{film.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{film.caption}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingFilm(film);
                    setShowFilmModal(true);
                  }}
                  className="flex-1 py-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-lg hover:bg-slate-100"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteFilm(film.id)}
                  className="px-3 py-1.5 border border-rose-200 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Modal */}
      {showPhilModal && editingPhil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              브랜드 철학 카드 편집
            </h3>

            <form onSubmit={handleSavePhilCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">카드 제목</label>
                <input
                  type="text"
                  value={editingPhil.title}
                  onChange={(e) => setEditingPhil({ ...editingPhil, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">부제목 (Subtitle)</label>
                <input
                  type="text"
                  value={editingPhil.subtitle}
                  onChange={(e) => setEditingPhil({ ...editingPhil, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">뱃지 문구 (Badge)</label>
                <input
                  type="text"
                  value={editingPhil.badge || ''}
                  onChange={(e) => setEditingPhil({ ...editingPhil, badge: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">상세 설명</label>
                <textarea
                  rows={3}
                  value={editingPhil.description}
                  onChange={(e) => setEditingPhil({ ...editingPhil, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">대표 이미지 URL 또는 파일 업로드</label>
                <input
                  type="text"
                  value={editingPhil.imageUrl || ''}
                  onChange={(e) => setEditingPhil({ ...editingPhil, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-2"
                />
                <label className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  이미지 파일 업로드
                  <input type="file" accept="image/*" onChange={handlePhilImageUpload} className="hidden" />
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhilModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  저장 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mood Film Modal */}
      {showFilmModal && editingFilm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              무드 필름 미디어 등록 / 편집
            </h3>

            <form onSubmit={handleSaveFilm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">미디어 제목</label>
                <input
                  type="text"
                  value={editingFilm.title}
                  onChange={(e) => setEditingFilm({ ...editingFilm, title: e.target.value })}
                  placeholder="예: 원데이즈뷰티 시그니처 릴리즈 필름"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">미디어 유형</label>
                <select
                  value={editingFilm.mediaType}
                  onChange={(e) => setEditingFilm({ ...editingFilm, mediaType: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="video">비디오 영상 (MP4 / 재생 지원)</option>
                  <option value="image">이미지 비주얼 갤러리</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">영상 URL 또는 MP4 직접 파일 업로드</label>
                <input
                  type="text"
                  value={editingFilm.videoUrl || ''}
                  onChange={(e) => setEditingFilm({ ...editingFilm, videoUrl: e.target.value })}
                  placeholder="https://example.com/movie.mp4"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono mb-2"
                />
                <label className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">video_file</span>
                  MP4 영상 파일 업로드 (최대 10MB)
                  <input type="file" accept="video/mp4, video/webm" onChange={handleFilmVideoUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">썸네일 이미지 URL 또는 파일 업로드</label>
                <input
                  type="text"
                  value={editingFilm.thumbnailUrl || ''}
                  onChange={(e) => setEditingFilm({ ...editingFilm, thumbnailUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-2"
                />
                <label className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  썸네일 파일 업로드
                  <input type="file" accept="image/*" onChange={handleFilmThumbUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">설명 캡션 (Caption)</label>
                <textarea
                  rows={3}
                  value={editingFilm.caption}
                  onChange={(e) => setEditingFilm({ ...editingFilm, caption: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilmModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  저장 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
