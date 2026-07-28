# ONEDAYS BEAUTY — Luxury Fashion House UI/UX Design System Specification
> **버전**: v3.2 (Final Implementation Standard)  
> **브랜드명**: **원데이즈뷰티 (ONEDAYS BEAUTY / Onedays Beauty)**  
> **상태**: 100% 구현 완료 (Clean Lint Passed)

---

## 1. Design Vision & Brand Aesthetics

### 1.1 Flagship Sanctuary Concept
- **콘셉트**: 단순한 쇼핑몰을 넘어 **"Dior Beauty, Tom Ford, Chanel, YSL Beauty"**와 같은 **고급 뷰티/패션 하우스의 플래그십 매장** 경험을 제공합니다.
- **핵심 키워드**:
  - `Deep Black (#050505)`
  - `Luxury Velvet Pink (#D81B60)`
  - `Deep Rose (#A80F48)`
  - `Rose Gold (#D6A56D)`
  - `Luxury Editorial Layout`
  - `High Fashion Aesthetics`

---

## 2. Color System & Design Tokens

| 토큰명 | Hex Code | 구현 및 사용처 |
| :--- | :--- | :--- |
| **Primary Black** | `#050505` | 메인 풀스크린 캔버스, Hero 배경, Pure Black Footer |
| **Luxury Velvet Pink** | `#D81B60` | 메인 브랜드 Accent, Primary CTA, Active Indicators, Glow |
| **Deep Rose** | `#A80F48` | CTA Hover, Deep Accent, Shadow Tint |
| **Rose Gold** | `#D6A56D` | 럭셔리 배지, Divider, 세리프 타이포그래피 포인트, Subtle Border |
| **Background Dark** | `#0B0B0B` | 섹션 세컨더리 다크 배경 |
| **Surface Dark** | `#141414` | 럭셔리 카드 컨테이너, 백오피스 KPI 카드 배경 |
| **Light Surface** | `#1E1E1E` | Hover Card State, 모달 컨테이너 |
| **Text Primary** | `#FAFAFA` | 메인 텍스트, 타이틀 |
| **Text Secondary** | `#B7B7B7` | 보조 설명글, 서브 헤딩 |

---

## 3. Typography Architecture

- **Display & Headings**: `Cormorant Garamond`, `Playfair Display` (Serif)
- **Body & UI Controls**: `Inter`, sans-serif
- **Brand Logo Typography**: Uppercase, Wide Tracking (`letter-spacing: 0.25em`), Serif
- **Price Typography**: `Cormorant Garamond` (예: `₩15,300`, `₩89,000`)

---

## 4. Implemented Public Layout Architecture

### 4.1 Floating Transparent Header -> Scroll Black Glass Blur
- **상태 변화**:
  - 스크롤 전: `bg-transparent text-white` (100vh Hero 이미지와 일체감)
  - 스크롤 후: `bg-[#050505]/90 backdrop-blur-md border-b border-[#D6A56D]/20 shadow-2xl`
- **구조**:
  - **Left**: Navigation Links (`COMPANY`, `BRAND`, `MEDIA`, `SHOP`) — Active 핑크 Underline.
  - **Center**: 브랜드 로고 (`ONEDAYS BEAUTY`).
  - **Right**: 언어 선택기 (i18n), 장바구니 모달 트리거.
  - **관리자 콘솔 경로**: 퍼블릭 헤더/모바일 메뉴에서는 **숨김 처리**되며, `도메인/admin` 직접 접속 지원.

### 4.2 100vh Cinematic Hero
- Full-screen 100vh 비주얼, 핑크 앰비언트 글로우, 고대비 타이포그래피.
- Primary CTA: Velvet Pink Fill (`bg-[#D81B60]`), Secondary CTA: Rose Gold Outline.

### 4.3 Luxury Masonry Signature Collection
- 비대칭 Masonry 이미지 비율 및 대형 서페이스 카드 배치.

### 4.4 Magazine-Style Editorial Section
- Vogue / Harper's Bazaar 감성의 대형 화보와 에디토리얼 아티클 커스텀 블록.

### 4.5 Product Catalog & Cards
- `#141414` Dark Card Surface + Rose Gold Badges (`bg-[#D6A56D] text-[#050505]`) + Velvet Pink Glow Hover.

### 4.6 Pure Black Luxury Footer
- `#050505` 배경 + Rose Gold 구분선 + 뉴스레터 구독 + 멀티 컬럼 링크.

---

## 5. Implemented Admin CMS Layout

- **접속 경로**: `도메인/admin` (미인증 시 `/admin/login` 자동 리다이렉트).
- **Sidebar**: `#111111` 배경 + Velvet Pink (`#D81B60`) Active Line Indicator.
- **Topbar**: Black Glass Blur + Rose Gold Divider Accent.
- **KPI Cards & Tables**: `#141414` Dark Surface + `#D81B60` Highlight + Clean White Typography.
- **백엔드 로직 100% 보존**: Supabase CRUD, API 통신, 주문/고객/제품/미디어 데이터 파이프라인 무손상 보존.
