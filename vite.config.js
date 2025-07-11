import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/insights-dashboard-qloo/', // must match GitHub repo name
});
