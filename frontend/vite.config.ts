import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  define: {
    // Aqui está a mágica:
    global: 'window',
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // expõe em todas as interfaces de rede (0.0.0.0)
    port: 3000, // opcional, mas deixa explícito
  },
})