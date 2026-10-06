import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/AG-Home/",
  root: "src",
  server: {headers:{'Cross-Origin-Opener-Policy':'same-origin-allow-popups'}},

  build: {
    outDir: "../dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        home: resolve(__dirname, "src/home.html"),
        about: resolve(__dirname, "src/about.html"),
        team: resolve(__dirname, "src/team.html"),
        contact: resolve(__dirname, "src/contact.html"),
        control: resolve(__dirname, "src/control.html"),
        privacy: resolve(__dirname, "src/privacy.html"),
        products: resolve(__dirname, "src/products.html"),
        authAction: resolve(__dirname, "src/auth-action.html")
      }
    }
  },

  publicDir: "../public",
  envDir: ".."
});
