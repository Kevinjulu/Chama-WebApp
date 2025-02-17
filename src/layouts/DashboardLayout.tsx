import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Dice1 as Dice, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Dice, label: 'Number Generator', path: '/generator' },
    { icon: Settings, label: 'Admin', path: '/admin' },
  ];

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg glass text-white lg:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-72 glass border-r border-white/10
        transform transition-transform duration-300 ease-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Dice className="w-6 h-6 text-secondary" />
              </div>
              <div className="absolute inset-0 bg-secondary/20 blur-xl -z-10" />
            </div>
            <h1 className="text-2xl font-bold text-white">Chama Group</h1>
          </div>

          <div className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link group ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 
                    ${isActive ? 'rotate-90 text-secondary' : 'group-hover:translate-x-1'}`} 
                  />
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 text-white/80 hover:text-accent 
                     px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-accent/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-out
        lg:ml-72 min-h-screen
        ${isOpen ? 'ml-72 blur-sm lg:blur-none' : 'ml-0'}
      `}>
        <div className="container mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;