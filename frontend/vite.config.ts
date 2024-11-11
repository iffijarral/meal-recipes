import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This makes Vite listen on all network interfaces (accessible from outside Docker)
    port: 5173,        // Ensure this is the correct port
  },
})
