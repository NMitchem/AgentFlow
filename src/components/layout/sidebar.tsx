import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, Bot, Settings, Database, Rocket } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Agents', href: '/agents', icon: <Bot className="w-5 h-5" /> },
    { name: 'Models', href: '/models', icon: <Database className="w-5 h-5" /> },
    { name: 'Experiments', href: '/experiments', icon: <Rocket className="w-5 h-5" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <motion.nav
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4"
    >
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-gray-900">CrewAI Studio</h1>
        <p className="text-sm text-gray-500">Enterprise AI Platform</p>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group"
          >
            <span className="text-gray-500 group-hover:text-blue-600 transition-colors">
              {item.icon}
            </span>
            <span className="ml-3 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
} 