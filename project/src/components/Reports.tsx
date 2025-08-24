import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Purchase, Sale, MonthlyData } from '../types';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

interface ReportsProps {
  purchases: Purchase[];
  sales: Sale[];
}

export default function Reports({ purchases, sales }: ReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('6'); // Last 6 months

  const getMonthlyData = (): MonthlyData[] => {
    const months = parseInt(selectedPeriod);
    const endDate = new Date();
    const startDate = subMonths(endDate, months - 1);
    
    const monthsArray = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: endOfMonth(endDate)
    });

    return monthsArray.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthPurchases = purchases.filter(p => {
        const date = new Date(p.date);
        return date >= monthStart && date <= monthEnd;
      });
      
      const monthSales = sales.filter(s => {
        const date = new Date(s.date);
        return date >= monthStart && date <= monthEnd;
      });

      const purchaseTotal = monthPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
      const salesTotal = monthSales.reduce((sum, s) => sum + s.totalPrice, 0);
      
      return {
        month: format(month, 'MMM/yy'),
        purchases: purchaseTotal,
        sales: salesTotal,
        profit: salesTotal - purchaseTotal,
      };
    });
  };

  const monthlyData = getMonthlyData();

  // Top selling products
  const getTopProducts = () => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    sales.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = {
          name: sale.productName,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[sale.productId].quantity += sale.quantity;
      productSales[sale.productId].revenue += sale.totalPrice;
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  const totalPurchases = monthlyData.reduce((sum, data) => sum + data.purchases, 0);
  const totalSales = monthlyData.reduce((sum, data) => sum + data.sales, 0);
  const totalProfit = totalSales - totalPurchases;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const pieData = topProducts.map((product, index) => ({
    name: product.name,
    value: product.revenue,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
          <p className="text-slate-400">Análise detalhada das suas vendas e compras</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="3">Últimos 3 meses</option>
            <option value="6">Últimos 6 meses</option>
            <option value="12">Último ano</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-orange-500/10 backdrop-blur-xl p-6 rounded-2xl border border-orange-500/20 text-center">
            <TrendingDown className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-orange-400 text-sm font-medium">Total Compras</p>
            <p className="text-2xl font-bold text-white">R$ {totalPurchases.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-green-500/10 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 text-sm font-medium">Total Vendas</p>
            <p className="text-2xl font-bold text-white">R$ {totalSales.toFixed(2)}</p>
          </div>
        </div>

        <div className="relative">
          <div className={`absolute -inset-1 bg-gradient-to-r ${totalProfit >= 0 ? 'from-purple-600 to-pink-600' : 'from-red-600 to-orange-600'} rounded-2xl blur opacity-25`}></div>
          <div className={`relative ${totalProfit >= 0 ? 'bg-purple-500/10 border-purple-500/20' : 'bg-red-500/10 border-red-500/20'} backdrop-blur-xl p-6 rounded-2xl border text-center`}>
            <BarChart3 className={`w-8 h-8 ${totalProfit >= 0 ? 'text-purple-400' : 'text-red-400'} mx-auto mb-2`} />
            <p className={`${totalProfit >= 0 ? 'text-purple-400' : 'text-red-400'} text-sm font-medium`}>Lucro Total</p>
            <p className="text-2xl font-bold text-white">R$ {totalProfit.toFixed(2)}</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-blue-500/10 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/20 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-400 text-sm font-medium">Margem de Lucro</p>
            <p className="text-2xl font-bold text-white">{profitMargin.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Compras vs Vendas</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value: number, name: string) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      name === 'purchases' ? 'Compras' : 'Vendas'
                    ]}
                  />
                  <Bar dataKey="purchases" fill="#f59e0b" name="purchases" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" fill="#10b981" name="sales" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Profit Chart */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Evolução do Lucro</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Lucro'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Table */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Produtos Mais Vendidos</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-slate-400 text-sm">{product.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <p className="text-green-400 font-semibold">R$ {product.revenue.toFixed(2)}</p>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-slate-400 text-center py-8">Nenhuma venda registrada</p>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Distribuição de Receita</h3>
            {pieData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        'Receita'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-slate-400">Nenhum dado para exibir</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}