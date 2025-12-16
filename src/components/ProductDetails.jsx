import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setDeleteSuccess(true);
      
      // Show success message for 2 seconds, then redirect
      setTimeout(() => {
        navigate('/products', { 
          state: { message: `Product "${product.title}" has been deleted successfully.` }
        });
      }, 2000);

    } catch (err) {
      setError(`Failed to delete product: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddToCart = () => {
    // Placeholder for cart functionality
    alert(`Added ${quantity} x "${product.title}" to cart!\n\nTotal: ${formatPrice(product.price * quantity)}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-warning">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-warning">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-muted">☆</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading Product Details...</h4>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Product Not Found</h4>
          <p>{error || 'The requested product could not be found.'}</p>
          <hr />
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="bg-light py-3">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none">Products</Link>
            </li>
            <li className="breadcrumb-item">
              <span className="text-capitalize">{product.category}</span>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.title}
            </li>
          </ol>
        </div>
      </nav>

      <div className="container my-5">
        {/* Delete Success Message */}
        {deleteSuccess && (
          <div className="alert alert-success text-center mb-4" role="alert">
            <h5 className="alert-heading">✅ Product Deleted Successfully!</h5>
            <p>The product has been removed from the store. Redirecting to products page...</p>
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="row g-5">
          {/* Product Image */}
          <div className="col-lg-6">
            <div className="position-sticky" style={{ top: '2rem' }}>
              <div className="card border-0 shadow-sm">
                <img 
                  src={product.image} 
                  className="card-img-top"
                  alt={product.title}
                  style={{ 
                    height: '500px', 
                    objectFit: 'contain',
                    padding: '2rem',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              {/* Back to Products Button */}
              <button 
                className="btn btn-outline-secondary mt-3"
                onClick={() => navigate('/products')}
              >
                ← Back to Products
              </button>
            </div>
          </div>

          {/* Product Information */}
          <div className="col-lg-6">
            {/* Category */}
            <div className="mb-3">
              <span className="badge bg-primary fs-6 text-capitalize mb-3">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="display-5 fw-bold mb-4">{product.title}</h1>

            {/* Description */}
            <div className="mb-4">
              <h4 className="h5 mb-3">Product Description</h4>
              <p className="lead">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="d-flex align-items-center mb-4">
              <div className="me-2">
                {renderStars(product.rating.rate)}
              </div>
              <span className="text-muted">
                ({product.rating.count} reviews) • {product.rating.rate}/5
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="display-4 fw-bold text-success">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Purchase Options */}
            <div className="card border-0 bg-light">
              <div className="card-body">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Quantity</label>
                    <div className="input-group">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center" 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Total Price</label>
                    <div className="h4 text-success mt-2">
                      {formatPrice(product.price * quantity)}
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart ({quantity} items)
                  </button>
                  
                  <button 
                    className="btn btn-warning btn-lg"
                    onClick={() => navigate(`/product/${product.id}/edit`)}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Product
                  </button>
                  
                  <button 
                    className="btn btn-danger btn-lg"
                    onClick={handleDelete}
                    disabled={deleting || deleteSuccess}
                  >
                    {deleting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Deleting...</span>
                        </div>
                        Deleting Product...
                      </>
                    ) : deleteSuccess ? (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Deleted Successfully
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-2"></i>
                        Delete Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="mt-4">
              <div className="row text-center">
                <div className="col-4">
                  <div className="p-3">
                    <i className="bi bi-truck display-6 text-primary mb-2"></i>
                    <h6>Free Shipping</h6>
                    <small className="text-muted">On orders over $50</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3">
                    <i className="bi bi-shield-check display-6 text-success mb-2"></i>
                    <h6>Secure Payment</h6>
                    <small className="text-muted">100% protected</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3">
                    <i className="bi bi-arrow-clockwise display-6 text-info mb-2"></i>
                    <h6>Easy Returns</h6>
                    <small className="text-muted">30 day policy</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;