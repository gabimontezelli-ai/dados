import React from 'react';
import { Package, ShoppingCart, TrendingUp, Wallet, Eye, AlertCircle } from 'lucide-react';
import { Product, Purchase, Sale } from '../types';

interface DashboardProps {
  products: Product[];
  purchases: Purchase[];
  sales: Sale[];
}

export default function Dashboard({ products, purchases, sales }: DashboardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthPurchases = purchases.filter(p => 
    new Date(p.date).getMonth() === currentMonth && 
    new Date(p.date).getFullYear() === currentYear
  );

  const currentMonthSales = sales.filter(s => 
    new Date(s.date).getMonth() === currentMonth && 
    new Date(s.date).getFullYear() === currentYear
  );

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const monthlyPurchases = currentMonthPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const monthlySales = currentMonthSales.reduce((sum, s) => sum + s.totalPrice, 0);
  const monthlyProfit = monthlySales - monthlyPurchases;

  const cards = [
    {
      title: 'Total de Produtos',
      value: totalProducts.toString(),
      icon: Package,
      gradient: 'from-blue-600 to-purple-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      title: 'Compras do Mês',
      value: `R$ ${monthlyPurchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: ShoppingCart,
      gradient: 'from-orange-600 to-red-600',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      title: 'Vendas do Mês',
      value: `R$ ${monthlySales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      gradient: 'from-green-600 to-emerald-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      title: 'Lucro do Mês',
      value: `R$ ${monthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      gradient: monthlyProfit >= 0 ? 'from-purple-600 to-pink-600' : 'from-red-600 to-orange-600',
      bg: monthlyProfit >= 0 ? 'bg-purple-500/10' : 'bg-red-500/10',
      border: monthlyProfit >= 0 ? 'border-purple-500/20' : 'border-red-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Visão geral do seu estoque e vendas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300`}></div>
              <div className={`relative ${card.bg} backdrop-blur-xl p-6 rounded-2xl border ${card.border} hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {lowStockProducts > 0 && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-yellow-500/10 backdrop-blur-xl p-6 rounded-2xl border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-yellow-300 font-semibold">Atenção!</h3>
                <p className="text-slate-300">
                  {lowStockProducts} produto{lowStockProducts > 1 ? 's' : ''} com estoque baixo (menos de 10 unidades)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Compras Recentes
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {purchases.slice(-5).reverse().map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="text-white font-medium">{purchase.productName}</p>
                    <p className="text-slate-400 text-sm">{purchase.quantity} unidades</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-semibold">R$ {purchase.totalPrice.toFixed(2)}</p>
                    <p className="text-slate-500 text-xs">{new Date(purchase.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {purchases.length === 0 && (
                <p className="text-slate-400 text-center py-8">Nenhuma compra realizada</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Vendas Recentes
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {sales.slice(-5).reverse().map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="text-white font-medium">{sale.productName}</p>
                    <p className="text-slate-400 text-sm">{sale.quantity} unidades</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">R$ {sale.totalPrice.toFixed(2)}</p>
                    <p className="text-slate-500 text-xs">{new Date(sale.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {sales.length === 0 && (
                <p className="text-slate-400 text-center py-8">Nenhuma venda realizada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}