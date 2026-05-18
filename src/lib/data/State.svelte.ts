import { CATEGORY_REGISTRY, type CategoryId } from './Categories';

export const appState: {
  years: string[];
  baseYear: string | null;
  compareYear: string | null;
} = $state({
  years: [],
  baseYear: null,
  compareYear: null
});

export const categoryVisibilityState = $state<Record<string, boolean>>(
  Object.fromEntries(Object.keys(CATEGORY_REGISTRY).map((id) => [id, true]))
);

export const categoryHighlightState = $state<{ highlight: CategoryId | null }>({ highlight: null });
