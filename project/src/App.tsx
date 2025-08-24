import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User, Category, Product, Purchase, Sale } from './types';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Purchases from './components/Purchases';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Balance from './components/Balance';

function App() {
  const [user, setUser] = useLocalStorage<User | null>('stockflow-user', null);
  const [categories, setCategories] = useLocalStorage<Category[]>('stockflow-categories', []);
  const [products, setProducts] = useLocalStorage<Product[]>('stockflow-products', []);
  const [purchases, setPurchases] = useLocalStorage<Purchase[]>('stockflow-purchases', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('stockflow-sales', []);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialize default categories
  useEffect(() => {
    if (categories.length === 0) {
      const defaultCategories: Category[] = [
        { id: '1', name: 'Eletrônicos', color: '#3B82F6' },
        { id: '2', name: 'Roupas', color: '#8B5CF6' },
        { id: '3', name: 'Casa e Jardim', color: '#10B981' },
        { id: '4', name: 'Esportes', color: '#F59E0B' },
        { id: '5', name: 'Livros', color: '#EF4444' },
      ];
      setCategories(defaultCategories);
    }
  }, [categories.length, setCategories]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Product handlers
  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const product: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, product]);
  };

  const handleEditProduct = (id: string, productData: Omit<Product, 'id'>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...productData, id } : product
    ));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    // Also remove related purchases and sales
    setPurchases(prev => prev.filter(purchase => purchase.productId !== id));
    setSales(prev => prev.filter(sale => sale.productId !== id));
  };

  // Category handlers
  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    const category: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, category]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  // Purchase handlers
  const handleAddPurchase = (purchaseData: Omit<Purchase, 'id'>) => {
    const purchase: Purchase = {
      ...purchaseData,
      id: Date.now().toString(),
    };

    // Add the purchase
    setPurchases(prev => [...prev, purchase]);

    // If it's a new product, create it
    if (purchase.type === 'new' && purchase.newProductData) {
      const newProduct: Product = {
        id: Date.now().toString() + '_product',
        name: purchase.newProductData.name,
        description: purchase.newProductData.description,
        categoryId: purchase.newProductData.categoryId,
        stock: purchase.quantity,
      };
      setProducts(prev => [...prev, newProduct]);
      
      // Update purchase with the new product ID
      purchase.productId = newProduct.id;
    } else {
      // Update existing product stock
      setProducts(prev => prev.map(product => 
        product.id === purchase.productId 
          ? { ...product, stock: product.stock + purchase.quantity }
          : product
      ));
    }
  };

  const handleDeletePurchase = (id: string) => {
    const purchase = purchases.find(p => p.id === id);
    if (purchase) {
      // Restore stock if it's an existing product
      if (purchase.type === 'existing') {
        setProducts(prev => prev.map(product => 
          product.id === purchase.productId 
            ? { ...product, stock: Math.max(0, product.stock - purchase.quantity) }
            : product
        ));
      } else {
        // If it's a new product purchase, remove the product entirely
        handleDeleteProduct(purchase.productId);
      }
    }
    setPurchases(prev => prev.filter(purchase => purchase.id !== id));
  };

  // Sale handlers
  const handleAddSale = (saleData: Omit<Sale, 'id'>) => {
    const sale: Sale = {
      ...saleData,
      id: Date.now().toString(),
    };

    setSales(prev => [...prev, sale]);

    // Update product stock
    setProducts(prev => prev.map(product => 
      product.id === sale.productId 
        ? { ...product, stock: product.stock - sale.quantity }
        : product
    ));
  };

  const handleDeleteSale = (id: string) => {
    const sale = sales.find(s => s.id === id);
    if (sale) {
      // Restore stock
      setProducts(prev => prev.map(product => 
        product.id === sale.productId 
          ? { ...product, stock: product.stock + sale.quantity }
          : product
      ));
    }
    setSales(prev => prev.filter(sale => sale.id !== id));
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} purchases={purchases} sales={sales} />;
      case 'products':
        return (
          <Products
            products={products}
            categories={categories}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'purchases':
        return (
          <Purchases
            purchases={purchases}
            products={products}
            categories={categories}
            onAddPurchase={handleAddPurchase}
            onDeletePurchase={handleDeletePurchase}
          />
        );
      case 'sales':
        return (
          <Sales
            sales={sales}
            products={products}
            onAddSale={handleAddSale}
            onDeleteSale={handleDeleteSale}
          />
        );
      case 'reports':
        return <Reports purchases={purchases} sales={sales} />;
      case 'balance':
        return <Balance purchases={purchases} sales={sales} />;
      default:
        return <Dashboard products={products} purchases={purchases} sales={sales} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGC5Y2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9InJnYmEoMTI5LCA5MiwgMjU1LCAwLjEpIi8+Cjwvc3ZnPgo=')] opacity-40"></div>
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
        user={user}
      />
      
      <main className="flex-1 relative z-10 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;