export interface SEOSettings {
  // 1. Meta Core Tags
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  author: string;
  canonicalUrl: string;

  // 2. Open Graph (Social Sharing Kakao/Naver/Facebook)
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogType: string;

  // 3. Search Engine Verification Meta Keys
  googleSiteVerification: string;
  naverSiteVerification: string;

  // 4. Robots Directives
  robotsIndex: 'index, follow' | 'noindex, nofollow' | 'index, nofollow';

  // 5. JSON-LD Structured Data Enable
  enableStructuredData: boolean;
}

export const defaultSEOSettings: SEOSettings = {
  metaTitle: '원데이즈뷰티 (Onedays Beauty) | 전통 한방과 현대 피부 과학의 럭셔리 클린 뷰티',
  metaDescription: '맑고 단아한 뷰티 지혜를 현대적 과학 처방으로 재해석한 K-뷰티 대표 화장품 브랜드 원데이즈뷰티 공식몰입니다.',
  metaKeywords: '원데이즈뷰티, 맑은쌀선크림, 인삼세럼, 화장품, Onedays Beauty, 클린뷰티, K-Beauty',
  author: '주식회사 원데이즈뷰티',
  canonicalUrl: 'https://onedaysbeauty.com',

  ogTitle: '원데이즈뷰티 (Onedays Beauty) - 맑은 피부의 시작',
  ogDescription: '자연의 정성과 현대 피부 과학이 선사하는 빛나는 피부 본연의 기품',
  ogImageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop',
  ogType: 'website',

  googleSiteVerification: 'google-site-verification-token-example',
  naverSiteVerification: 'naver-site-verification-token-example',

  robotsIndex: 'index, follow',
  enableStructuredData: true,
};
