import { create } from 'zustand';

export interface ThemeState {
	theme: string;
	setTheme: (theme: string) => void;
}

const useThemeStore = create<ThemeState>(set => ({
	theme: localStorage.getItem('theme') || 'dark',
	setTheme: (theme: string) => {
		set({ theme });
		localStorage.setItem('theme', theme);
	}
}));

export default useThemeStore;
