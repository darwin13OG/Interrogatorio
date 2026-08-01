# 🕵️‍♂️ Unidad de Investigación Criminal - Sistema de Interrogatorios

Un sistema interactivo de juego de misterio e interrogatorios criminales desarrollado en **React 19**, **TypeScript**, **Tailwind CSS** e integrado con la API de **Google Gemini 3.6 Flash**.

El juego pone al usuario en el rol de detective de la policía judicial con la misión de interrogar a sospechosos, detectar contradicciones lógicas entre sus declaraciones y 3 evidencias físicas, y emitir un veredicto final en un máximo de **10 preguntas**.

---

## 🌟 Características Principales

- **💬 Interrogatorio Realista en Personaje**: El sospechoso responde de acuerdo a su personalidad (arrogante, nervioso, frío, encantador) y reacciona progresivamente a las preguntas del detective.
- **📊 Medidor de Nerviosismo Progresivo**: Visualización en tiempo real del estado emocional del sospechoso (`Tranquilo` → `Prevenido` → `Nervioso` → `Acorralado` → `Desmoronado`).
- **📁 Expediente y Evidencias Físicas**: Inspección detallada de 3 pistas clave del crimen con botón de acceso rápido para "Citar Evidencia" durante el interrogatorio.
- **✨ Generación de Casos Únicos con IA**: Genera infinitos casos misteriosos nuevos utilizando la API de Gemini 3.6 Flash o juega con expedientes predeterminados.
- **📋 Libreta de Notas del Detective**: Panel lateral para tomar apuntes personales y mantener una lista de comprobación de hipótesis.
- **📱 Totalmente Responsivo (PC y Celular)**: Interfaz adaptada para escritorio y pantallas móviles con selector rápido de pestañas (`Interrogatorio` / `Expediente`).
- **🛡️ Modo Resiliente / Offline Fallback**: Funciona tanto en servidores Node.js completos como en alojamientos estáticos (Cloudflare Pages, Netlify, Vercel).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React (Iconos).
- **Backend**: Node.js, Express.
- **IA**: `@google/genai` (SDK Oficial de Google Gemini - Modelo `gemini-3.6-flash`).

---

## 🚀 Instalación y Configuración Local

### 1. Requisitos Previos
- Node.js 18.x o superior.
- Una clave API de Google Gemini (puedes obtenerla gratuitamente en [Google AI Studio](https://aistudio.google.com/)).

### 2. Pasos para Ejecutar
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env e introduce tu clave GEMINI_API_KEY:
# GEMINI_API_KEY=tu_clave_de_gemini_aqui

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ☁️ Guía de Despliegue en Cloudflare Pages

### ¿Por qué salía la página en blanco en Cloudflare Pages?

Si al subir los archivos a GitHub y conectar Cloudflare Pages obtienes una página en blanco, se debe a una de estas razones principales:

1. **Directorio de salida incorrecto (Output Directory)**:
   - En la configuración de Cloudflare Pages, debes asegurarte de colocar como **Build output directory**: `dist`. Si se deja en blanco o con otro nombre (`public` o `build`), Cloudflare no encontrará los archivos compilados por Vite.
2. **Rutas relativas de assets en Vite**:
   - Ya hemos configurado `base: './'` en `vite.config.ts` para garantizar que los archivos CSS y JS carguen correctamente sin importar el subdominio.
3. **Enrutamiento SPA (Single Page Application)**:
   - Agregamos el archivo `public/_redirects` con el contenido `/* /index.html 200` para que cualquier ruta redirija correctamente al HTML principal.
4. **Servidor Node vs Alojamiento Estático**:
   - Cloudflare Pages aloja únicamente archivos estáticos (`dist`). Si no configuras la variable de entorno `GEMINI_API_KEY` en Cloudflare Pages, la aplicación utiliza automáticamente su **motor de respaldo local integrado en el cliente**, garantizando que el juego nunca se rompa ni muestre una pantalla en blanco.

### Configuración Recomendada en Cloudflare Pages:

- **Framework preset**: `Vite` (o None)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variables**: `GEMINI_API_KEY` (Opcional si deseas usar la API oficial en producción).

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT.
