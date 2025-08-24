import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Tag, Search } from 'lucide-react';
import { Product, Category } from '../types';
import ConfirmModal from './ConfirmModal';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (id: string, product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

export default function Products({
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
}: ProductsProps) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    categoryId: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    color: '#8B5CF6',
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onEditProduct(editingProduct.id, {
        ...productForm,
        stock: editingProduct.stock,
      });
      setEditingProduct(null);
    } else {
      onAddProduct({
        ...productForm,
        stock: 0,
      });
    }
    setProductForm({ name: '', description: '', categoryId: '' });
    setShowProductForm(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(categoryForm);
    setCategoryForm({ name: '', color: '#8B5CF6' });
    setShowCategoryForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Produto',
      message: `Tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => onDeleteProduct(product.id),
    });
  };

  const handleDeleteCategory = (category: Category) => {
    const productsInCategory = products.filter(p => p.categoryId === category.id);
    if (productsInCategory.length > 0) {
      alert(`Não é possível excluir a categoria "${category.name}" pois existem ${productsInCategory.length} produto(s) vinculado(s).`);
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Excluir Categoria',
      message: `Tem certeza que deseja excluir a categoria "${category.name}"?`,
      onConfirm: () => onDeleteCategory(category.id),
    });
  };

  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const colors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5F9A', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Produtos</h1>
          <p className="text-slate-400">Gerencie seu catálogo de produtos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:scale-105"
          >
            <Tag className="w-4 h-4" />
            Nova Categoria
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setProductForm({ name: '', description: '', categoryId: '' });
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
        <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600 bg-slate-800/50 group hover:scale-105 transition-all"
                style={{ borderColor: category.color + '40', backgroundColor: category.color + '10' }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-white text-sm font-medium">{category.name}</span>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="opacity-0 group-hover:opacity-100 ml-2 text-red-400 hover:text-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-slate-400">Nenhuma categoria cadastrada</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const category = getCategoryById(product.categoryId);
          return (
            <div key={product.id} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700 hover:scale-105 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  {category && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-slate-300 text-sm">{category.name}</span>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Estoque</p>
                    <p className={`font-bold ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                      {product.stock} un.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Nenhum produto encontrado</p>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <textarea
                  placeholder="Descrição"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                />
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                  >
                    {editingProduct ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Nova Categoria</h3>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Cor</label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          categoryForm.color === color ? 'border-white scale-110' : 'border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                  >
                    Cadastrar
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