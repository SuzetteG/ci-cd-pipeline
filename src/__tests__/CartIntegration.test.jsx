import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetails from '../components/ProductDetails';

// Mock useParams and useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('Cart Integration', () => {
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

  it('shows alert when Add to Cart is clicked', async () => {
    render(<ProductDetails />);
    await waitFor(() => expect(screen.getByText('Test Product')).toBeInTheDocument());
    const addButton = screen.getByText(/Add to Cart/);
    fireEvent.click(addButton);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Added 1 x "Test Product" to cart')
    );
  });
});
