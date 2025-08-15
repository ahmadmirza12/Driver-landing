'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { 
  Home, 
  Car, 
  Package, 
  MessageSquare, 
  User, 
  Search, 
  Bell, 
  Menu, 
  X 
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname(); // Get current pathname

  const menuItems = [
    { icon: Home, label: 'Dashboard', link: '/screens/dashboard' },
    { icon: Car, label: 'Active Ride', link: '/screens/activeRide' },
    { icon: Package, label: 'Orders', link: '/screens/orders' },
    { icon: MessageSquare, label: 'Message', link: '/screens/messages' },
    { icon: User, label: 'Account', link: '/screens/account' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1F5546] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#1F5546]">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">
              ASRA <span className="text-[#EAB308]">Chauffeur</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                pathname === item.link 
                  ? 'bg-[#549D89] text-white border-r-4 border-yellow-400' 
                  : 'text-emerald-100 hover:bg-emerald-600'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
              >
                <Menu size={24} />
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search anything here"
                  className="pl-10 pr-4 py-2 w-64 sm:w-80 focus:outline-none focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Alexandro</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;