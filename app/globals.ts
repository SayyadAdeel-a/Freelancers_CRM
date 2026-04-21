export type Theme = 'light' | 'dark';

export interface AppTheme {
  theme: Theme;
  toggleTheme: () => void;
}