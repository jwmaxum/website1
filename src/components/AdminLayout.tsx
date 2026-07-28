import { ReactNode, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { StaffPermissions } from './UserManagement';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('최고 관리자');
  const [userRole, setUserRole] = useState('superadmin');
  const [userPermissions, setUserPermissions] = useState<StaffPermissions>({
    dashboard: true,
    site: true,
    content: true,
    products: true,
    shop: true,
    orders: true,
    customers: true,
    system: true,
  });

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isAdminLoggedIn) {
      navigate('/admin/login', { replace: true });
      return;
    }

    const savedName = localStorage.getItem('admin_logged_user_name');
    if (savedName) setUserName(savedName);

    const savedRole = localStorage.getItem('admin_logged_user_role') || 'superadmin';
    setUserRole(savedRole);

    const savedPerms = localStorage.getItem('admin_logged_user_permissions');
    if (savedPerms) {
      try {
        setUserPermissions(JSON.parse(savedPerms));
      } catch (e) {
        // default
      }
    }

    if (location.pathname === '/admin/system' && savedRole !== 'superadmin') {
      alert('권한등록 메뉴는 siteadmin(최고관리자) 전용 메뉴입니다.');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_logged_user_id');
    localStorage.removeItem('admin_logged_user_name');
    localStorage.removeItem('admin_logged_user_role');
    localStorage.removeItem('admin_logged_user_permissions');
    navigate('/admin/login');
  };

  const allMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', permKey: 'dashboard' },
    { name: '사이트 정보 관리', path: '/admin/site', icon: 'settings_input_component', permKey: 'site' },
    { name: '콘텐츠 & 미디어 관리', path: '/admin/content', icon: 'article', permKey: 'content' },
    { name: '제품 관리', path: '/admin/products', icon: 'inventory_2', permKey: 'products' },
    { name: '쇼핑몰 관리', path: '/admin/shop', icon: 'shopping_cart', permKey: 'shop' },
    { name: '주문확인 & 물류관리', path: '/admin/orders', icon: 'local_shipping', permKey: 'orders' },
    { name: '고객 관리', path: '/admin/customers', icon: 'group', permKey: 'customers' },
    { name: '권한등록', path: '/admin/system', icon: 'manage_accounts', permKey: 'system' },
  ];

  const visibleMenuItems = allMenuItems.filter((item) => {
    if (item.permKey === 'system') {
      return userRole === 'superadmin';
    }
    if (userRole === 'superadmin') return true;
    const key = item.permKey as keyof StaffPermissions;
    return userPermissions[key] !== false;
  });

  return (
    <div className="flex h-screen bg-[#0B0B0B] text-[#FAFAFA] overflow-hidden antialiased font-sans">
      {/* Sleek Dark Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#D6A56D]/20 text-white flex flex-col h-full shrink-0 z-50">
        <div className="p-6 flex flex-col gap-1 mb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D81B60] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(216,27,96,0.5)]">
              O
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold tracking-wider uppercase text-white">ONEDAYS</h1>
              <p className="text-[10px] text-[#D6A56D] tracking-widest font-mono">FLAGSHIP CONSOLE</p>
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Main Management
          </div>
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#D81B60]/15 text-[#D81B60] border border-[#D81B60]/40 shadow-[0_0_15px_rgba(216,27,96,0.2)] font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-[#D81B60]' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D81B60] shadow-[0_0_8px_#D81B60]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 m-4 bg-[#141414] rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#D6A56D] text-[#050505] font-bold text-xs flex items-center justify-center shrink-0">
              {userName.substring(0, 1)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{userRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-[#D81B60] p-1.5 transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Right Content Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505]">
        {/* Top Command Header */}
        <header className="h-16 bg-[#111111]/80 backdrop-blur-md border-b border-[#D6A56D]/20 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#D6A56D]">space_dashboard</span>
            <h2 className="text-sm font-serif font-bold text-white tracking-wide uppercase">
              Management Portal
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg border border-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span>퍼블릭 스토어 가기</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[#D81B60]/20 hover:bg-[#D81B60] text-[#D81B60] hover:text-white border border-[#D81B60]/40 text-xs font-bold rounded-lg transition-all"
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
