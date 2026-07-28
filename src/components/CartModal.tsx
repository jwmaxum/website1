import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order, OrderItem, initialOrders } from '../types/OrderTypes';
import { getTossPaymentsConfig, savePaymentRecord, TossPaymentRecord } from '../lib/tossPayments';
import { saveCustomerAddress, getCustomerSavedAddress } from '../lib/customerAddresses';
import { updateCustomerTierOnOrder } from '../services/membershipService';
import { performSocialLogin } from '../services/socialAuthService';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'auth_required' | 'cart' | 'checkout' | 'success'>('cart');
  const [orderType, setOrderType] = useState<'member' | 'guest'>('guest');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  // Auth Required Modal State
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Checkout Form State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('카드');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 1. Load Cart Items
      const savedCart = localStorage.getItem('shop_cart_items');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }

      // 2. Check Customer Login Status
      const loggedCust = localStorage.getItem('customer_logged_in_user');
      if (loggedCust) {
        try {
          const user = JSON.parse(loggedCust);
          setIsCustomerLoggedIn(true);
          setOrderType('member');
          setGuestName(user.name ? user.name.replace(' 님', '') : '');
          setGuestEmail(user.email || '');
          setGuestPhone(user.phone || '');

          const savedAddr = getCustomerSavedAddress(user.email);
          if (savedAddr && savedAddr.address) {
            setGuestAddress(savedAddr.address);
            if (savedAddr.recipient_name) setGuestName(savedAddr.recipient_name);
            if (savedAddr.phone) setGuestPhone(savedAddr.phone);
          }

          // Show Cart immediately for logged in customers
          setCheckoutStep('cart');
        } catch (e) {
          setIsCustomerLoggedIn(false);
          setOrderType('guest');
          setCheckoutStep('auth_required');
        }
      } else {
        setIsCustomerLoggedIn(false);
        setOrderType('guest');
        // If not logged in, prompt Customer Login / Sign Up first!
        setCheckoutStep('auth_required');
      }
    }
  }, [isOpen]);

  const handleEmailBlur = () => {
    if (guestEmail.trim()) {
      const savedAddr = getCustomerSavedAddress(guestEmail.trim());
      if (savedAddr && savedAddr.address) {
        setGuestAddress(savedAddr.address);
        if (savedAddr.recipient_name && !guestName) setGuestName(savedAddr.recipient_name);
        if (savedAddr.phone && !guestPhone) setGuestPhone(savedAddr.phone);
      }
    }
  };

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('shop_cart_items', JSON.stringify(items));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    saveCart(updated);
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const itemPrice = item.salePrice || item.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Customer Login Submit in Modal
  const handleModalAuthLogin = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authPassword) {
      setAuthError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    const customerUser = {
      id: `cust-${Date.now()}`,
      name: authEmail.split('@')[0] + ' 님',
      email: authEmail.trim(),
      phone: '010-0000-0000',
      membership: 'SILVER' as const,
      points: 3000,
      coupons: 1,
      joinedDate: new Date().toLocaleDateString(),
    };

    localStorage.setItem('customer_logged_in_user', JSON.stringify(customerUser));
    setIsCustomerLoggedIn(true);
    setOrderType('member');
    setGuestName(customerUser.name.replace(' 님', ''));
    setGuestEmail(customerUser.email);

    // Transition directly to Cart view!
    setCheckoutStep('cart');
  };

  // Customer Sign Up Submit in Modal
  const handleModalAuthSignup = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setAuthError('필수 입력 항목을 모두 채워주세요.');
      return;
    }

    const newUser = {
      id: `cust-${Date.now()}`,
      name: signupName.trim() + ' 님',
      email: signupEmail.trim(),
      phone: signupPhone.trim() || '010-0000-0000',
      membership: 'SILVER' as const,
      points: 3000,
      coupons: 1,
      joinedDate: new Date().toLocaleDateString(),
    };

    localStorage.setItem('customer_logged_in_user', JSON.stringify(newUser));
    setIsCustomerLoggedIn(true);
    setOrderType('member');
    setGuestName(signupName.trim());
    setGuestEmail(signupEmail.trim());

    alert(`🎉 원데이즈뷰티 회원가입을 축하합니다! (웰컴 3,000P 지급)`);
    setCheckoutStep('cart');
  };

  // Social Login Handler
  const handleSocialLogin = async (provider: 'google' | 'naver') => {
    const res = await performSocialLogin(provider);
    if (res.success && res.user) {
      const customerUser = {
        id: res.user.id,
        name: res.user.name + ' 님',
        email: res.user.email,
        phone: '010-0000-0000',
        membership: 'SILVER' as const,
        points: 3000,
        coupons: 1,
        joinedDate: new Date().toLocaleDateString(),
      };
      localStorage.setItem('customer_logged_in_user', JSON.stringify(customerUser));
      setIsCustomerLoggedIn(true);
      setOrderType('member');
      setGuestName(res.user.name);
      setGuestEmail(res.user.email);
      setCheckoutStep('cart');
    }
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('장바구니에 담긴 제품이 없습니다.');
      return;
    }

    if (!guestName.trim() || !guestEmail.trim() || !guestAddress.trim()) {
      alert('주문자 성명, 이메일, 배송지 주소를 모두 입력해 주세요.');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${randomCode}`;

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.name,
      price: item.salePrice || item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    }));

    const formattedTime = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: orderId,
      orderType,
      customerName: guestName.trim(),
      customerEmail: guestEmail.trim(),
      customerPhone: guestPhone.trim() || '010-0000-0000',
      shippingAddress: guestAddress.trim(),
      items: orderItems,
      totalAmount: totalPrice,
      status: '주문접수',
      courier: 'CJ대한통운',
      trackingNumber: '',
      createdAt: formattedTime,
    };

    const vatAmount = Math.round((totalPrice * 0.1) / 1.1);
    const paymentKey = `tvV8_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const txId = `TX_${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}_${Math.floor(100000 + Math.random() * 900000)}`;

    const paymentRecord: TossPaymentRecord = {
      order_id: orderId,
      user_id: guestEmail.trim(),
      pg: 'TOSSPAYMENTS',
      payment_key: paymentKey,
      transaction_id: txId,
      amount: totalPrice,
      vat: vatAmount,
      status: 'DONE',
      method: paymentMethod || '카드',
      approved_at: new Date().toISOString(),
      cancelled_at: undefined,
      refunded_amount: 0,
      created_at: new Date().toISOString(),
    };

    await savePaymentRecord(paymentRecord);

    await saveCustomerAddress({
      user_id: guestEmail.trim(),
      recipient_name: guestName.trim(),
      phone: guestPhone.trim() || '010-0000-0000',
      address: guestAddress.trim(),
      is_default: true,
    });

    const savedOrders = localStorage.getItem('shop_orders');
    let ordersList: Order[] = savedOrders ? JSON.parse(savedOrders) : initialOrders;
    ordersList = [newOrder, ...ordersList];
    localStorage.setItem('shop_orders', JSON.stringify(ordersList));

    const tierResult = await updateCustomerTierOnOrder(guestEmail.trim());
    if (tierResult.upgraded) {
      alert(`🎉 축하합니다! 회원님의 결제 횟수 조건 충족으로 [${tierResult.newTier}] 등급으로 자동 승급되셨습니다!\n(승급 축하 보너스 적립금 +${tierResult.bonusPoints?.toLocaleString()}P 지급 완료)`);
    }

    saveCart([]);
    setCompletedOrder(newOrder);
    setCheckoutStep('success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#141414] rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#D6A56D]/30 max-h-[90vh] flex flex-col text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#D6A56D]">shopping_bag</span>
            <h2 className="text-xl font-serif font-bold text-white">
              {checkoutStep === 'auth_required' && '고객 로그인 & 회원가입 (Customer Auth)'}
              {checkoutStep === 'cart' && `Shopping Bag (${cartItems.length})`}
              {checkoutStep === 'checkout' && 'Checkout (주문 및 결제 작성)'}
              {checkoutStep === 'success' && 'Order Placed (주문 완료)'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* STEP 0: AUTH REQUIRED (UNAUTHENTICATED CUSTOMERS) */}
        {checkoutStep === 'auth_required' && (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            <div className="bg-[#0B0B0B] p-4 rounded-2xl border border-[#D6A56D]/30 text-center space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#D81B60]/20 text-[#D81B60] text-[10px] font-bold uppercase tracking-widest mb-1">
                Member Benefits
              </span>
              <h3 className="text-lg font-serif font-bold text-white">원데이즈뷰티 회원 전용 혜택</h3>
              <p className="text-xs text-slate-400">
                로그인 시 **신규가입 3,000P 적립금**, 자동 배송지 맵핑 및 구매 등급 혜택이 적용됩니다.
              </p>
            </div>

            {/* Auth Tab Switcher */}
            <div className="flex bg-[#1E1E1E] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                  authTab === 'login' ? 'bg-[#D81B60] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                고객 로그인 (Login)
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                  authTab === 'signup' ? 'bg-[#D81B60] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                회원가입 (Sign Up)
              </button>
            </div>

            {/* Login Tab */}
            {authTab === 'login' && (
              <form onSubmit={handleModalAuthLogin} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-[#A80F48]/20 border border-[#D81B60] rounded-xl text-xs text-[#D81B60] font-bold">
                    {authError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#D6A56D] mb-1">이메일 주소</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#D6A56D] mb-1">비밀번호</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)]"
                >
                  로그인하고 장바구니 보기
                </button>

                {/* Social Auth Buttons */}
                <div className="pt-2 border-t border-white/10 space-y-2 text-center">
                  <p className="text-[11px] text-slate-400">간편 소셜 로그인</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="py-2.5 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Google 계정</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('naver')}
                      className="py-2.5 bg-[#03C75A] text-white text-xs font-bold rounded-xl hover:bg-[#02b350] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>네이버 로그인</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Sign Up Tab */}
            {authTab === 'signup' && (
              <form onSubmit={handleModalAuthSignup} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-[#A80F48]/20 border border-[#D81B60] rounded-xl text-xs text-[#D81B60] font-bold">
                    {authError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#D6A56D] mb-1">성명</label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#D6A56D] mb-1">이메일 주소</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#D6A56D] mb-1">연락처</label>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#D6A56D] mb-1">비밀번호</label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="비밀번호 설정"
                      className="w-full px-4 py-3 bg-[#1E1E1E] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D81B60] hover:bg-[#A80F48] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)]"
                >
                  회원가입 후 장바구니 보기 (웰컴 3,000P)
                </button>
              </form>
            )}

            {/* Guest Bypass Option */}
            <div className="pt-2 text-center border-t border-white/10">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
              >
                비회원으로 장바구니 상품만 계속 확인하기 ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: CART LIST */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 my-auto">
                <span className="material-symbols-outlined text-[48px] text-[#D6A56D] mb-2">remove_shopping_cart</span>
                <p className="text-sm font-bold text-white">장바구니가 비어 있습니다.</p>
                <p className="text-xs text-slate-400 mt-1">마음에 드는 원데이즈뷰티 제품을 담아보세요!</p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                {cartItems.map((item) => {
                  const itemPrice = item.salePrice || item.price;
                  return (
                    <div key={item.productId} className="p-4 bg-[#1E1E1E] border border-white/10 rounded-2xl flex gap-4 items-center">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-[#D6A56D] uppercase">{item.brand}</p>
                        <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                        <p className="text-xs text-[#D81B60] font-serif font-bold mt-0.5">₩{itemPrice.toLocaleString()}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/20 rounded-lg bg-[#0B0B0B] overflow-hidden shrink-0">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, -1)}
                          className="px-2.5 py-1 text-slate-300 hover:bg-white/10 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, 1)}
                          className="px-2.5 py-1 text-slate-300 hover:bg-white/10 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-1 text-slate-400 hover:text-[#D81B60] transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-white/10 mt-4 space-y-4">
                <div className="flex justify-between items-center bg-[#0B0B0B] border border-[#D6A56D]/30 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-[#D6A56D] uppercase">Total Amount</span>
                  <span className="text-xl font-serif font-bold text-white">₩{totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3.5 bg-[#D81B60] hover:bg-[#A80F48] text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)] flex items-center justify-center gap-2"
                >
                  Proceed to Checkout ➔
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT (MEMBER / GUEST) */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="flex bg-[#0B0B0B] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setOrderType('member')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  orderType === 'member' ? 'bg-[#D81B60] text-white shadow-md' : 'text-slate-400'
                }`}
              >
                회원 주문 (Member)
              </button>
              <button
                type="button"
                onClick={() => setOrderType('guest')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  orderType === 'guest' ? 'bg-[#D81B60] text-white shadow-md' : 'text-slate-400'
                }`}
              >
                비회원 주문 (Guest)
              </button>
            </div>

            <div className="space-y-3 bg-[#1E1E1E] p-4 rounded-2xl border border-white/10">
              <h4 className="text-xs font-bold text-[#D6A56D] uppercase tracking-wider">주문자 및 배송지 정보</h4>
              
              <div>
                <label className="block text-xs text-slate-300 mb-1">이메일 주소 (Email)</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">수령인 성명 (Name)</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">연락처 (Phone)</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">배송지 주소 (Shipping Address)</label>
                <textarea
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  placeholder="도로명 주소 및 상세주소 입력"
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D81B60]"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 bg-[#1E1E1E] p-4 rounded-2xl border border-white/10">
              <h4 className="text-xs font-bold text-[#D6A56D] uppercase tracking-wider">결제 수단 선택 (Toss Payments 연동)</h4>
              <div className="grid grid-cols-3 gap-2">
                {['카드', '가상계좌', '간편결제'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                      paymentMethod === m
                        ? 'border-[#D81B60] bg-[#D81B60]/20 text-[#D81B60]'
                        : 'border-white/10 bg-[#0B0B0B] text-slate-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="py-3 px-5 border border-white/20 text-slate-300 font-bold rounded-xl text-xs uppercase"
              >
                Back to Bag
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-[#D81B60] hover:bg-[#A80F48] text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(216,27,96,0.4)]"
              >
                Pay ₩{totalPrice.toLocaleString()}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {checkoutStep === 'success' && completedOrder && (
          <div className="space-y-6 text-center py-6 my-auto">
            <div className="w-16 h-16 bg-[#D81B60]/20 border border-[#D81B60] text-[#D81B60] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#D6A56D] uppercase tracking-widest">Toss Payments Approved</span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">결제 및 주문이 완료되었습니다!</h3>
              <p className="text-xs font-mono text-slate-400 mt-1">주문번호: {completedOrder.id}</p>
            </div>

            <div className="bg-[#1E1E1E] p-5 rounded-2xl border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
              <p className="text-slate-300"><strong className="text-white">수령인:</strong> {completedOrder.customerName}</p>
              <p className="text-slate-300"><strong className="text-white">배송지:</strong> {completedOrder.shippingAddress}</p>
              <p className="text-slate-300"><strong className="text-white">결제 금액:</strong> ₩{completedOrder.totalAmount.toLocaleString()}</p>
              <p className="text-[#D6A56D] font-mono text-[11px] pt-2 border-t border-white/10">
                자동 배송지 맵핑 완료 | CJ대한통운 전산에 전송되었습니다.
              </p>
            </div>

            <div className="flex gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => {
                  onClose();
                  setCheckoutStep('cart');
                  navigate('/mypage');
                }}
                className="flex-1 py-3 bg-[#D81B60] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#A80F48] transition-colors shadow-md"
              >
                Check My Orders
              </button>
              <button
                onClick={() => {
                  onClose();
                  setCheckoutStep('cart');
                }}
                className="py-3 px-6 border border-white/20 text-slate-300 text-xs font-bold uppercase rounded-xl hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
