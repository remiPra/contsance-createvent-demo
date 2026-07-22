import { defineConfig } from "astro/config";

// ⚠️ Rémi : remplace l'URL par le vrai domaine de Constance avant déploiement
export default defineConfig({
  site: "https://www.constance-laval.fr",
  build: { inlineStylesheets: "never" },
});
