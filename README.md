# 🚀 Full-Stack Portfolio Website

A modern, responsive portfolio website with 3D animations, admin panel, and MongoDB backend.

![Portfolio](https://img.shields.io/badge/Portfolio-Live-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## ✨ Features

- **3D Animated Background** - Interactive particle system using Three.js
- **Responsive Design** - Works perfectly on all devices
- **Admin Panel** - Full content management system
- **Secure Authentication** - SHA-256 password hashing
- **REST API** - Complete backend with Express.js
- **Cloud Database** - MongoDB Atlas for data persistence
- **Auto Deployment** - GitHub integration with Vercel

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Three.js for 3D graphics
- Responsive design with Flexbox/Grid

### Backend
- Node.js & Express.js
- MongoDB Atlas (Cloud Database)
- RESTful API architecture

### Deployment
- Vercel (Serverless Functions)
- GitHub (Version Control)
- Automatic CI/CD

## 📁 Project Structure

```
portfolio/
├── api/                    # Serverless API functions
│   ├── index.js           # Main API routes
│   └── login.js           # Authentication endpoint
├── css/
│   ├── style.css          # Portfolio styles
│   └── admin.css          # Admin panel styles
├── js/
│   ├── script.js          # Portfolio functionality
│   ├── admin.js           # Admin panel logic
│   └── api.js             # API client
├── index.html             # Main portfolio page
├── admin.html             # Admin panel
├── login.html             # Login page
├── create-admin.js        # Admin user creation script
├── server.js              # Local development server
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Rashi343/portfolio.git
cd portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Create admin user**
```bash
npm run create-admin
```
Enter your email and password when prompted.

4. **Start development server**
```bash
npm start
```

5. **Open in browser**
- Portfolio: http://localhost:3000
- Admin Login: http://localhost:3000/login
- Admin Panel: http://localhost:3000/admin

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com/
- Click "Import Project"
- Select your GitHub repository
- Click "Deploy"

3. **Access your live site**
- Portfolio: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/login`

### Environment Setup

The MongoDB connection string is configured in:
- `server.js` (local development)
- `api/index.js` (production)
- `api/login.js` (authentication)

**MongoDB Atlas Configuration:**
1. Go to https://cloud.mongodb.com/
2. Navigate to "Network Access"
3. Add IP: `0.0.0.0/0` (Allow from anywhere)
4. Go to "Database Access"
5. Ensure user has "Read and write" permissions

## 📚 API Documentation

### Authentication

**POST** `/api/login`
```json
Request:
{
  "email": "admin@example.com",
  "password": "yourpassword"
}

Response:
{
  "success": true,
  "token": "hashed_token"
}
```

### Projects

**GET** `/api/projects` - Get all projects

**POST** `/api/projects` - Create project
```json
{
  "name": "Project Name",
  "description": "Description",
  "image": "https://image-url.com",
  "tags": ["React", "Node.js"],
  "link": "https://project-url.com"
}
```

**PUT** `/api/projects/:id` - Update project

**DELETE** `/api/projects/:id` - Delete project

### Skills

**GET** `/api/skills` - Get all skills (grouped by category)

**POST** `/api/skills` - Add skill
```json
{
  "category": "Front-End",
  "name": "React"
}
```

**DELETE** `/api/skills/:id` - Delete skill

### Messages

**GET** `/api/messages` - Get all contact messages

**POST** `/api/messages` - Submit contact form
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "Your message here"
}
```

### About

**GET** `/api/about` - Get about section

**POST** `/api/about` - Update about section
```json
{
  "image": "https://profile-image.com",
  "bio1": "First paragraph",
  "bio2": "Second paragraph"
}
```

### Settings

**GET** `/api/settings` - Get site settings

**POST** `/api/settings` - Update settings
```json
{
  "favicon": "https://favicon-url.com",
  "title": "Site Title",
  "footer": "Footer Text",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "twitter": "https://twitter.com/username"
}
```

## 🔐 Admin Panel Features

### Dashboard Sections

1. **Projects Management**
   - Add new projects with images and tags
   - Edit existing projects
   - Delete projects
   - Real-time preview

2. **Skills Management**
   - Add skills by category
   - Remove skills
   - Organized by categories

3. **About Section**
   - Update profile image
   - Edit bio paragraphs
   - Live preview

4. **Messages**
   - View contact form submissions
   - See sender details and timestamps

5. **Settings**
   - Update favicon
   - Change site title
   - Edit footer text
   - Update social media links

## 🔒 Security Features

- SHA-256 password hashing
- Token-based authentication
- CORS protection
- Input validation
- MongoDB injection prevention
- Secure API endpoints

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 992px
- Touch-friendly navigation
- Optimized images
- Fast loading times

## 🎨 Customization

### Change Colors
Edit `css/style.css` and `css/admin.css`:
```css
/* Primary color */
--primary: #818CF8;

/* Background */
--bg-dark: #0a0f1f;
```

### Modify 3D Animation
Edit `js/script.js`:
```javascript
const particleCount = 500; // Number of particles
particles.rotation.y += 0.0005; // Rotation speed
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check Network Access in MongoDB Atlas
- Verify credentials in connection string
- Ensure IP whitelist includes `0.0.0.0/0`

### Deployment Fails
- Check Vercel logs
- Verify `vercel.json` configuration
- Ensure all dependencies are in `package.json`

### Admin Login Not Working
- Create admin user: `npm run create-admin`
- Check MongoDB Atlas connection
- Verify password is correct

## 📝 Scripts

```bash
npm start          # Start local server
npm run dev        # Start with nodemon (auto-reload)
npm run create-admin  # Create admin user
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Rashi Dev**
- GitHub: [@Rashi343](https://github.com/Rashi343)
- Email: robkhan343@gmail.com

## 🙏 Acknowledgments

- Three.js for 3D graphics
- MongoDB Atlas for database
- Vercel for hosting
- Express.js for backend

## 📞 Support

For support, email robkhan343@gmail.com or open an issue on GitHub.

---

**Made with ❤️ by Rashi Dev**
