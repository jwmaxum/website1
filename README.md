# 💎 ONEDAYS BEAUTY — Global Luxury Flagship & Back-office CMS

> **원데이즈뷰티 (ONEDAYS BEAUTY / Onedays Beauty)** 공식 글로벌 웹사이트 및 통합 관리자 백오피스 CMS 프로젝트 문서입니다.  
> 본 프로젝트는 **Dior Beauty, Tom Ford, Chanel, YSL Beauty**와 같은 하이 패션 플래그십 매장의 디자인 감성(Deep Black, Velvet Pink, Rose Gold)을 프론트엔드에 구현하였으며, 완벽하게 연동되는 Supabase 백엔드 파이프라인 및 백오피스 CMS를 탑재하고 있습니다.

---

## 📸 프로젝트 주요 스펙 요약 (Summary)

- **브랜드명**: 원데이즈뷰티 (ONEDAYS BEAUTY)
- **프론트엔드 스택**: React 18, TypeScript, TailwindCSS v4, React Router v6
- **백엔드/DB 스택**: Supabase (PostgreSQL, RLS 보안 정책, OAuth 2.0, REST API QueryBuilder)
- **결제 & 서비스 파이프라인**: Toss Payments SDK, Resend Email API, CJ대한통운 택배 추적
- **관리자 접속 경로**: `https://도메인/admin` (퍼블릭 UI 내 버튼 숨김 처리)
- **배포 및 CI/CD**: GitHub Actions, Cloudflare Pages (Node.js v24)
- **품질 검증**: `tsc --noEmit` Lint Passed (**오류 0건**)

---

## 🎨 1. Front End Architecture & Design System

### 1.1 Luxury Fashion House Design Tokens
| 토큰명 | Hex Code | 용도 및 연출 효과 |
| :--- | :--- | :--- |
| **Primary Black** | `#050505` | 메인 풀스크린 캔버스, 100vh Hero, Pure Black Footer |
| **Luxury Velvet Pink** | `#D81B60` | 브랜드 메인 Accent, Primary CTA, Active Indicator, Glow |
| **Deep Rose** | `#A80F48` | CTA Hover, Deep Accent, Shadow Tint |
| **Rose Gold** | `#D6A56D` | 럭셔리 배지, Divider, 세리프 타이포그래피 포인트 |
| **Background Dark** | `#0B0B0B` | 섹션 세컨더리 다크 배경 |
| **Surface Dark** | `#141414` | 럭셔리 카드 컨테이너, 백오피스 KPI 카드 배경 |
| **Light Surface** | `#1E1E1E` | Hover Card State, 모달 컨테이너 |
| **Text Primary** | `#FAFAFA` | 고대비 메인 타이틀 & 본문 |
| **Text Secondary** | `#B7B7B7` | 서브 헤딩, 캡션 |

### 1.2 Typography
- **Display & Headings**: `Cormorant Garamond`, `Playfair Display` (Serif)
- **Body & Controls**: `Inter`, sans-serif
- **Brand Logo**: Uppercase, Wide Tracking (`letter-spacing: 0.25em`)

### 1.3 Public Layout Structure
1. **Floating Transparent -> Scroll Black Glass Blur Header (`PublicLayout.tsx`)**:
   - 스크롤 전: `bg-transparent text-white` (Hero 비주얼과 일체감)
   - 스크롤 후: `bg-[#050505]/90 backdrop-blur-md border-b border-[#D6A56D]/20 shadow-2xl`
   - 퍼블릭 메뉴에서 관리자 버튼 **숨김 처리** (일반 고객 경험 보호).
2. **100vh Cinematic Hero (`LandingPage.tsx`)**:
   - 풀스크린 비주얼, 핑크 앰비언트 글로우, 고대비 타이포그래피, 듀얼 CTA 버튼.
3. **Luxury Masonry Signature Collection**:
   - 비대칭 메이슨리 에디토리얼 파놀리 레이아웃.
4. **Vogue Magazine Editorial Section**:
   - 보그 라이프스타일 매거진 감성의 대형 화보 및 브랜드 필로소피 섹션.
5. **Product Collection Catalog**:
   - `#141414` Dark Card Surface + Rose Gold 뱃지 (`bg-[#D6A56D] text-[#050505]`) + Velvet Pink Glow.
6. **Pure Black Footer**:
   - `#050505` 배경 + Rose Gold 구분선 + 멀티 컬럼 링크 + 뉴스레터 구독.

### 1.4 Customer Buying & Account Experience
- **구매자 마이페이지 (`CustomerMyPage.tsx`)**:
  - 이메일 회원가입 및 소셜 로그인 (Google, Naver OAuth).
  - 내 주문 내역 및 택배 실시간 위치 추적.
  - 저장 배송지 주소 자동 맵핑 조회.
  - 회원 등급 (BRONZE ➔ SILVER ➔ GOLD VIP) 및 적립금/쿠폰 확인.
- **장바구니 & 결제 모달 (`CartModal.tsx`)**:
  - 수량 조절, 단품 삭제, 회원/비회원 주문 지원.
  - 이메일 입력 시 기존 배송지 주소 자동 채우기.
  - Toss Payments 결제 수단 (카드, 가상계좌, 간편결제) 및 결제 승인.
- **글로벌 다국어 지원 (i18n)**:
  - 한국어(ko), 영어(en), 일본어(ja), 중국어(zh), 스페인어(es), 인도네시아어(id), 아랍어(ar - RTL 지원) 7개 국어 지원.

---

## 🛠️ 2. Back End & Database Architecture

### 2.1 Supabase QueryBuilder & Custom REST Engine (`src/lib/supabaseClient.ts`)
- `@supabase/supabase-js` 없이 자체 **`SupabaseQueryBuilder`** 클래스를 구현하여 REST API 메서드 체이닝 및 비동기 파이프라인 완벽 지원:
  - `.select()`, `.insert()`, `.update()`, `.order()`, `.eq()`, `auth.signInWithOAuth()`
  - `PromiseLike<{ data: any, error: any }>` 구현으로 `await` 직접 처리.

### 2.2 Database Schema (`supabase_schema.sql`)
- **`customer_users`**: 구매자 회원 정보, 회원 등급, 적립금, OAuth 프로필.
- **`customer_addresses`**: 구매자별 저장 배송지 주소 맵핑.
- **`products`**: 제품 코드, 카테고리, 브랜드, 가격, 할인가, 재고, 베스트셀러 여부, 판매 상태.
- **`orders`**: 주문 번호, 고객 정보, 주문 품목 배열, 결제 금액, 배송 상태, 송장번호.
- **`payments`**: Toss Payments 결제 승인 13개 항목 (order_id, user_id, pg, payment_key, transaction_id, amount, vat, status, method, approved_at 등).
- **`staff_users`**: 백오피스 관리자 및 직원 계정, 비밀번호 암호화(SHA-256), 메뉴별 권한 JSON.
- **`media_posts`**: 미디어 센터 게시물 (공지, 뉴스, ESG 보고서 PDF 첨부).
- **`support_inquiries`**: 1:1 고객 문의 내역 및 답변 상태.

### 2.3 Key Backend Services
- **결제 서비스 (`tossPayments.ts`)**: Toss Payments 승인 및 결제 취소/환불 내역 파이프라인.
- **이메일 서비스 (`emailService.ts`)**: Resend API 연동 (구매 확인서, 1:1 문의 답변 이메일 전송).
- **택배 추적 서비스 (`courierTrackingService.ts`)**: CJ대한통운 등 국내 6대 택배사 연동.
- **회원 등급 자동 승급 (`membershipService.ts`)**: 누적 결제 횟수/금액 조건 달성 시 자동 등급 승급 및 보너스 적립금 지급.

---

## ⚙️ 3. Admin Back-office CMS System

### 3.1 접속 방식 & 보안 라우팅
- 퍼블릭 화면에서는 버튼이 감추어져 있으며, 브라우저 주소창에 **`도메인/admin`** 수동 입력 시 접근 가능.
- 미인증 상태 시 `/admin/login` 로그인 화면으로 자동 이동하며, 최초 로그인 시 **SHA-256 강제 비밀번호 변경 모달** 작동.

### 3.2 High Fashion Dark CMS UI
- `#111111` Dark Sidebar + Velvet Pink (`#D81B60`) Active Line Indicator + Black Glass Topbar + `#141414` KPI Cards.

### 3.3 백오피스 8대 관리 모듈
1. **대시보드 (`Dashboard.tsx`)**: 총 매출액, 누적 주문, 배송 대기, 미답변 문의 등 실시간 KPI 스파크라인 및 퀵 메뉴.
2. **사이트 정보 관리 (`SiteManagement.tsx`)**: 대표자명, Favicon URL, Resend 이메일 API Key 설정.
3. **콘텐츠 & 미디어 관리 (`ContentManagement.tsx`, `MediaCenter.tsx`)**: 공지/뉴스/ESG 자료실 PDF 업로드 및 노출 제어.
4. **제품 관리 (`ProductManagement.tsx`)**:
   - 제품 이미지 업로드 (Pure File Upload Data URL & URL 방식 지원).
   - 베스트셀러 On/Off 토글, 카테고리/브랜드 관리, 판매 상태(판매중/품절/숨김).
   - 수정 시 퍼블릭 스토어(`LandingPage.tsx`)에 **실시간 100% 동기화**.
5. **쇼핑몰 & 문의 관리 (`ShopManagement.tsx`)**: 배송비 설정, FAQ 및 1:1 고객문의 답변 작성 & 이메일 발송.
6. **주문확인 & 물류관리 (`OrderManagement.tsx`)**: 택배사 지정, 송장번호 등록 및 주문 상태 업데이트.
7. **고객 관리 (`CustomerManagement.tsx`)**: 구매자 회원 목록 조회 및 저장 배송지 맵핑 확인.
8. **권한 등록 (`UserManagement.tsx`)**: `siteadmin`(최고관리자) 전용 직원 계정 생성 및 8대 메뉴별 접근 권한 설정.

---

## 🚀 4. Deployment & CI/CD Pipeline

- **Node.js**: `v24` 표준 사용.
- **GitHub Actions (`.github/workflows/deploy.yml`)**:
  - `main` 브랜치 푸시 시 자동 실행.
  - `actions/setup-node@v4` (node-version: '24')
  - `npm install`, `npm run build`
  - Cloudflare Pages (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) 자동 배포.
- **Lint 검증**: `npm run lint` (`tsc --noEmit`) **오류 0건 (Clean Passed)**.

---

## 📁 5. Directory Overview

```text
d:\Antigravity\default_website_aistudio2
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions CI/CD (Node v24 -> Cloudflare Pages)
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx     # 백오피스 럭셔리 다크 레이아웃
│   │   ├── BrandStory.tsx      # 브랜드 스토리 (Brand)
│   │   ├── CartModal.tsx       # 장바구니 & Toss Payments 결제 모달
│   │   ├── CompanyInfo.tsx     # 기업 정보 (Company)
│   │   ├── ContentManagement.tsx # 콘텐츠 관리
│   │   ├── CustomerManagement.tsx # 고객 회원 & 저장 배송지 맵핑 관리
│   │   ├── CustomerMyPage.tsx  # 구매자 마이페이지 & 소셜 로그인
│   │   ├── Dashboard.tsx       # 대시보드 KPI & 실시간 현황
│   │   ├── LandingPage.tsx     # 100vh 시네마틱 럭셔리 퍼블릭 스토어
│   │   ├── LoginPage.tsx       # 관리자 고대비 다크 로그인
│   │   ├── MediaCenter.tsx     # 미디어 센터
│   │   ├── OrderManagement.tsx # 주문 & 물류 송장 관리
│   │   ├── ProductManagement.tsx # 제품 CRUD & 이미지 업로드
│   │   ├── PublicLayout.tsx    # 퍼블릭 상단 글래스 헤더 & 푸터
│   │   ├── ShopManagement.tsx  # 쇼핑몰 정책 & 1:1 문의 관리
│   │   ├── SiteManagement.tsx  # 사이트 기본 정보 & API Key 설정
│   │   └── UserManagement.tsx  # 최고관리자 전용 직원 권한 관리
│   ├── lib/
│   │   ├── customerAddresses.ts # 고객 배송지 맵핑 파이프라인
│   │   ├── supabaseClient.ts    # Supabase Custom QueryBuilder Class
│   │   └── tossPayments.ts      # Toss Payments 결제 승인/취소
│   ├── services/
│   │   ├── courierTrackingService.ts # 국내 6대 택배 추적 연동
│   │   ├── emailService.ts     # Resend 이메일 발송 연동
│   │   ├── membershipService.ts# 회원 등급 자동 승급
│   │   ├── seoService.ts        # 동적 SEO 태그 적용
│   │   └── socialAuthService.ts # 소셜 로그인 OAuth
│   ├── i18n.ts                 # 글로벌 7개 국어 다국어 딕셔너리
│   └── index.css               # Luxury Fashion Design Tokens & Utility Classes
├── design.md                   # UI/UX 디자인 명세서 (v3.2)
├── develop.md                  # 구현 아키텍처 보고서
├── supabase_schema.sql         # Supabase PostgreSQL DB 스키마 & RLS 정책
└── README.md                   # 프로젝트 통합 안내 문서
```
