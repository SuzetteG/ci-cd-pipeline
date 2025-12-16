import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Fetch products from FakeStore API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading Products...</h4>
          <p className="text-muted">Fetching the latest products from our store</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Products</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <button 
              className="btn btn-outline-danger"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header and Controls */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <h2 className="display-6 fw-bold">Our Products</h2>
          <p className="text-muted">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <div className="col-lg-4">
          <div className="row g-2">
            <div className="col-sm-6">
              <select 
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="row g-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-search display-1 text-muted"></i>
          </div>
          <h4>No products found</h4>
          <p className="text-muted">
            No products match your current filters. Try adjusting your search criteria.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedCategory('all');
              setSortBy('default');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Category Stats */}
      <div className="mt-5 pt-4 border-top">
        <h5 className="text-center mb-4">Shop by Category</h5>
        <div className="row text-center">
          {categories.filter(cat => cat !== 'all').map(category => {
            const count = products.filter(p => p.category === category).length;
            return (
              <div key={category} className="col-6 col-md-3 mb-3">
                <button
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="fw-bold">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                  <small>({count} items)</small>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductList;