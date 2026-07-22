# contsance-createvent-demo

Site vitrine de **Constance** — mise en beauté événementielle à Laval : coiffure, maquillage et créations sur-mesure pour le mariage (Mayenne & Pays de la Loire).

Projet **Astro** multi-pages, optimisé SEO (titres/descriptions par page, JSON-LD LocalBusiness, sitemap, Open Graph), avec animations légères (menu plein écran, bannière parallaxe, compteurs, contact interactif, bouton flottant Instagram).

## Développement

```bash
npm install
npm run dev      # http://localhost:4321
```

## Build

```bash
npm run build    # -> dist/ (statique, déployable sur Netlify / Vercel)
npm run preview
```

## ⚠️ Avant mise en ligne

Remplacer le domaine placeholder `www.constance-laval.fr` par le vrai domaine dans :
- `astro.config.mjs` (`site`)
- `public/sitemap.xml`
- `public/robots.txt`

## Pages

`/` · `/histoire/` · `/prestations/` · `/galerie/` · `/contact/`
