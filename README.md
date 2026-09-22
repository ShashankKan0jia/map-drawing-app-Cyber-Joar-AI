# Map Drawing App

A React + TypeScript map-drawing application built with Vite and Leaflet.

## Features

- Interactive OpenStreetMap view through React Leaflet.
- Draw rectangles, polygons, circles, and polylines.
- Configurable limits for drawn shape types.
- Polygon containment and overlap checks using Turf-based utilities.
- Automatic trimming of overlapping polygon geometry when possible.
- Delete drawn features and export the current feature set.

## Tech stack

- React + TypeScript
- Vite
- Leaflet / React Leaflet
- Leaflet Draw
- Turf

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```
