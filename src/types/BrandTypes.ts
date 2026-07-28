export interface PhilosophyCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  badge?: string;
}

export interface MoodFilmItem {
  id: string;
  title: string;
  caption: string;
  mediaType: 'video' | 'image';
  videoUrl?: string; // Uploaded MP4 dataURL or Youtube/Vimeo/MP4 link
  thumbnailUrl?: string;
  badge?: string;
}

export interface BrandStorySettings {
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroVideoUrl: string; // Uploaded video file or video URL
  heroPosterUrl?: string;

  philosophyTitle: string;
  philosophySubtitle: string;
  philosophyCards: PhilosophyCard[];

  filmSectionTitle: string;
  filmSectionSubtitle: string;
  moodFilms: MoodFilmItem[];

  signatureQuote: string;
  signatureAuthor: string;
}

export const defaultBrandStorySettings: BrandStorySettings = {
  heroTagline: 'HERITAGE & MODERN DERMATOLOGY',
  heroHeadline: '시대를 뛰어넘는 자연의 지혜,\n피부 본연의 빛을 되찾다',
  heroSubheadline: '조선 시대 여성들의 지혜로운 한방 처방과 현대 피부 과학의 결합으로 탄생한 럭셔리 클린 뷰티',
  heroVideoUrl: 'https://cdn.coverr.co/videos/coverr-skincare-routine-and-serum-5192/1080p.mp4',
  heroPosterUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop',

  philosophyTitle: 'BRAND PHILOSOPHY & CRAFTSMANSHIP',
  philosophySubtitle: '원데이즈뷰티가 추구하는 3가지 핵심 아름다움의 가치',
  philosophyCards: [
    {
      id: 'phil-1',
      title: '자연 원료의 순수한 정수',
      subtitle: 'Natural Heritage',
      description: '쌀겨수, 인삼, 녹차, 매실 등 오랜 세월 검증된 자연 성분을 최고 등급 추출 기술로 정제합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1608248597260-50c39f70a784?q=80&w=800&auto=format&fit=crop',
      badge: 'Natural Ingredients',
    },
    {
      id: 'phil-2',
      title: '현대 스킨케어 공학의 혁신',
      subtitle: 'Clean & Dermatological Science',
      description: '민감성 피부 테스트 완료, 유해 성분 배제로 매일 안심하고 바를 수 있는 현대적 스킨케어 텍스처를 선사합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      badge: 'Modern Science',
    },
    {
      id: 'phil-3',
      title: '글로벌 모던 뷰티의 표준',
      subtitle: 'Global Luxury Standard',
      description: '미주, 유럽, 아시아 등 전 세계 60개국 이상의 고객들이 극찬한 K-뷰티 대표 럭셔리 브랜드로 자리매김했습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
      badge: 'Global Heritage',
    },
  ],

  filmSectionTitle: 'BRAND MOOD FILM & GALLERY',
  filmSectionSubtitle: '감각적인 영상과 이미지로 경험하는 원데이즈뷰티 오가닉 무드',
  moodFilms: [
    {
      id: 'film-1',
      title: '원데이즈뷰티 브랜드 필름 : 맑은 피부의 시작',
      caption: '자연에서 피어나는 은은한 생기, 맑고 고운 피부 비밀',
      mediaType: 'video',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-applying-facial-cream-5193/1080p.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      badge: 'Brand Film 4K',
    },
    {
      id: 'film-2',
      title: '원데이즈 맑은 쌀 선크림 시그니처 릴리즈',
      caption: '백탁 없이 투명하고 촉촉하게 스며드는 수분 자외선 차단제 스토리',
      mediaType: 'video',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-putting-serum-on-face-5194/1080p.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      badge: 'Signature Film',
    },
    {
      id: 'film-3',
      title: '인삼 아사이 베리 리바이브 세럼 뷰티 필름',
      caption: '깊은 영양감으로 주름과 피부 장벽을 탄탄하게 케어하는 보습 정수',
      mediaType: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
      badge: 'Visual Gallery',
    },
  ],

  signatureQuote: '화려한 겉모습보다 피부 본연의 건강함과 기품을 가꾸는 것이 진정한 뷰티의 완성입니다.',
  signatureAuthor: 'ONEDAYS BEAUTY ARTISTIC DIRECTOR',
};

// Anatolia Cinematic Animation & Interactive Footer Configurations
export interface AnatoliaFooterLink {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface AnatoliaFooterColumn {
  id: string;
  title: string;
  links: AnatoliaFooterLink[];
}

export interface AnatoliaFooterConfig {
  watermarkText: string;
  subTagline: string;
  columns: AnatoliaFooterColumn[];
  newsletterTitle: string;
  newsletterDescription: string;
  copyrightText: string;
  instagramUrl: string;
  youtubeUrl: string;
  vogueUrl: string;
}

export interface AnatoliaHeroConfig {
  introTitle: string;
  introSubtitle: string;
  introDescription: string;
  videoUrl: string;
  posterUrl: string;
  badgeText: string;
  ctaText: string;
  ctaLink: string;
  parallaxCards: {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
  }[];
}

export const defaultAnatoliaHeroConfig: AnatoliaHeroConfig = {
  introTitle: 'CRAFTING TIMELESS ELEGANCE',
  introSubtitle: 'ANATOLIA CINEMATIC BEAUTY',
  introDescription: '시대를 초월하는 독보적인 감성과 웅장한 건축적 아름다움을 담아낸 럭셔리 플래그십 클린 스킨케어 컬렉션.',
  videoUrl: 'https://cdn.coverr.co/videos/coverr-skincare-routine-and-serum-5192/1080p.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop',
  badgeText: 'ARCHITECTURAL BEAUTY',
  ctaText: 'EXPLORE COLLECTION',
  ctaLink: '/brand',
  parallaxCards: [
    {
      id: 'anatolia-1',
      title: 'THE ROYAL HERITAGE',
      category: 'COLLECTION I',
      imageUrl: 'https://images.unsplash.com/photo-1608248597260-50c39f70a784?q=80&w=800&auto=format&fit=crop',
      description: '자연 원료의 깊은 영양감과 독창적 시그니처 포뮬라의 결합',
    },
    {
      id: 'anatolia-2',
      title: 'DERMATOLOGICAL ARTISTRY',
      category: 'COLLECTION II',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      description: '빛을 머금은 듯 투명하게 빛나는 정교한 스킨 텍스처 오디세이',
    },
    {
      id: 'anatolia-3',
      title: 'GLOBAL CINEMATIC ESSENCE',
      category: 'COLLECTION III',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
      description: '세계적인 럭셔리 매직과 감각적 아우라의 완벽한 완성',
    },
  ],
};

export const defaultAnatoliaFooterConfig: AnatoliaFooterConfig = {
  watermarkText: 'ANATOLIA BEAUTY',
  subTagline: 'ARCHITECTURAL HIGH-FASHION BEAUTY HOUSE',
  columns: [
    {
      id: 'col-1',
      title: 'EXPLORE',
      links: [
        { id: 'l1', label: 'Company Heritage', url: '/company' },
        { id: 'l2', label: 'Brand Philosophy', url: '/brand' },
        { id: 'l3', label: 'Media & Editorial', url: '/media' },
        { id: 'l4', label: 'Flagship Shop', url: '/' },
      ],
    },
    {
      id: 'col-2',
      title: 'COLLECTIONS',
      links: [
        { id: 'l5', label: 'Signature Serums', url: '/' },
        { id: 'l6', label: 'Rice Sun Care', url: '/' },
        { id: 'l7', label: 'Ginseng Revital', url: '/' },
        { id: 'l8', label: 'Luxury Ritual Set', url: '/' },
      ],
    },
    {
      id: 'col-3',
      title: 'CUSTOMER CARE',
      links: [
        { id: 'l9', label: 'Terms of Service', url: 'terms' },
        { id: 'l10', label: 'Privacy Policy', url: 'privacy' },
        { id: 'l11', label: 'Business License Info', url: 'businessInfo' },
        { id: 'l12', label: 'Concierge Support', url: '/company' },
      ],
    },
  ],
  newsletterTitle: 'JOIN THE ANATOLIA CIRCLE',
  newsletterDescription: '프라이빗 컬렉션 프론트 뷰, 프라이빗 이벤트 및 독점 소식을 가장 먼저 받아보세요.',
  copyrightText: 'ANATOLIA BEAUTY HOUSE. ALL RIGHTS RESERVED.',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  vogueUrl: 'https://vogue.com',
};

