// eslint-env jest
/* eslint-disable no-undef */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductList from '../components/ProductList';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          title: 'Test Product 1',
          description: 'Description 1',
          price: 10,
          image: 'img1.jpg',
          category: 'cat1',
          rating: { rate: 4, count: 5 }
        },
        {
          id: 2,
          title: 'Test Product 2',
          description: 'Description 2',
          price: 20,
          image: 'img2.jpg',
          category: 'cat2',
          rating: { rate: 5, count: 10 }
        }
      ])
    })
  );
});
afterEach(() => {
  jest.resetAllMocks();
});

describe('ProductList', () => {
  it('renders products after fetch', async () => {
    render(<ProductList />);
    expect(screen.getByText(/Loading Products/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Test Product 1')).toBeInTheDocument());
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  it('filters products by category', async () => {
    render(<ProductList />);
    await waitFor(() => expect(screen.getByText('Test Product 1')).toBeInTheDocument());
    const select = screen.getByDisplayValue('All Categories');
    fireEvent.change(select, { target: { value: 'cat1' } });
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
  });
});
