
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './useCart';


function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        <div className="position-relative">
          <img 
            src={product.image} 
            className="card-img-top" 
            alt={product.title}
            style={{ 
              height: '250px', 
              objectFit: 'contain',
              padding: '15px',
              backgroundColor: '#f8f9fa'
            }}
          />
          <span className="position-absolute top-0 start-0 badge bg-primary m-2">
            {product.category}
          </span>
        </div>
        
        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold text-truncate" title={product.title}>
            {product.title}
          </h6>
          
          <p className="card-text text-muted small flex-grow-1">
            {truncateText(product.description, 80)}
          </p>
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="h5 text-success fw-bold mb-0">
                {formatPrice(product.price)}
              </span>
              <div className="d-flex align-items-center">
                <div className="me-1">
                  {renderStars(product.rating.rate)}
                </div>
                <small className="text-muted">({product.rating.count})</small>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary flex-fill"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                View Details
              </button>
              <button className="btn btn-primary flex-fill" onClick={() => addToCart(product, 1)}>
                <i className="bi bi-cart-plus me-1"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;