import React, { useState } from 'react';
import { Plus, ShoppingCart, Trash2, Search, Calendar } from 'lucide-react';
import { Purchase, Product, Category } from '../types';
import ConfirmModal from './ConfirmModal';

interface PurchasesProps {
  purchases: Purchase[];
  products: Product[];
  categories: Category[];
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  onDeletePurchase: (id: string) => void;
}

export default function Purchases({
  purchases,
  products,
  categories,
  onAddPurchase,
  onDeletePurchase,
}: PurchasesProps) {
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
    type: 'existing' as 'existing' | 'new',
    productId: '',
    quantity: '',
    unitPrice: '',
    // New product fields
    productName: '',
    description: '',
    categoryId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const purchase: Omit<Purchase, 'id'> = {
      productId: form.type === 'existing' ? form.productId : '',
      productName: form.type === 'existing' 
        ? products.find(p => p.id === form.productId)?.name || ''
        : form.productName,
      quantity: parseInt(form.quantity),
      unitPrice: parseFloat(form.unitPrice),
      totalPrice: parseInt(form.quantity) * parseFloat(form.unitPrice),
      date: new Date(),
      type: form.type,
      newProductData: form.type === 'new' ? {
        name: form.productName,
        description: form.description,
        categoryId: form.categoryId,
      } : undefined,
    };

    onAddPurchase(purchase);
    setForm({
      type: 'existing',
      productId: '',
      quantity: '',
      unitPrice: '',
      productName: '',
      description: '',
      categoryId: '',
    });
    setShowForm(false);
  };

  const handleDeletePurchase = (purchase: Purchase) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Compra',
      message: `Tem certeza que deseja excluir a compra de "${purchase.productName}" por R$ ${purchase.totalPrice.toFixed(2)}?`,
      onConfirm: () => onDeletePurchase(purchase.id),
    });
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === '' || 
      new Date(purchase.date).getMonth() === parseInt(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  const totalValue = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Compras</h1>
          <p className="text-slate-400">Registre suas compras de produtos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Nova Compra
        </button>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar compras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-orange-500/10 backdrop-blur-xl p-4 rounded-2xl border border-orange-500/20 text-center">
            <p className="text-orange-400 text-sm font-medium">Total em Compras</p>
            <p className="text-2xl font-bold text-white">R$ {totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25"></div>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Tipo</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{purchase.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{purchase.quantity} un.</td>
                    <td className="px-6 py-4 text-slate-300">R$ {purchase.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="text-orange-400 font-semibold">R$ {purchase.totalPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{new Date(purchase.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.type === 'new' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {purchase.type === 'new' ? 'Novo' : 'Existente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeletePurchase(purchase)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPurchases.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Nenhuma compra encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-4">Nova Compra</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Purchase Type */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Tipo de Produto</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'existing' })}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        form.type === 'existing'
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Produto Existente
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'new' })}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        form.type === 'new'
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Novo Produto
                    </button>
                  </div>
                </div>

                {form.type === 'existing' ? (
                  <select
                    value={form.productId}
                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={form.productName}
                      onChange={(e) => setForm({ ...form, productName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <textarea
                      placeholder="Descrição"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      rows={2}
                    />
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Quantidade"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                    min="1"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço unitário"
                    value={form.unitPrice}
                    onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                    min="0.01"
                  />
                </div>

                {form.quantity && form.unitPrice && (
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-slate-400 text-sm">Total da compra:</p>
                    <p className="text-orange-400 text-xl font-bold">
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
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700"
                  >
                    Registrar
                  </button>
                </div>
              </form>
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