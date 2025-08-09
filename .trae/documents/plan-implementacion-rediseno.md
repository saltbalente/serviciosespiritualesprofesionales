# Plan de Implementación - Rediseño Completo del Sitio Web

## 1. Resumen Ejecutivo

Este documento detalla el plan completo para rediseñar y reestructurar el sitio web de servicios espirituales, transformándolo en una experiencia moderna, rápida y optimizada que mantenga su esencia espiritual pero con una interfaz contemporánea y profesional.

**Objetivos Principales:**
- Crear una arquitectura HTML5 semántica moderna
- Implementar contenido completamente renovado y natural
- Optimizar rendimiento para carga ultrarrápida
- Diseñar interfaz responsive y accesible
- Maximizar SEO y conversiones

## 2. Fases del Proyecto

### Fase 1: Preparación y Análisis (Semana 1)

#### 2.1 Auditoría del Sitio Actual
- Análisis de estructura HTML existente
- Evaluación de contenido actual
- Medición de rendimiento baseline
- Identificación de elementos a conservar

#### 2.2 Configuración del Entorno
```bash
# Configuración inicial del proyecto
mkdir sitio-espiritual-renovado
cd sitio-espiritual-renovado

# Estructura de directorios
mkdir -p {
  src/{html,css,js,images,videos,fonts},
  dist,
  docs,
  tools
}

# Inicialización de package.json
npm init -y

# Instalación de herramientas de desarrollo
npm install --save-dev \
  webpack webpack-cli \
  html-webpack-plugin \
  mini-css-extract-plugin \
  css-minimizer-webpack-plugin \
  terser-webpack-plugin \
  image-webpack-loader \
  postcss postcss-loader autoprefixer \
  sass sass-loader \
  eslint prettier
```

#### 2.3 Configuración de Webpack
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { progressive: true, quality: 85 },
              optipng: { enabled: true },
              pngquant: { quality: [0.8, 0.9] },
              webp: { quality: 85 }
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: 'index.html',
      minify: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

### Fase 2: Desarrollo de Estructura HTML5 (Semana 2)

#### 2.4 Template Base HTML5
```html
<!-- src/html/base.html -->
<!DOCTYPE html>
<html lang="es" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{ page_description }}">
    <meta name="keywords" content="{{ page_keywords }}">
    
    <!-- Preload crítico -->
    <link rel="preload" href="/fonts/playfair-display-v30-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/css/critical.css" as="style">
    
    <!-- SEO y Open Graph -->
    <title>{{ page_title }}</title>
    <meta property="og:title" content="{{ page_title }}">
    <meta property="og:description" content="{{ page_description }}">
    <meta property="og:image" content="{{ og_image }}">
    <meta property="og:url" content="{{ canonical_url }}">
    <meta property="og:type" content="website">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Servicios Espirituales Profesionales",
      "description": "{{ page_description }}",
      "url": "{{ canonical_url }}",
      "telephone": "+1-555-123-4567",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Miami",
        "addressRegion": "FL",
        "addressCountry": "US"
      }
    }
    </script>
    
    <!-- CSS crítico inline -->
    <style>
    /* CSS crítico para above-the-fold */
    body{margin:0;font-family:'Open Sans',sans-serif;line-height:1.6}
    .header{background:#2C1810;color:#fff;padding:1rem 0}
    .hero{min-height:60vh;display:flex;align-items:center;background:linear-gradient(135deg,#2C1810,#8B4513)}
    </style>
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    
    <header class="site-header" role="banner">
        <!-- Navegación principal -->
    </header>
    
    <main id="main-content" role="main">
        {{ content }}
    </main>
    
    <footer class="site-footer" role="contentinfo">
        <!-- Footer content -->
    </footer>
    
    <!-- JavaScript diferido -->
    <script>
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js');
        });
    }
    </script>
</body>
</html>
```

#### 2.5 Componentes HTML Específicos

**Header con Navegación:**
```html
<!-- src/html/components/header.html -->
<header class="site-header" role="banner">
    <div class="container">
        <div class="header-content">
            <div class="site-branding">
                <h1 class="site-title">
                    <a href="/" rel="home" aria-label="Servicios Espirituales - Inicio">
                        <img src="/images/logo.svg" alt="Servicios Espirituales" width="200" height="60">
                    </a>
                </h1>
            </div>
            
            <nav class="main-navigation" role="navigation" aria-label="Navegación principal">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                    <span class="sr-only">Menú</span>
                    <span class="hamburger"></span>
                </button>
                
                <ul id="primary-menu" class="nav-menu">
                    <li><a href="/" aria-current="page">Inicio</a></li>
                    <li><a href="/servicios">Servicios</a></li>
                    <li><a href="/sobre-nosotros">Sobre Nosotros</a></li>
                    <li><a href="/testimonios">Testimonios</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/contacto" class="cta-nav">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </div>
</header>
```

**Hero Section:**
```html
<!-- src/html/components/hero.html -->
<section class="hero-section" aria-labelledby="hero-title">
    <div class="hero-background">
        <picture>
            <source media="(min-width: 768px)" srcset="/images/hero-desktop.webp" type="image/webp">
            <source media="(min-width: 768px)" srcset="/images/hero-desktop.jpg" type="image/jpeg">
            <source srcset="/images/hero-mobile.webp" type="image/webp">
            <img src="/images/hero-mobile.jpg" alt="Ambiente espiritual sereno" loading="eager">
        </picture>
    </div>
    
    <div class="container">
        <div class="hero-content">
            <h1 id="hero-title" class="hero-title">
                Encuentra tu Camino hacia la <span class="highlight">Armonía Interior</span>
            </h1>
            <p class="hero-description">
                Consultas espirituales personalizadas para el amor, la paz y el crecimiento personal. 
                Con más de 15 años de experiencia acompañando personas en su transformación espiritual.
            </p>
            <div class="hero-actions">
                <a href="/contacto" class="btn btn-primary btn-large">
                    Solicitar Consulta Personalizada
                </a>
                <a href="/servicios" class="btn btn-secondary btn-large">
                    Ver Servicios
                </a>
            </div>
        </div>
    </div>
</section>
```

### Fase 3: Desarrollo de Estilos CSS (Semana 3)

#### 2.6 Sistema de Diseño SCSS
```scss
// src/css/abstracts/_variables.scss

// Colores
$color-primary: #2C1810;
$color-secondary: #D4AF37;
$color-accent: #8B4513;
$color-light: #F5F5DC;
$color-white: #FFFFFF;
$color-text: #333333;
$color-text-light: #666666;

// Tipografía
$font-primary: 'Playfair Display', serif;
$font-secondary: 'Open Sans', sans-serif;
$font-size-base: 1rem;
$font-size-large: 1.25rem;
$font-size-xl: 1.5rem;
$font-size-xxl: 2rem;
$font-size-xxxl: 2.5rem;

// Espaciado
$spacing-xs: 0.5rem;
$spacing-sm: 1rem;
$spacing-md: 1.5rem;
$spacing-lg: 2rem;
$spacing-xl: 3rem;
$spacing-xxl: 4rem;

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

// Sombras
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);

// Transiciones
$transition-fast: 0.2s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;
```

```scss
// src/css/base/_typography.scss

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Open+Sans:wght@400;600;700&display=swap');

body {
    font-family: $font-secondary;
    font-size: $font-size-base;
    line-height: 1.6;
    color: $color-text;
    font-display: swap;
}

h1, h2, h3, h4, h5, h6 {
    font-family: $font-primary;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: $spacing-sm;
    color: $color-primary;
}

h1 {
    font-size: clamp(2rem, 5vw, $font-size-xxxl);
    font-weight: 700;
}

h2 {
    font-size: clamp(1.5rem, 4vw, $font-size-xxl);
}

h3 {
    font-size: $font-size-xl;
}

p {
    margin-bottom: $spacing-sm;
    
    &.lead {
        font-size: $font-size-large;
        font-weight: 300;
        color: $color-text-light;
    }
}

.highlight {
    color: $color-secondary;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, $color-secondary, transparent);
    }
}
```

```scss
// src/css/components/_buttons.scss

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-sm $spacing-md;
    border: 2px solid transparent;
    border-radius: 8px;
    font-family: $font-secondary;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: all $transition-normal;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left $transition-slow;
    }
    
    &:hover::before {
        left: 100%;
    }
    
    &:focus {
        outline: 2px solid $color-secondary;
        outline-offset: 2px;
    }
    
    // Variantes
    &.btn-primary {
        background: $color-secondary;
        color: $color-white;
        border-color: $color-secondary;
        
        &:hover {
            background: darken($color-secondary, 10%);
            transform: translateY(-2px);
            box-shadow: $shadow-md;
        }
    }
    
    &.btn-secondary {
        background: transparent;
        color: $color-primary;
        border-color: $color-primary;
        
        &:hover {
            background: $color-primary;
            color: $color-white;
        }
    }
    
    // Tamaños
    &.btn-large {
        padding: $spacing-md $spacing-lg;
        font-size: $font-size-large;
    }
    
    &.btn-small {
        padding: $spacing-xs $spacing-sm;
        font-size: 0.875rem;
    }
}
```

### Fase 4: JavaScript Modular (Semana 4)

#### 2.7 Estructura JavaScript
```javascript
// src/js/main.js

// Importaciones
import './modules/navigation';
import './modules/lazy-loading';
import './modules/forms';
import './modules/animations';
import './modules/performance';

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sitio web cargado exitosamente');
    
    // Inicializar módulos
    initializeNavigation();
    initializeLazyLoading();
    initializeForms();
    initializeAnimations();
    initializePerformanceMonitoring();
});

// Funciones de inicialización
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-open');
        });
    }
}

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}
```

```javascript
// src/js/modules/forms.js

export function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const errors = validateForm(form);
    
    if (errors.length === 0) {
        submitForm(form, formData);
    } else {
        displayErrors(form, errors);
    }
}

function validateForm(form) {
    const errors = [];
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push({
                field: field.name,
                message: `El campo ${field.labels[0]?.textContent || field.name} es requerido`
            });
        }
    });
    
    // Validación de email
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            errors.push({
                field: field.name,
                message: 'Por favor ingresa un email válido'
            });
        }
    });
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function submitForm(form, formData) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Estado de carga
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch(form.action || '/contact', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showSuccessMessage(form);
            form.reset();
        } else {
            throw new Error('Error en el servidor');
        }
    } catch (error) {
        showErrorMessage(form, 'Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}
```

### Fase 5: Optimización y Testing (Semana 5)

#### 2.8 Service Worker para Cache
```javascript
// public/sw.js

const CACHE_NAME = 'servicios-espirituales-v1';
const urlsToCache = [
    '/',
    '/css/main.css',
    '/js/main.js',
    '/images/logo.svg',
    '/fonts/playfair-display-v30-latin-regular.woff2',
    '/fonts/open-sans-v34-latin-regular.woff2'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devolver desde cache si existe, sino fetch de la red
                return response || fetch(event.request);
            }
        )
    );
});
```

#### 2.9 Configuración de PostCSS
```javascript
// postcss.config.js

module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano')({
            preset: 'default'
        })
    ]
};
```

#### 2.10 Scripts de Build
```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "analyze": "webpack-bundle-analyzer dist/js/*.js",
    "test": "jest",
    "lint": "eslint src/js/**/*.js",
    "format": "prettier --write src/**/*.{js,css,scss,html}",
    "optimize-images": "imagemin src/images/**/* --out-dir=dist/images",
    "audit": "lighthouse http://localhost:3000 --output=html --output-path=./audit-report.html"
  }
}
```

## 3. Cronograma de Implementación

### Semana 1: Preparación
- **Días 1-2**: Auditoría del sitio actual y configuración del entorno
- **Días 3-4**: Configuración de herramientas de desarrollo
- **Días 5-7**: Creación de wireframes y mockups

### Semana 2: Estructura HTML5
- **Días 1-3**: Desarrollo de templates base y componentes
- **Días 4-5**: Implementación de páginas principales
- **Días 6-7**: Testing de estructura y accesibilidad

### Semana 3: Estilos CSS
- **Días 1-2**: Sistema de diseño y variables
- **Días 3-4**: Componentes y layouts
- **Días 5-6**: Responsive design y optimizaciones
- **Día 7**: Testing cross-browser

### Semana 4: JavaScript
- **Días 1-2**: Funcionalidades core
- **Días 3-4**: Interacciones y animaciones
- **Días 5-6**: Formularios y validaciones
- **Día 7**: Testing de funcionalidad

### Semana 5: Optimización
- **Días 1-2**: Optimización de rendimiento
- **Días 3-4**: SEO y metadatos
- **Días 5-6**: Testing final y correcciones
- **Día 7**: Deployment y monitoreo

## 4. Métricas de Éxito

### 4.1 Rendimiento
- **Lighthouse Score**: >90 en todas las categorías
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

### 4.2 SEO
- **Core Web Vitals**: Todas en verde
- **Mobile-Friendly Test**: 100% compatible
- **Structured Data**: Sin errores
- **Page Speed Insights**: >90 móvil y desktop

### 4.3 Accesibilidad
- **WCAG 2.1 AA**: Cumplimiento completo
- **Contraste de colores**: Mínimo 4.5:1
- **Navegación por teclado**: 100% funcional
- **Screen readers**: Compatible

### 4.4 Conversión
- **Formulario de contacto**: >5% tasa de conversión
- **Tiempo en página**: >2 minutos promedio
- **Bounce rate**: <40%
- **Páginas por sesión**: >2.5

## 5. Plan de Mantenimiento

### 5.1 Actualizaciones Regulares
- **Contenido**: Revisión mensual
- **Imágenes**: Optimización trimestral
- **Dependencias**: Actualización semestral
- **Auditoría de rendimiento**: Trimestral

### 5.2 Monitoreo Continuo
- **Google Analytics**: Configuración completa
- **Google Search Console**: Monitoreo SEO
- **Uptime monitoring**: 99.9% disponibilidad
- **Error tracking**: Sentry o similar

### 5.3 Backup y Seguridad
- **Backups automáticos**: Diarios
- **SSL Certificate**: Renovación automática
- **Security headers**: Implementación completa
- **Content Security Policy**: Configuración estricta

Este plan de implementación garantiza una transformación completa del sitio web, manteniendo los más altos estándares de calidad, rendimiento y experiencia de usuario.