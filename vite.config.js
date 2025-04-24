export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    allowedHosts: ['pokedex-9f8m.onrender.com'],
  },
});
