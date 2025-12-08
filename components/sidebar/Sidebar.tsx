import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';
import { NavItem, SidebarProps } from '@/features/Dashboard/types/types';

const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav }) => {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string>('Product');

  const navItems: NavItem[] = [
    { 
      icon: <Home size={20} />, 
      label: 'Dashboard',
      route: '/dashboard'
    },
    { 
      icon: <Package size={20} />, 
      label: 'Product', 
      count: 119,
      subItems: [
        { name: 'Reports', route: '/products' },
        { name: "API's", route: '/products?tab=apis' },
        { name: 'Datafeed', route: '/products?tab=datafeed' },
        { name: 'Datasets', route: '/products?tab=datasets' }
      ]
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Transaction', 
      count: 441,
      route: '/transactions'
    },
    { 
      icon: <Users size={20} />, 
      label: 'Customers',
      route: '/customers'
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Sales Report',
      route: '/sales-report'
    },
  ];

  const tools: NavItem[] = [
    { 
      icon: <Settings size={20} />, 
      label: 'Account & Settings',
      route: '/settings'
    },
    { 
      icon: <HelpCircle size={20} />, 
      label: 'Help',
      route: '/help'
    },
  ];

  const handleNavClick = (item: NavItem) => {
    setActiveNav(item.label);
    
    if (item.subItems) {
      setExpandedItem(expandedItem === item.label ? '' : item.label);
    } else if (item.route) {
      router.push(item.route);
    }
  };

  const handleSubItemClick = (subItem: { name: string; route: string }, parentLabel: string) => {
    setActiveNav(parentLabel);
    router.push(subItem.route);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">A</span>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-800">Practice</div>
          <div className="text-xs text-gray-600">Project</div>
        </div>
        <button className="ml-auto">
          <Menu size={20} className="text-gray-600" />
        </button>
      </div>

      {/* General Section */}
      <div className="p-4">
        <div className="text-xs text-gray-500 font-semibold mb-3">GENERAL</div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeNav === item.label
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="text-sm flex-1 text-left">{item.label}</span>
                {item.count && (
                  <span className="text-xs text-gray-500">({item.count})</span>
                )}
                {item.subItems && (
                  expandedItem === item.label ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                )}
              </button>
              {item.subItems && expandedItem === item.label && (
                <div className="ml-11 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.name}
                      onClick={() => handleSubItemClick(subItem, item.label)}
                      className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 rounded"
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 font-semibold mb-3">TOOLS</div>
        <div className="space-y-1">
          {tools.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeNav === item.label
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;