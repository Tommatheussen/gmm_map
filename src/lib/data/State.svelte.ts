import { CATEGORY_LIST } from './Categories';

export const appState: {
  years: string[];
  baseYear: string | null;
  compareYear: string | null;
} = $state({
  years: [],
  baseYear: null,
  compareYear: null
});

export const categoryVisibilityState = $state<Record<number, boolean>>(
  Object.fromEntries(CATEGORY_LIST.map((category) => [category.fixed_id, true]))
);

export const categoryHighlightState = $state<{ highlight: number | null }>({ highlight: null });
