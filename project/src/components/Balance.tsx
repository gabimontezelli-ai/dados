import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Purchase, Sale } from '../types';

interface BalanceProps {
  purchases: Purchase[];
  sales: Sale[];
}

export default function Balance({ purchases, sales }: BalanceProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const getMonthlyData = () => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    const monthlyPurchases = purchases.filter(p => {
      const date = new Date(p.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const monthlySales = sales.filter(s => {
      const date = new Date(s.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const totalPurchases = monthlyPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
    const totalSales = monthlySales.reduce((sum, s) => sum + s.totalPrice, 0);
    const profit = totalSales - totalPurchases;
    const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

    return {
      purchases: totalPurchases,
      sales: totalSales,
      profit,
      profitMargin,
      transactionCount: monthlyPurchases.length + monthlySales.length,
    };
  };

  const monthlyData = getMonthlyData();

  const cards = [
    {
      title: 'Gastos em Compras',
      value: `R$ ${monthlyData.purchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingDown,
      gradient: 'from-red-600 to-orange-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      textColor: 'text-red-400',
    },
    {
      title: 'Ganhos em Vendas',
      value: `R$ ${monthlyData.sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      gradient: 'from-green-600 to-emerald-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      textColor: 'text-green-400',
    },
    {
      title: 'Lucro Total',
      value: `R$ ${monthlyData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: monthlyData.profit >= 0 ? 'from-purple-600 to-pink-600' : 'from-red-600 to-orange-600',
      bg: monthlyData.profit >= 0 ? 'bg-purple-500/10' : 'bg-red-500/10',
      border: monthlyData.profit >= 0 ? 'border-purple-500/20' : 'border-red-500/20',
      textColor: monthlyData.profit >= 0 ? 'text-purple-400' : 'text-red-400',
    },
    {
      title: 'Margem de Lucro',
      value: `${monthlyData.profitMargin.toFixed(1)}%`,
      icon: Wallet,
      gradient: monthlyData.profitMargin >= 0 ? 'from-blue-600 to-purple-600' : 'from-red-600 to-orange-600',
      bg: monthlyData.profitMargin >= 0 ? 'bg-blue-500/10' : 'bg-red-500/10',
      border: monthlyData.profitMargin >= 0 ? 'border-blue-500/20' : 'border-red-500/20',
      textColor: monthlyData.profitMargin >= 0 ? 'text-blue-400' : 'text-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Saldo</h1>
          <p className="text-slate-400">Resumo financeiro do seu negócio</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {months.map((month, index) => (
                <option key={index} value={index.toString()}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Period Info */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl blur opacity-25"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {months[parseInt(selectedMonth)]} de {selectedYear}
            </h2>
            <p className="text-slate-400">
              {monthlyData.transactionCount} transação{monthlyData.transactionCount !== 1 ? 'ões' : ''} registrada{monthlyData.transactionCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
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
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Summary */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
        <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6">Resumo Detalhado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Flow */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300">Fluxo Financeiro</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-300">Saídas (Compras)</span>
                  </div>
                  <span className="text-red-400 font-semibold">
                    R$ {monthlyData.purchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300">Entradas (Vendas)</span>
                  </div>
                  <span className="text-green-400 font-semibold">
                    R$ {monthlyData.sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${monthlyData.profit >= 0 ? 'bg-purple-500' : 'bg-red-500'} rounded-full`}></div>
                      <span className="text-white font-medium">Saldo Final</span>
                    </div>
                    <span className={`font-bold text-lg ${monthlyData.profit >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                      R$ {monthlyData.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300">Métricas de Performance</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Margem de Lucro</span>
                    <span className={`text-sm font-semibold ${monthlyData.profitMargin >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {monthlyData.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${monthlyData.profitMargin >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(Math.abs(monthlyData.profitMargin), 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-sm">ROI (Retorno sobre Investimento)</span>
                    <span className={`text-sm font-semibold ${monthlyData.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {monthlyData.purchases > 0 ? ((monthlyData.profit / monthlyData.purchases) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-sm">Transações Totais</span>
                    <span className="text-white font-semibold">{monthlyData.transactionCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-center">
              <div className={`px-6 py-3 rounded-full border-2 ${
                monthlyData.profit >= 0 
                  ? 'border-green-500 bg-green-500/20 text-green-400' 
                  : 'border-red-500 bg-red-500/20 text-red-400'
              }`}>
                <span className="font-semibold">
                  {monthlyData.profit >= 0 
                    ? '✓ Mês com lucro' 
                    : '⚠ Mês com prejuízo'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}