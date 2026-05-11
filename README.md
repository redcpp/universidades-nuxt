# Universidades México

🔗 **[Demo en vivo → https://universidades-mexico.pages.dev](https://universidades-mexico.pages.dev)**

Buscador de 3,467 universidades y 27,798 carreras de México — ultra rápido, sin servidor, con búsqueda difusa instantánea.

![OG Image](/og-image.png)

## 📸 Screenshots

### Landing page
![Landing](/screenshots/landing.png)

### Buscador con resultados
![Buscador](/screenshots/buscador.png)

### Perfil de universidad
![Universidad](/screenshots/universidad.png)

### Vista mobile
![Mobile](/screenshots/mobile.png)

## ✨ Features

- 🔍 **Búsqueda difusa instantánea** con Fuse.js (sin servidor)
- 🗺️ **Navegación por estado** — 33 estados de México
- 🏫 **Perfiles de universidad** con carreras, tipo, y ubicación
- ⚡ **7,000+ páginas estáticas** generadas en ~14 segundos
- 📱 **100% responsive** con Tailwind CSS
- 🌐 **CDN global** vía Cloudflare Pages
- 🔒 **HTTPS forzado**

## 🛠️ Tech Stack

| Tecnología | Uso |
|------------|-----|
| [Nuxt 3](https://nuxt.com) | Framework Vue 3 con SSG |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [Fuse.js](https://fusejs.io) | Búsqueda difusa client-side |
| [Cloudflare Pages](https://pages.cloudflare.com) | Hosting estático + CDN |

## 📊 Datos

- **33** estados de México
- **3,467** universidades
- **27,798** carreras
- Fuente: SEP (Secretaría de Educación Pública)

## ⚡ Performance

- **7,000+ páginas** generadas estáticamente en ~14 segundos
- **Zero backend** — todo es estático o client-side
- **CDN global** vía Cloudflare
- **Búsqueda instantánea** con Fuse.js (sin servidor)

## 🏗️ Migración desde Django

| Aspecto | Antes (Django) | Ahora (Nuxt 3) |
|---------|---------------|----------------|
| Backend | Django 1.11 + SQLite | Ninguno (SSG) |
| Frontend | jQuery + UIkit | Vue 3 + Tailwind |
| Mapa | CSSMap Plugin jQuery (26MB sprites) | Grilla responsive de tarjetas |
| Búsqueda | NLTK + PostgreSQL-like | Fuse.js client-side |
| Hosting | No tenía | Cloudflare Pages gratis |
| Deploy | Manual | `npm run generate` + `wrangler deploy` |

## 🤔 ¿Por qué este stack?

Elegí **SSG con Nuxt 3** porque este proyecto es puramente informativo: 3,467 universidades y 27,798 carreras que cambian muy poco. Generar 7,000+ páginas estáticas elimina por completo el costo de servidor, maximiza el SEO (cada universidad tiene su URL indexable), y permite servir desde un CDN global gratis.

**Fuse.js** fue la elección natural para búsqueda: es liviano (~10KB), no requiere backend, y ofrece búsqueda difusa (typo-tolerant) que mejora la UX significativamente frente a un filtro simple. Cloudflare Pages completa la ecuación con hosting gratuito, HTTPS automático y edge caching global.

## 🗺️ Roadmap

- [ ] Filtros avanzados por área de conocimiento (medicina, ingeniería, derecho)
- [ ] Comparador side-by-side de universidades
- [ ] Visualización de estadísticas por estado (gráficas interactivas)

## 🧞 Comandos

```bash
# Instalar
npm install

# Desarrollo
npm run dev

# Generar estático
npm run generate

# Preview local
npm run preview

# Deploy
npm run deploy
```

## 📝 Notas

- Los datos se exportaron una vez desde `db.sqlite3` a `public/data/universidades.json`
- El scraper original de SEP está descontinuado, por lo que los datos son una snapshot histórica
- Todas las rutas de universidad y estado son pre-renderadas para SEO máximo
