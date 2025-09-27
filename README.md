# Shodhan Ayurveda - Frontend

A modern React-based frontend application for Shodhan Ayurveda, providing a comprehensive platform for Ayurvedic healthcare services, disease information, and clinic management.

## 🌟 Features

- **Disease Information**: Comprehensive database of Ayurvedic diseases with detailed information
- **Service Booking**: Online appointment booking for consultations and treatments
- **Clinic Directory**: Find and connect with Ayurvedic clinics
- **Blog System**: Educational content and health articles
- **Admin Dashboard**: Content management system for administrators
- **Responsive Design**: Mobile-friendly interface with Bootstrap

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1
- **UI Framework**: React Bootstrap 2.10.10
- **Routing**: React Router DOM 7.8.2
- **HTTP Client**: Axios 1.11.0
- **Build Tool**: Vite 7.1.2
- **Styling**: Bootstrap 5.3.8 + Custom CSS

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API server (see [shodhan-backend](https://github.com/aman7011/shodhan-backend))

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/aman7011/shodhan-frontend.git
   cd shodhan-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your backend API URL
   # VITE_API_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── styles/             # CSS stylesheets
├── utils/              # Utility functions
├── config/             # Configuration files
└── assets/             # Static assets
```

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |

## 🏗️ Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

This project can be deployed to various platforms:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3 + CloudFront**: For scalable static hosting

### Environment Variables for Production

Make sure to set `VITE_API_URL` to your production backend URL in your deployment platform.

## 🔐 Admin Features

The application includes an admin dashboard with:
- Blog management (create, edit, delete posts)
- Content moderation
- User authentication
- Password management

## 🌐 API Integration

This frontend connects to the Shodhan Ayurveda backend API. See the [backend repository](https://github.com/aman7011/shodhan-backend) for API documentation.

## 🎨 Customization

- **Styling**: Modify files in `src/styles/`
- **Components**: Add new components in `src/components/`
- **Pages**: Create new pages in `src/pages/`
- **API Endpoints**: Update `src/config/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email your-email@example.com or create an issue in this repository.

## 🔗 Related Repositories

- [Shodhan Backend](https://github.com/aman7011/shodhan-backend) - REST API server
