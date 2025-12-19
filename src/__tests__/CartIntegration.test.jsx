import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import ProductDetails from '../components/ProductDetails';
import Navigation from '../components/Navigation';
import { CartProvider } from '../components/CartContext';

// Only mock the hooks, not the whole module!
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => jest.fn(),
  };
});

import { MemoryRouter } from 'react-router-dom';

describe('Cart Integration', () => {
  jest.setTimeout(15000);
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 1,
          title: 'Test Product',
          description: 'Test Description',
          price: 10,
          image: 'img.jpg',
          category: 'cat1',
          rating: { rate: 4, count: 5 }
        })
      })
    );
    window.alert = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('adds item to cart and updates cart badge', async () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <>
            <Navigation />
            <ProductDetails />
          </>
        </MemoryRouter>
      </CartProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Product' })).toBeInTheDocument();
    });
    const addButton = screen.getByText(/Add to Cart/);
    fireEvent.click(addButton);
    // Check for cart badge update (should be 1)
    expect(screen.getByText('1', { selector: '.badge.bg-primary' })).toBeInTheDocument();
  });
});
