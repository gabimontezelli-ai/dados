import React, { useState } from 'react';
import { Plus, TrendingUp, Trash2, Search, AlertCircle } from 'lucide-react';
import { Sale, Product } from '../types';
import ConfirmModal from './ConfirmModal';

interface SalesProps {
  sales: Sale[];
  products: Product[];
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
  onDeleteSale: (id: string) => void;
}

export default function Sales({ sales, products, onAddSale, onDeleteSale }: SalesProps) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [form, setForm] = useState({
    productId: '',
    quantity: '',
    unitPrice: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === form.productId);
    if (!product) return;

    const quantity = parseInt(form.quantity);
    if (quantity > product.stock) {
      alert('Quantidade indisponível no estoque!');
      return;
    }

    const sale: Omit<Sale, 'id'> = {
      productId: form.productId,
      productName: product.name,
      quantity,
      unitPrice: parseFloat(form.unitPrice),
      totalPrice: quantity * parseFloat(form.unitPrice),
      date: new Date(),
    };

    onAddSale(sale);
    setForm({ productId: '', quantity: '', unitPrice: '' });
    setShowForm(false);
  };

  const handleDeleteSale = (sale: Sale) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Venda',
      message: `Tem certeza que deseja excluir a venda de "${sale.productName}" por R$ ${sale.totalPrice.toFixed(2)}?`,
      onConfirm: () => onDeleteSale(sale.id),
    });
  };

  const getAvailableProducts = () => {
    return products.filter(p => p.stock > 0);
  };

  const selectedProduct = products.find(p => p.id === form.productId);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === '' || 
      new Date(sale.date).getMonth() === parseInt(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  const totalValue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Vendas</h1>
          <p className="text-slate-400">Registre suas vendas de produtos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Nova Venda
        </button>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar vendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        >
          <option value="">Todos os meses</option>
          <option value="0">Janeiro</option>
          <option value="1">Fevereiro</option>
          <option value="2">Março</option>
          <option value="3">Abril</option>
          <option value="4">Maio</option>
          <option value="5">Junho</option>
          <option value="6">Julho</option>
          <option value="7">Agosto</option>
          <option value="8">Setembro</option>
          <option value="9">Outubro</option>
          <option value="10">Novembro</option>
          <option value="11">Dezembro</option>
        </select>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-green-500/10 backdrop-blur-xl p-4 rounded-2xl border border-green-500/20 text-center">
            <p className="text-green-400 text-sm font-medium">Total em Vendas</p>
            <p className="text-2xl font-bold text-white">R$ {totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25"></div>
        <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Produto</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Quantidade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Preço Unitário</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Data</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{sale.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{sale.quantity} un.</td>
                    <td className="px-6 py-4 text-slate-300">R$ {sale.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-semibold">R$ {sale.totalPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteSale(sale)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSales.length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Nenhuma venda encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sale Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Nova Venda</h3>
              
              {getAvailableProducts().length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <p className="text-white text-lg font-medium mb-2">Nenhum produto disponível</p>
                  <p className="text-slate-400">Não há produtos com estoque para venda.</p>
                  <button
                    onClick={() => setShowForm(false)}
                    className="mt-4 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    value={form.productId}
                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {getAvailableProducts().map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Estoque: {product.stock})
                      </option>
                    ))}
                  </select>

                  {selectedProduct && (
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm">Estoque disponível:</p>
                      <p className="text-white font-semibold">{selectedProduct.stock} unidades</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Quantidade"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      min="1"
                      max={selectedProduct?.stock || 1}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Preço unitário"
                      value={form.unitPrice}
                      onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      min="0.01"
                    />
                  </div>

                  {form.quantity && form.unitPrice && (
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm">Total da venda:</p>
                      <p className="text-green-400 text-xl font-bold">
                        R$ {(parseInt(form.quantity) * parseFloat(form.unitPrice)).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700"
                    >
                      Registrar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}