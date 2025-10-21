import type { FixedCategory } from '$lib/interfaces/Category';

export const CATEGORY_REGISTRY: ReadonlyMap<number, FixedCategory> = new Map([
  [
    44,
    {
      z_index: 0,
      name: 'Light Green Camping Grounds',
      color: '#CADC8C',
      ground: true
    }
  ],
  [
    35,
    {
      z_index: 1,
      name: 'Grounds',
      color: '#8D8D8D',
      ground: true
    }
  ]
]);

// Optional helper:
export const CATEGORY_LIST = Object.entries(CATEGORY_REGISTRY).map(([fixed_id, data]) => ({
  fixed_id,
  ...data
}));
