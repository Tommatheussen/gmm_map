export const appState: {
  years: string[];
  baseYear: string | null;
  compareYear: string | null;
} = $state({
  years: [],
  baseYear: null,
  compareYear: null
});
