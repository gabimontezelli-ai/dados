import React from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  BarChart3, 
  Wallet,
  LogOut,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user: { name: string; email: string };
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'purchases', label: 'Compras', icon: ShoppingCart },
  { id: 'sales', label: 'Vendas', icon: TrendingUp },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'balance', label: 'Saldo', icon: Wallet },
];

export default function Sidebar({ activeTab, onTabChange, onLogout, user }: SidebarProps) {
  return (
    <div className="h-screen w-64 bg-slate-900/90 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">StockFlow</h1>
            <p className="text-xs text-slate-400">Sistema de Estoque</p>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-red-600/20 hover:scale-105 transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  );
}