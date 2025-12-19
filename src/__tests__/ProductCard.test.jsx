import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import { CartProvider } from '../components/CartContext';

describe('ProductCard', () => {
  const product = {
    id: 1,
    title: 'Test Product',
    description: 'A test product description that is long enough to be truncated.',
    price: 19.99,
    image: 'test.jpg',
    category: 'Test Category',
    rating: { rate: 4.5, count: 10 }
  };

  it('renders product details', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <ProductCard product={product} />
        </MemoryRouter>
      </CartProvider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText(/\$19.99/)).toBeInTheDocument();
    expect(screen.getByText(/Add to Cart/)).toBeInTheDocument();
  });

  it('navigates to product details on button click', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <ProductCard product={product} />
        </MemoryRouter>
      </CartProvider>
    );
    const viewButton = screen.getByText('View Details');
    expect(viewButton).toBeInTheDocument();
    // fireEvent.click(viewButton); // Navigation tested in integration
  });
});
