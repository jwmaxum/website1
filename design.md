# Luxury Fashion House UI/UX Design System & Layout Specification
> **버전**: v3.0 (High Fashion & Luxury Flagship Aesthetics)  
> **목적**: 쇼핑몰을 넘어 **"고급 뷰티/패션 플래그십 매장(Dior Beauty, Tom Ford, Chanel, YSL Beauty)"**과 같은 차별화된 럭셔리 하우스 경험을 제공합니다. 기존 백엔드/CMS 관리 기능 및 데이터 흐름은 100% 보존하면서, 딥 블랙, 펠벳 핑크, 로즈 골드 컬러 시스템과 에디토리얼 레이아웃을 도입합니다.

---

## 1. Design Vision & Brand Keywords

### 1.1 Brand Aesthetics & Inspiration
- **참고 브랜드**: Dior Beauty, Tom Ford, Chanel, YSL Beauty, Charlotte Tilbury, Hermes Beauty
- **핵심 키워드**: 
  - `Deep Black` / `Velvet Pink` / `Rose Gold`
  - `Luxury Editorial` / `High Fashion` / `Premium White Space`
  - `Elegant Motion` / `Ambient Glow`

### 1.2 Core Experience Principles
1. **Flagship Sanctuary Experience**: 일반 커머스 쇼핑몰의 이미지를 벗어나, 럭셔리 브랜드의 가치와 스토리를 시각적으로 전달하는 매거진/에디토리얼 구성.
2. **High-Contrast Dark Elegance**: 딥 블랙 배경(`#050505`, `#0B0B0B`) 위에서 빛나는 벨벳 핑크(`#D81B60`)와 로즈 골드(`#D6A56D`) 포인트.
3. **Zero Backend Compromise**: 기존 백엔드 CRUD, Supabase 데이터 파이프라인, API 통신 및 관리자 콘솔 구조는 100% 유지하며 시각적/인터랙션 UI 계층만 럭셔리 테마로 고도화.

---

## 2. Color System & Design Tokens

### 2.1 Brand Color Palette
| 토큰명 | Hex Code | 사용 목적 및 연출 효과 |
| :--- | :--- | :--- |
| **Primary Black** | `#050505` | 메인 럭셔리 배경, Hero 배경, Pure Dark Footer |
| **Luxury Pink** | `#D81B60` | 메인 브랜드 Accent, CTA 버튼, Active Highlight, Glow |
| **Deep Rose** | `#A80F48` | Hover Gradient, Deep Accent, Shadow Tint |
| **Rose Gold** | `#D6A56D` | 럭셔리 배지, Divider, 프리미엄 아이콘, Subtle Border |
| **Dark Background** | `#0B0B0B` | 메인 섹션 배경 |
| **Surface Dark** | `#141414` | 럭셔리 카드, 서페이스 컨테이너 |
| **Light Surface** | `#1E1E1E` | Hover Card Background, Modal Container |
| **Text Primary** | `#FAFAFA` | 고대비 본문, 타이틀 |
| **Text Secondary** | `#B7B7B7` | 보조 설명글, 캡션, 서브 헤딩 |

### 2.2 Luxury Gradient & Ambient Effects
- **Background Gradient**: `linear-gradient(180deg, #050505 0%, #120812 50%, #050505 100%)`
- **Ambient Pink Glow**: `radial-gradient(circle at center, rgba(216,27,96,0.15) 0%, transparent 70%)`
- **Rose Gold Edge Border**: `border border-[#D6A56D]/30 shadow-[0_4px_20px_rgba(214,165,109,0.1)]`

---

## 3. Typography Architecture

### 3.1 Font Families
- **Display & Headings**: `Cormorant Garamond`, `Canela`, `Playfair Display`, `Bodoni Moda` (Serif)
- **Body & UI Elements**: `Inter`, `DM Sans`, sans-serif
- **Brand Logo Typography**: Wide Tracking (`letter-spacing: 0.25em`), Uppercase, Serif

### 3.2 Typography Scale
- **Cinematic Display**: 4.5rem (72px) / Tracking-widest / Serif
- **Editorial Heading 1**: 3rem (48px) / font-serif / leading-tight
- **Section Heading 2**: 2rem (32px) / font-serif
- **Subheading**: 1.125rem (18px) / text-[#B7B7B7] / tracking-wide
- **Body Text**: 0.875rem (14px) / text-[#FAFAFA] / leading-relaxed

---

## 4. Public Site Layout Architecture (High Fashion Flagship)

```
┌─────────────────────────────────────────────────────────────┐
│ Floating Transparent Navbar -> Scroll: Black Glass Blur     │
├─────────────────────────────────────────────────────────────┤
│ 100vh Cinematic Hero (Black + Pink Ambient Glow + Motion)   │
├─────────────────────────────────────────────────────────────┤
│ Brand Story Section (Philosophy / Luxury Heritage Image)    │
├─────────────────────────────────────────────────────────────┤
│ Signature Collection (Luxury Masonry Showcase Layout)        │
├─────────────────────────────────────────────────────────────┤
│ Luxury Editorial Section (Vogue Magazine Magazine Layout)   │
├─────────────────────────────────────────────────────────────┤
│ Best Seller Showcase (Dark Cards + Rose Gold Badges)        │
├─────────────────────────────────────────────────────────────┤
│ Cinematic Video & Customer Experience                       │
├─────────────────────────────────────────────────────────────┤
│ Editorial Instagram Gallery & Newsletter Sign-up            │
├─────────────────────────────────────────────────────────────┤
│ Pure Black Footer (Rose Gold Dividers & Legal Links)        │
└─────────────────────────────────────────────────────────────┘
```

### 4.1 Floating Transparent Navbar
- **상태 변화**: 
  - 기본: `bg-transparent text-white border-b border-white/10`
  - 스크롤 시: `bg-[#050505]/90 backdrop-blur-md border-b border-[#D6A56D]/20 shadow-2xl`
- **구성**:
  - **Left**: 럭셔리 로고 (`ONEDAYS BEAUTY` / Wide Tracking).
  - **Center**: Navigation Links (`HOME`, `BRAND`, `COLLECTION`, `SHOP`, `JOURNAL`, `CONTACT`) — Hover 시 Pink Underline Animation.
  - **Right**: Search, Wishlist, Cart (Badge Count), Member Login.

### 4.2 Cinematic Full-Screen Hero (100vh)
- **구성**: 화면 전체를 채우는 100vh 대형 비주얼.
- **좌측**: High Fashion Typography (`Discover Luxury Beauty Beyond Skin`).
- **우측**: 시네마틱 럭셔리 미디어/영상.
- **CTA 버튼**: Black Fill + Pink Border (`border-[#D81B60]`) -> Hover 시 Velvet Pink Fill (`bg-[#D81B60] text-white`).

### 4.3 Luxury Masonry Signature Collection
- 기존 단순 그리드 대신 **Masonry 비율(비대칭 에디토리얼 파놀리)**로 시각적 다채로움 극대화.
- 대형 이미지 스팬과 여백의 미(Premium White/Dark Space) 연출.

### 4.4 Magazine-Style Editorial Section
- **Vogue / Harper's Bazaar 감성**: Large Campaign Image + Elegant Editorial Typography + Discover Feature.

### 4.5 High-End Product Cards
- **카드 배경**: `#141414` (Surface Dark) + `#1E1E1E` Hover.
- **배지**: `Rose Gold Badge` (`bg-[#D6A56D] text-[#050505] font-bold`).
- **가격 표기**: `Cormorant Garamond` Serif 타이포그래피 (예: `₩89,000`).
- **Hover Motion**: Image Scale 1.08 + Pink Ambient Glow Elevation + Rose Gold Border Accent.

---

## 5. Admin CMS Layout (High Fashion Dark Theme Integration)

> ⚠️ **원칙**: CRUD, Supabase 연동, 인증, 권한 관리, 대시보드 데이터 파이프라인 등 백엔드 기능 100% 유지. 시각적 테마만 블랙/핑크 럭셔리 테마로 맞춤 적용.

- **Sidebar**: `#111111` 배경 + Pink (`#D81B60`) Active Line Indicator.
- **Topbar**: Black Glass Blur + Rose Gold Accent Divider.
- **KPI Overview Cards**: Dark Surface (`#141414`) + Pink Highlight Badge + White Clean Typography.
- **Data Table**: Dark Theme + Hover Pink Tint (`hover:bg-[#D81B60]/10`).
- **Action Buttons**: Primary Black / Pink Fill 버튼 조합.
- **Analytics Charts**: Pink, Rose Gold, White 계열 시그니처 포인트 컬러 적용.

---

## 6. Motion & Interaction Rules

1. **Card & Image Zoom**:
   - Card Hover: `scale(1.02)` / Image Hover: `scale(1.08)` transition `duration-500 ease-out`.
2. **Button Interactions**:
   - Pink Outline -> Velvet Pink Fill (`bg-[#D81B60]`) with Soft Glow.
3. **Scroll Reveal & Parallax**:
   - Framer Motion / CSS Transitions 기반 Fade In Up & Parallax Reveal 효과.

---

## 7. Summary & Update Verification

- [x] `new_design.md`의 새로운 럭셔리 패션 하우스(Dior, Tom Ford, Chanel 스타일) 콘셉트를 `design.md`에 완벽히 통합/정리 완료.
- [x] **Color Tokens**: Primary Black (`#050505`), Velvet Pink (`#D81B60`), Rose Gold (`#D6A56D`), Dark Surface (`#141414`) 명세 적용.
- [x] **백엔드/CMS 보존**: 기존 관리자 파이프라인 및 백엔드 로직 100% 유지 전제 명시.
