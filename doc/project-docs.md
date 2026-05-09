# [NOMBRE DEL PROYECTO] — Documentación de Producto v0.1
> ⚠️ Nombre pendiente de decidir. Opciones sugeridas al final del documento.
> Última actualización: Mayo 2025 | Estado: Pre-MVP | Fundador: Solo

---

## ÍNDICE
1. [PRD — Product Requirements Document](#1-prd)
2. [Architecture Decision Record](#2-architecture-decision-record)
3. [Roadmap por Fases](#3-roadmap)
4. [Business Model](#4-business-model)
5. [Contexto para Claude Code / OpenCode](#5-contexto-para-ia)

---

## 1. PRD

### 1.1 El Problema

Los desarrolladores de juegos web nativos (HTML5/WebGL/WASM) tienen un problema estructural de distribución:

**Los portales les dan tráfico pero se quedan con su audiencia.**

Cuando Marta publica un juego en Poki o CrazyGames consigue miles de jugadores. Pero esos jugadores "pertenecen" a Poki. Cuando Marta lanza su siguiente juego, no tiene forma de avisarles. No tiene emails, no tiene seguidores, no tiene comunidad propia. El tráfico se evapora entre proyecto y proyecto.

Para compensar, hace TikTok → manda a la gente a un enlace de bio → pero ese destino es una página mal optimizada o directamente itch.io, que tampoco le da los datos.

**El resultado:** cada juego nuevo empieza desde cero. Sin base de fans acumulada. Sin retención entre lanzamientos.

### 1.2 Insight Clave

> "Cuando la gente juega a mi juego en Poki, dicen 'he jugado a un juego de Poki', no dicen 'he jugado al juego de Marta'."
> — Marta, dev indie con juegos en portales masivos

El problema no es la distribución. Marta ya tiene distribución. El problema es la **identidad de marca y la fidelización** fuera de portales de terceros.

### 1.3 La Solución

Una **página de perfil + hub de juegos** que vive completamente fuera de los portales.

El dev comparte **su link** en TikTok, Discord, Reddit, Twitter. El jugador llega, juega en 2 segundos sin instalar nada, y puede seguir al dev directamente en Discord. El dev acumula su propia comunidad, lanzamiento tras lanzamiento.

```
FLUJO ACTUAL (roto):
TikTok → itch.io o Poki → juega → cierra pestaña → nunca vuelve

FLUJO CON ESTE PRODUCTO:
TikTok → [tu perfil] → juega → sigue en Discord → recibe aviso del próximo juego
```

### 1.4 Usuarios Objetivo

Basado en validación real con 3 perfiles reales:

| Perfil | Descripción | Prioridad |
|--------|-------------|-----------|
| **Marta** (Dev con tráfico) | Ya publica en portales masivos, TikTok activo, quiere convertir ese tráfico en comunidad propia | **P0 — Usuario principal MVP** |
| **Javi** (Dev novato) | Primer juego publicado, busca visibilidad inicial, aprende el ecosistema | P1 — Versión futura |
| **Carlos** (Dev pro / estudio pequeño) | Infraestructura propia, problema de monetización con adblock | P2 — No es el target inicial |

**El MVP se construye exclusivamente para Marta.** Javi y Carlos son fases posteriores.

### 1.5 Propuesta de Valor

> "Tu juego va a Poki. Tus jugadores se quedan contigo."

Para el dev, no para el jugador. El cliente que paga es el dev.

### 1.6 Métricas de Éxito del MVP

El MVP es exitoso si, con Marta como beta tester usando tráfico real de TikTok:

- [ ] Al menos **30 jugadores** siguen su Discord desde la plataforma en las primeras 2 semanas
- [ ] La tasa de conversión **visita → clic Discord** supera el 5%
- [ ] El tiempo de carga de la página en 4G móvil está **por debajo de 2 segundos**
- [ ] Marta dice que **recomendaría la herramienta** a otro dev indie (NPS > 8)

### 1.7 Scope del MVP

**DENTRO del MVP:**
- Página de perfil pública del dev (`/[username]`)
- Grid de juegos con thumbnail, título y descripción corta
- Juego embebido en modal fullscreen (iframe), carga instantánea
- Botón "Seguir en Discord" prominente, por encima del fold en móvil
- Tracking de eventos: visitas, partidas iniciadas, clics en Discord
- Panel de admin para gestionar perfil y juegos (protegido con auth)
- Dashboard básico de stats (últimos 7 días)
- Mobile-first obligatorio

**FUERA del MVP (no se toca):**
- Marketplace o catálogo público de devs
- Cuentas de jugadores / sistema de seguimiento entre usuarios
- Email capture o push notifications
- Sistema de pagos o freemium
- Comentarios, valoraciones, reviews
- Más de 1 canal de "seguir" (solo Discord en v1)
- Búsqueda o discovery entre devs
- Múltiples temas visuales

### 1.8 User Stories MVP

**Como dev (Marta):**
- Puedo crear mi perfil con nombre, bio, avatar y link de Discord
- Puedo añadir mis juegos con título, descripción, thumbnail y URL del iframe
- Puedo ver cuánta gente ha visitado mi página, iniciado partidas y clicado en Discord
- Puedo ordenar mis juegos y marcarlos como publicados o borrador

**Como jugador (anónimo):**
- Puedo ver el perfil de Marta y todos sus juegos de un vistazo
- Puedo hacer clic en un juego y jugarlo en 2 segundos sin instalar nada
- Puedo unirme al Discord de Marta con un solo clic
- Todo funciona igual de bien en mi móvil que en el ordenador

---

## 2. Architecture Decision Record

### 2.1 Stack Elegido

```
Frontend + Backend  →  Next.js 14 (App Router)
Base de datos       →  Supabase (PostgreSQL)
Auth                →  Supabase Auth
Storage             →  Supabase Storage (thumbnails, avatares)
Hosting             →  Vercel
Estilos             →  Tailwind CSS
```

### 2.2 Por Qué Estas Decisiones

**Next.js 14 App Router**
- Server-side rendering = páginas de juego que cargan rápido en móvil sin JS bloqueante
- File-based routing = estructura de código predecible para Claude Code y OpenCode
- API Routes integradas = no necesitas servidor separado en MVP
- Deploy en Vercel sin configuración

**Supabase**
- Tier gratuito suficiente para MVP (500MB DB, 1GB storage, 50k auth users)
- PostgreSQL real = consultas SQL directas, sin limitaciones de NoSQL
- Auth integrado con RLS (Row Level Security) = seguridad sin código extra
- SDK de JavaScript bien documentado y soportado por modelos de IA
- Alternativa a Firebase pero open source y sin lock-in

**Vercel**
- CDN global = baja latencia en móvil en cualquier país
- Previews automáticas por PR = puedes enseñarle a Marta cambios antes de publicar
- Deploy desde Git = un push y está en producción

**Tailwind CSS**
- Responsive por defecto = mobile-first sin media queries manuales
- Los modelos de IA generan Tailwind correctamente el 90% del tiempo
- Sin archivos CSS separados que mantener

**Lo que se decidió NO usar:**
- ~~Firebase~~ → Supabase tiene menos vendor lock-in y SQL real
- ~~Prisma~~ → Innecesario, Supabase client es suficiente para MVP
- ~~Redux~~ → Zustand o estado local de React es suficiente
- ~~MongoDB~~ → No tiene ventajas reales aquí sobre PostgreSQL

### 2.3 Schema de Base de Datos

```sql
-- Perfiles de desarrolladores
CREATE TABLE devs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  discord_invite_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Juegos de cada dev
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id UUID REFERENCES devs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  game_url TEXT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking de eventos (anónimo)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id UUID REFERENCES devs(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'page_view' | 'game_start' | 'discord_click'
  session_id TEXT,           -- UUID generado en cliente, sin datos personales
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 Decisiones de UX Clave

- **Modal fullscreen para jugar**, no nueva pestaña. Mantiene al jugador en el perfil del dev.
- **Discord como único canal de follow en v1**. Email y push son más fricción y menor conversión en gaming.
- **Sin cuentas de jugador**. Zero fricción. El jugador no necesita registrarse para nada.
- **Tracking 100% anónimo**. Session ID generado en cliente, sin cookies de terceros, sin GDPR complejo en MVP.
- **El botón de Discord siempre visible en móvil**, encima del fold. Es la métrica principal del MVP.

---

## 3. Roadmap

### Fase 0 — Fundación (Semana 0, AHORA)
**Objetivo:** Proyecto configurado y listo para construir.

- [ ] Repositorio GitHub creado
- [ ] Proyecto Next.js 14 inicializado con Tailwind
- [ ] Proyecto Supabase creado, schema aplicado
- [ ] Deploy inicial vacío en Vercel conectado a GitHub
- [ ] Variables de entorno configuradas
- [ ] Dominio temporal o subdominio de Vercel activo
- [ ] Este documento en el repo como `docs/PRD.md`

**Criterio de salida:** La URL de Vercel muestra "Hello World" y Supabase tiene las tablas creadas.

---

### Fase 1 — MVP Core (Semanas 1-2)
**Objetivo:** Marta puede crear su perfil, subir sus juegos, y un jugador puede llegar y jugar.

**Semana 1:**
- [ ] Página de perfil pública (`/[username]`) con grid de juegos
- [ ] Modal de juego con iframe fullscreen
- [ ] Botón de Discord funcional con tracking de clic
- [ ] Tracking de page_view y game_start

**Semana 2:**
- [ ] Panel de admin (`/admin`) protegido con Supabase Auth
- [ ] CRUD de perfil (editar nombre, bio, avatar, link Discord)
- [ ] CRUD de juegos (añadir, editar, reordenar, publicar/despublicar)
- [ ] Dashboard básico de stats (visitas / plays / discord clicks últimos 7 días)
- [ ] Optimización mobile: prueba en iPhone y Android real

**Criterio de salida:** Marta puede hacer el setup completa y autónomamente, sin ayuda del fundador.

---

### Fase 2 — Beta Real (Semanas 3-4)
**Objetivo:** Marta mete tráfico TikTok real. Observamos, medimos, corregimos.

- [ ] Marta configura su perfil con sus juegos reales
- [ ] Marta sube contenido en TikTok con el link
- [ ] Seguimiento diario de métricas de las métricas de éxito del MVP
- [ ] Lista de bugs y friction points reportados por Marta
- [ ] Fixes basados en datos reales (no suposiciones)
- [ ] Invitar a Javi a probar → feedback del perfil novato

**Criterio de salida:** Se cumplen las métricas de éxito definidas en el PRD (sección 1.6).

---

### Fase 3 — Crecimiento Temprano (Mes 2+)
*Solo se diseña en detalle cuando Fase 2 valida las hipótesis.*

- Multi-dev: más devs pueden crear su perfil
- Landing page pública con devs destacados (primer paso de discovery)
- Freemium: límite de seguidores / stats avanzados
- Email capture como segunda opción al Discord
- Custom domains (`marta.com` apuntando al perfil)
- Compartir partida concreta con deep link (la idea de Carlos)

---

### Fase 4 — Plataforma (Mes 4+)
*La visión larga. No se planifica ahora.*

- Catálogo público de devs y juegos
- Sistema de discovery y recomendaciones
- Multiplayer fácil (sala con URL única)
- Mods y contenido generado por comunidad
- Monetización para devs (micropagos, suscripciones)

---

## 4. Business Model

### 4.1 Cliente que Paga

El **dev indie** (perfil Marta), no el jugador. Los jugadores son el producto que se le entrega al dev.

### 4.2 Modelo de Ingresos

**Freemium SaaS**

| Plan | Precio | Límites |
|------|--------|---------|
| Free | 0€/mes | Hasta 1.000 seguidores Discord acumulados, stats de 7 días, 5 juegos |
| Pro | 12€/mes | Seguidores ilimitados, stats de 90 días, juegos ilimitados, custom domain |

*Precio validado directamente con Marta: "10-15€/mes me parece justo si funciona de verdad."*

### 4.3 Potencial de Ingresos (Conservador)

```
Año 1, escenario conservador:
  50 devs en Pro × 12€/mes = 600€ MRR = 7.200€ ARR

Año 1, escenario realista:
  200 devs en Pro × 12€/mes = 2.400€ MRR = 28.800€ ARR

Año 2, si hay tracción real:
  500 devs en Pro × 12€/mes = 6.000€ MRR = 72.000€ ARR
```

### 4.4 Canales de Adquisición

- **Inicial:** Red de contactos directa (Javi, Marta, sus conexiones)
- **Comunidades:** r/indiegaming, r/gamedev, itch.io forums, GameDev.net, Discord servers de gamedev
- **Contenido:** Casos de éxito reales ("Marta consiguió 200 seguidores en Discord en 2 semanas")
- **Producto:** Cada perfil de dev que se comparte en TikTok es un anuncio del producto

### 4.5 Costes Operativos MVP

```
Vercel (Pro si supera límites free)  →  20€/mes
Supabase (Pro si supera límites)     →  25€/mes
Dominio                               →  10-15€/año
Total MVP                             →  ~50€/mes máximo
```

El negocio es rentable desde el primer dev de pago.

---

## 5. Contexto para IA

*Esta sección es para pegar al inicio de sesiones de Claude Code u OpenCode.*

```
CONTEXTO DEL PROYECTO:

Estoy construyendo una plataforma llamada [NOMBRE] que es un hub de perfil 
para desarrolladores de juegos web nativos.

PROBLEMA: Los devs indie publican juegos en Poki/CrazyGames y pierden a su 
audiencia porque el portal se queda con los jugadores. No pueden hacer 
retargeting ni avisar de nuevos lanzamientos.

SOLUCIÓN: Una página de perfil propia que vive FUERA de los portales. 
El dev comparte este link en TikTok/Discord. Los jugadores juegan en 2 
segundos (iframe), hacen clic en Discord, y el dev acumula su comunidad.

STACK: Next.js 14 App Router + Supabase + Tailwind + Vercel

USUARIO PRINCIPAL: Devs con juegos ya publicados que usan TikTok para 
traer tráfico. Mobile-first crítico. Velocidad crítica.

FASE ACTUAL: [indicar fase actual según el roadmap]

SCHEMA BD: [pegar schema SQL de la sección 2.3]

SCOPE ACTUAL (no salir de esto):
- [listar solo lo de la fase en curso]

LO QUE NO ENTRA EN SCOPE:
- Marketplace, cuentas de jugador, pagos, push notifications, 
  email, múltiples temas, búsqueda, ratings, comentarios.
```

---

## Nombre del Proyecto

Pendiente de decidir. Criterios: fácil de recordar, funciona como dominio, 
no suena corporativo, transmite instantaneidad y juegos web.

**Opciones sugeridas:**
- **Playfolio** — portfolio + play. Claro y descriptivo.
- **GameCard** — como una tarjeta de presentación para tus juegos.
- **DevArcade** — arcade del dev. Tiene energía de gaming.
- **Launchplay** — lanzas + juegas. Transmite el CTA.
- **Hubgame / Gamehub** — descriptivo pero genérico.

Elegir nombre antes de Fase 1. Afecta al dominio y al branding del perfil de Marta.

---

*Documento vivo. Actualizar con cada decisión importante o cambio de dirección.*
