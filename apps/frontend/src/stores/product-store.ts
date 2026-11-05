import { create } from 'zustand';
import type { ProductCondition } from '@/types/api';

type CatalogFiltersState = {
  search: string;
  condition: ProductCondition | 'all';
  category: string;
  brand: string;
  sort: string;
  setFilter: <K extends keyof Omit<CatalogFiltersState, 'setFilter' | 'reset'>>(
    key: K,
    value: CatalogFiltersState[K],
  ) => void;
  reset: () => void;
};

const initialFilters = {
  search: '',
  condition: 'all' as const,
  category: 'all',
  brand: 'all',
  sort: 'default',
};

export const useCatalogFiltersStore = create<CatalogFiltersState>((set) => ({
  ...initialFilters,
  setFilter: (key, value) => set({ [key]: value }),
  reset: () => set(initialFilters),
}));
