import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../lib/categories';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('links to every category', () => {
    render(<HomePage categories={CATEGORIES} />);

    expect(screen.getByRole('link', { name: /slots/i })).toHaveProperty('pathname', '/games/slots');
    expect(screen.getAllByRole('link')).toHaveLength(CATEGORIES.length);
  });
});
