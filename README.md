# AquaGas Website

Smart LPG Distribution Platform

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run linting
npm run lint:fix
```

## Project Structure

```
aquagas-website/
├── public/
│   ├── images/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   ├── api.js
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.js
│   ├── styles/
│   ├── App.jsx
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_KEY=your_key_here
```

## Features

- ✅ Product Catalog
- ✅ Shopping Cart
- ✅ Order Management
- ✅ User Authentication
- ✅ Wallet System
- ✅ Real-time Tracking

## Tech Stack

- React 18
- React Router v6
- Axios
- React Hot Toast
- Lucide React Icons
- Tailwind CSS
- Framer Motion

## Build & Deploy

```bash
# Build production
npm run build

# The build folder is ready to be deployed
```

## Support

For support, email support@aquagas.co.ke
