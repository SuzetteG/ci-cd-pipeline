import React from 'react';
import { useCart } from './useCart';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p className="lead">Browse products and add them to your cart.</p>
        <Link to="/products" className="btn btn-primary">Shop Now</Link>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(({ product, quantity }) => (
              <tr key={product.id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img src={product.image} alt={product.title} style={{ width: 60, height: 60, objectFit: 'contain' }} />
                    <span>{product.title}</span>
                  </div>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>{quantity}</td>
                <td>{formatPrice(product.price * quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-end">
        <h4>Total: {formatPrice(total)}</h4>
      </div>
    </div>
  );
}

export default Cart;
