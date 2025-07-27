# TechCube Fullstack Application

A modern fullstack web application built with React (Frontend) and Node.js/Express (Backend).

## 🚀 Features

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Nodemailer
- **Security**: Rate limiting, Helmet, CORS protection
- **SEO**: Sitemap, robots.txt, meta tags
- **Performance**: Lazy loading, compression, optimization
- **Responsive**: Mobile-first design

## 📁 Project Structure

```
my-fullstack-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── helpers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   ├── env.example
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   ├── env.example
│   └── vite.config.ts
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-fullstack-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/env.example frontend/.env
   # Edit frontend/.env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build frontend and install backend dependencies
- `npm run start` - Start production backend server
- `npm run install:all` - Install dependencies for all packages

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001,https://techcube.in
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_SITE_URL=https://techcube.in
VITE_APP_NAME=TechCube
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse of API endpoints
- **Helmet**: Security headers for Express
- **CORS**: Configured for specific origins
- **Input Validation**: Sanitizes user inputs
- **Error Handling**: Centralized error management

## 📊 Performance Optimizations

- **Lazy Loading**: React components loaded on demand
- **Compression**: Gzip compression for responses
- **Caching**: Static file caching
- **Bundle Optimization**: Vite build optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 