# Impactor-2025

A professional React PWA for simulating asteroid impacts using NASA NeoWs data, featuring 3D orbit visualization and impact analysis.

## Features

- **NASA NEO Browser**: Browse and search Near-Earth Objects using NASA's NeoWs API
- **3D Orbit Visualization**: Interactive Three.js visualization of asteroid orbits with real-time animation
- **Impact Physics**: Calculate impact parameters including energy, devastation radius, and crater size
- **Interactive Map**: Leaflet-based map to visualize impact locations and affected areas
- **PWA Support**: Installable as a Progressive Web App with offline capabilities
- **Responsive Design**: Professional UI that works on desktop and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Three.js** for 3D orbital mechanics visualization
- **Leaflet** for interactive mapping
- **Tailwind CSS** for styling
- **PWA** with Workbox for offline support

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Project Structure

- `/src/components` - React components
- `/src/utils` - Utility functions for physics and orbital calculations
- `/src/types` - TypeScript type definitions
- `/public` - Static assets and PWA icons

## License

MIT
