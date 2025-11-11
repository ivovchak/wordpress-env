import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		outDir: 'assets/dist',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'assets/src/main.css'),
			},
			output: {
				assetFileNames: '[name].[ext]',
			},
		},
		minify: true,
		sourcemap: false,
	},
});
