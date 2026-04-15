import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import '@testing-library/dom';

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: ['src/test/vite-setup.ts'],
    environment: 'jsdom',
    include: 'src/**/*.spec.ts',
    reporters: ['default', 'junit'],
    outputFile: 'test-output/vite.xml'
  },
}));
