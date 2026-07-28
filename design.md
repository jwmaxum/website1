# Trendy UI/UX Design System & Layout Specification
> **버전**: v2.0 (Trendy & Modern Layout Architecture)  
> **목적**: 브랜딩 및 퍼블릭 레이아웃의 시각적 완성도(Luxury Modern & Bento Grid)를 최대화하며, 기존 백엔드/CMS 관리 기능 및 데이터 흐름을 100% 보존하면서 최신 UI/UX 트렌드를 적용하기 위한 레이아웃 디자인 시스템 명세서입니다.

---

## 1. Design Vision & Philosophy (디자인 비전 및 철학)

1. **Luxury Minimal & Dynamic High-Contrast (미니멀 럭셔리 & 고대비 에스테틱)**
   - 여백(Negative Space)을 과감히 활용하여 가독성과 럭셔리 브랜딩 이미지를 강조합니다.
   - 선명한 폰트 콘트라스트(Serif 타이틀 + Modern Sans-Serif 본문)와 딥 톤/크리스탈 글래스 효과의 조화를 이룹니다.

2. **Bento Grid & Asymmetric Layout Architecture (벤토 그리드 & 비대칭 레이아웃)**
   - 모듈화된 벤토 그리드(Bento Box Layout)를 도입하여 상호작용이 뛰어난 정보 배치와 시각적 즐거움을 제공합니다.
   - 정보 간 계층 구조를 카드 높이, 스팬(Span), 앰비언트 글로우(Ambient Glow)로 명확히 직관화합니다.

3. **Glassmorphism & Fluid Micro-Interactions (글래스모피즘 & 미세 애니메이션)**
   - `backdrop-blur`와 반투명 붕산 보더(Subtle Glass Border)를 조합하여 현대적인 깊이감(Depth)을 연출합니다.
   - 버튼, 카드, 모달 전환 시 Framer Motion / CSS Transitions 기반의 스프링 모션을 적용합니다.

4. **Zero Functionality Compromise (기존 백엔드 기능 100% 보존)**
   - 기존 백엔드 API, Supabase 스키마, 관리자 기능(CMS), 데이터 통신 구조 및 파이프라인은 일체 수정 없이, UI/UX 디자인 레이아웃 및 렌더링 계층만 고도화합니다.

---

## 2. Design Tokens & Color Palette (디자인 토큰)

### 2.1 Color Palette
| 구분 | 색상명 | Hex Code | 사용 목적 |
| :--- | :--- | :--- | :--- |
| **Primary (Brand)** | Deep Slate Charcoal | `#0F172A` | 메인 헤딩, 프라이머리 버튼 background |
| **Secondary Accent**| Indigo Violet / Rose Champagne | `#4F46E5` / `#E11D48` | 액션 포인트, 배지, 주요 링크 및 Focus Glow |
| **Surface (Background)**| Pure Clean Slate | `#F8FAFC` | 앱 전체 기본 배경 |
| **Surface Glass** | Translucent White Glass | `rgba(255, 255, 255, 0.75)` | Floating Header, Modal Overlay, Floating Cards |
| **Text Primary** | Obsidian Black | `#0F172A` | 본문 주요 텍스트, 타이틀 |
| **Text Secondary** | Muted Slate Gray | `#64748b` | 보조 설명글, 타임스탬프, 캡션 |
| **Border & Divider**| Subtle Light Border | `#E2E8F0` / `rgba(226, 232, 240, 0.6)` | 카드 구분선, Input Outline, Glass Edge |
| **Status Accent** | Emerald Green / Rose Red | `#10B981` / `#F43F5E` | 성공/경고/증감 수치 지표 |

### 2.2 Typography Hierarchy
- **Primary Serif**: `Bodoni Moda`, Serif (브랜드 로고, 스페셜 타이틀, Hero 대형 헤딩)
- **Primary Sans**: `DM Sans`, `Inter`, sans-serif (기본 UI, 대시보드 텍스트, 버튼 및 데이터 테이블)
- **Scale**:
  - `Display Large`: 3.5rem (56px) / tracking-tight / font-serif
  - `Heading 1`: 2.25rem (36px) / font-bold / tracking-tight
  - `Heading 2`: 1.5rem (24px) / font-semibold
  - `Subheading`: 1.125rem (18px) / font-medium / text-slate-600
  - `Body Standard`: 0.875rem (14px) / leading-relaxed
  - `Caption & Badge`: 0.75rem (12px) / tracking-wider / uppercase

### 2.3 Shadow & Glass Effects
- **Glass Drop Blur**: `backdrop-blur-md bg-white/75 border border-slate-200/60`
- **Subtle Card Shadow**: `shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)]`
- **Hover Glow Elevation**: `hover:shadow-[0_12px_30px_-6px_rgba(79,70,229,0.15)] transition-all duration-300`

---

## 3. Public Site Layout Architecture (퍼블릭 브랜드/쇼핑몰 레이아웃)

```
┌─────────────────────────────────────────────────────────────┐
│ Floating Glass Navbar (Brand Logo | Nav Links | Cart | Login)│
├─────────────────────────────────────────────────────────────┤
│ Hero Section (Full-bleed Visual / Dynamic Typography Slider)│
├─────────────────────────────────────────────────────────────┤
│ Bento Grid Showcase (Featured Products / Editorial / Stats)  │
│  ┌─────────────────────────┐ ┌───────────────┐ ┌───────────┐ │
│  │ Hero Product Card (2x2) │ │ Story Card    │ │ Live Tag  │ │
│  └─────────────────────────┘ └───────────────┘ └───────────┐ │
│  ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│  │ Quick Shop Carousel     │ │ Brand Philosophy Video Card │ │
│  └─────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Dynamic Product Showcase (Floating Category Filter & Cards)  │
├─────────────────────────────────────────────────────────────┤
│ Footer (Brand Story | Quick Links | Newsletter | Copyright) │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Floating Glass Navbar
- **위치 & 효과**: `fixed top-0 left-0 right-0 z-50`, 스크롤 시 반투명 Glassmorphism backdrop-blur 적용.
- **구성**:
  - Left: 럭셔리 타입 브랜드 로고 (`Bodoni Moda`, uppercase, tracking-widest).
  - Center: 메뉴 (Shop, Brand Story, Media Center, Customer Support) - hover 시 하단 액센트 indicator 커서 라인 생성.
  - Right: 글로벌 검색 아이콘, 장바구니 버튼 (카운트 뱃지 포함), 마이페이지/로그인 프로필 칩.

### 3.2 Immersive Hero Section
- **레이아웃**: 화면 높이 85vh~90vh의 임팩트 있는 비대칭 레이아웃.
- **인터랙션**:
  - 배경 시네마틱 미디어/슬라이더 + 텍스트 Fade-in Up 애니메이션.
  - Call To Action (CTA) 버튼: Solid Primary Button과 Glass Blur Secondary Button의 대비.

### 3.3 Bento Grid Feature Section
- **구성**: 12-Column Responsive Grid.
  - **Large Hero Card (Col 8 / Row 2)**: 시그니처 대표 상품 비주얼과 Hover 시 Quick Add-to-Cart Floating Button 노출.
  - **Brand Philosophy Card (Col 4 / Row 1)**: 은은한 앰비언트 미니 그래디언트 배후에 위치한 시그니처 텍스트 스토리카드.
  - **Interactive Specs Card (Col 4 / Row 1)**: 실시간 제품 리뷰 및 럭셔리 카테고리 칩 태그 카드.

### 3.4 Interactive Shop & Catalog View
- **카테고리 탭**: Floating Capsule Pill 형태의 카테고리 선택 바.
- **상품 카드 (Product Card)**:
  - 1:1 Aspect Ratio 프리미엄 이미지 컨테이너.
  - Hover 효과: 이미지 미세 확대 (`scale-105`), Quick View & Wishlist 둥근 Floating Icon 슬라이드 인.
  - 가격 표기: Bold Slate Text + 포인트 할인 뱃지(적용 시).

---

## 4. Admin CMS Layout Architecture (관리자 시스템 레이아웃)

> ⚠️ **원칙**: 기존 `AdminLayout.tsx` 및 각 관리 페이지의 데이터 바인딩, Supabase CRUD, 다국어 i18n, 접근 권한 체크 로직은 동일하게 유지되며, 오직 시각적 완성도 및 레이아웃 그리드, 대시보드 카드 디자인만 현대적 트렌드로 개선합니다.

```
┌─────────────────────────────────────────────────────────────┐
│ Top Bar (Breadcrumbs | Global Command Search | Admin Profile)│
├──────────────┬──────────────────────────────────────────────┤
│ Sidebar      │ Main Canvas Area                             │
│              │ ┌──────────────────────────────────────────┐ │
│ - Dashboard  │ │ Executive KPI Sparkline Cards (4 Columns)│ │
│ - Site Mgmt  │ └──────────────────────────────────────────┘ │
│ - Content    │ ┌──────────────────────┐ ┌─────────────────┐ │
│ - Product    │ │ Analytics Chart      │ │ Recent Activity │ │
│ - Shop Mgmt  │ └──────────────────────┘ └─────────────────┘ │
│ - Customer   │ ┌──────────────────────────────────────────┐ │
│ - SEO        │ │ Data Table with Glass Action Header      │ │
│ - System     │ └──────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────┘
```

### 4.1 Modernized Admin Sidebar
- **디자인**: Sleek Slate Dark / Glass Hybrid 톤 (`bg-slate-900` or `bg-slate-950`).
- **상태 표기**:
  - Active Menu Item: 왼쪽 Accent Line 인디케이터 + Subtle Background Highlight (`bg-indigo-600/10 text-indigo-400`).
  - Menu Category: Muted Uppercase Section Headers (`text-[10px] text-slate-500 font-semibold tracking-wider`).
- **접기/펴기 기능**: 반응형 축소 아이콘 모드 지원.

### 4.2 Admin Top Command Header
- **Breadcrumb Nav**: 현재 위치 경로를 칩 형태로 명확히 안내 (`Dashboard > Product Management`).
- **Global Search (`Cmd + K`)**: 메뉴 및 데이터 즉시 검색 창 (UI 스펙 명시).
- **Quick Status Indicators**: 실시간 API 연결 상태 뱃지 + 알림 징후 Bell Icon.

### 4.3 KPI Overview Cards (Bento Style)
- **4-Column Responsive Layout**:
  - 카드 1: 오늘 방문자 수 (Sparkline 미니 그래프 + 전일 대비 % 뱃지)
  - 카드 2: 오늘 주문 건수 및 총 매출 금액
  - 카드 3: 신규 가입 회원 수 및 Active User 비율
  - 카드 4: 미처리 문의 / 배송 준비 중 건수 (경고/안내 색상 라벨)
- **카드 스타일**: Clean White Surface, Soft Border, Hover 시 Elevated Depth 상승.

### 4.4 High-Efficiency Data Table Layout
- **테이블 헤더**: Sticky Header + Quick Filter Chips + Search Input Bar.
- **로우(Row) 디자인**: 넉넉한 핑거/마우스 클릭 영역, Hover Highlight (`hover:bg-slate-50/80`).
- **상태 태그 Badge**: Pill Shape (예: `Processing` - Yellow / `Completed` - Green / `Cancelled` - Red).
- **Slide-over Right Panel**: 상세 보기/수정 시 기존 통화면 전환 대신 우측 Slide-over Drawer UI 적용이 가능하도록 레이아웃 구역 명시.

---

## 5. Micro-Interactions & Animation Rules

1. **Hover Transitions**:
   - `transition-all duration-200 ease-out`
   - 버튼/카드 hover 시 `transform: translateY(-2px)` 및 앰비언트 섀도우 확장.

2. **Modal & Slide-over Transitions**:
   - Modal Open: Fade-in backdrop + Scale Up `from-95 to-100`.
   - Slide-over: Right-to-left Smooth Slide `translateX(0)`.

3. **Loading Skeleton States**:
   - 데이터 로딩 시 Spinner 대신 Ambient Shimmer Skeleton UI 사용 (`animate-pulse bg-slate-200/80 rounded-md`).

---

## 6. Responsive Breakpoints & Accessibility (반응형 및 접근성)

### 6.1 Standard Breakpoints
- **Mobile (`sm`)**: `< 640px` (Single column stacked layout, Bottom Sheet drawer)
- **Tablet (`md`)**: `640px ~ 1024px` (2-Column Bento Grid, Collapsible sidebar)
- **Desktop (`lg` / `xl`)**: `1024px ~ 1536px` (Standard Multi-column Bento Grid)
- **Ultra-wide (`2xl`)**: `> 1536px` (Max container width centered `max-w-7xl` or `max-w-[1600px]`)

### 6.2 UX Accessibility (WCAG 2.1 AA)
- 모든 인터랙티브 요소는 `focus-visible:ring-2 focus-visible:ring-indigo-500` 포커스 링 보장.
- 텍스트와 배경 간 минимальный 색상 대비 비율 4.5:1 이상 유지.
- 버튼 및 아이콘 전용 요소에 `aria-label` 명시.

---

## 7. Summary & Implementation Verification Checklist

- [x] **트렌디 디자인 가이드**: Bento Grid, Glassmorphism, Luxury Modern Typography 정의 완료.
- [x] **퍼블릭 / 백오피스 레이아웃 스펙 분리 명시**: 브랜드 시각적 전달력 강화 및 CMS 작업 효율성 극대화.
- [x] **백엔드 기능 보존**: 기존 데이터 스키마 및 관리자 파이프라인 변경 없이 100% 프론트엔드/UI/UX 명세 유지.
