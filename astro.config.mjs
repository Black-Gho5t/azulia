// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

function photosAssetBridge() {
	return {
		name: 'photos-asset-bridge',
		hooks: {
			'astro:build:done': async () => {
				const clientDir = path.resolve('dist/client');
				const srcPhotos = path.resolve('src/assets/photos_azulia_webp');
				const targetSrcAssets = path.resolve(clientDir, 'src/assets/photos_azulia_webp');
				const targetPublic = path.resolve(clientDir, 'photos_azulia_webp');

				if (existsSync(srcPhotos)) {
					mkdirSync(path.dirname(targetSrcAssets), { recursive: true });
					cpSync(srcPhotos, targetSrcAssets, { recursive: true });
					cpSync(srcPhotos, targetPublic, { recursive: true });
					console.log('[asset-bridge] photos_azulia_webp bundled to dist/client successfully.');
				}
			},
		},
	};
}

export default defineConfig({
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [photosAssetBridge()],
	vite: {
		server: {
			watch: {
				ignored: [
					'**/mso*.tmp',
					'**/*.tmp',
					'**/~$*',
				],
			},
		},
		optimizeDeps: {
			exclude: ['firebase'],
		},
		plugins: [
			{
				name: 'serve-photos-azulia-alias',
				configureServer(server) {
					server.middlewares.use((req, res, next) => {
						if (req.url && req.url.startsWith('/photos_azulia_webp/')) {
							req.url = req.url.replace('/photos_azulia_webp/', '/src/assets/photos_azulia_webp/');
						}
						next();
					});
				},
			},
		],
	},
});
