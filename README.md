# Job Board - Full Stack MERN Application

A modern, responsive job board application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS.

admin username : musa
admin password : musa1234

live link : https://jobboard-xkoh.onrender.com

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Job Listings**: Browse jobs with search and filter functionality
- **Job Search**: Filter by keywords, location, and job type
- **Job Application**: Apply to jobs with resume URL and cover letter
- **Admin Panel**: Manage jobs (Create, Read, Update, Delete)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **React Router**: Smooth navigation between pages
- **Context API**: Global state management for jobs and applications

### Backend Features
- **RESTful API**: Well-structured API endpoints
- **MongoDB Integration**: Efficient data storage and retrieval
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing enabled
- **Search Functionality**: Text-based search across job fields

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 📁 Project Structure

\`\`\`
job-board/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   ├── server.js           # Server entry point
│   └── package.json
└── README.md
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/musaKhan87/JobBoard.git
   cd job-board
   \`\`\`

2. **Install server dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Install client dependencies**
   \`\`\`bash
   cd ../frontend
   npm install
   \`\`\`

4. **Set up environment variables**
   
   Create a \`.env\` file in the server directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/jobboard
   PORT=5000
   NODE_ENV=development
   \`\`\`

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

6. **Start the development servers**
   
   Terminal 1 (Backend):
   \`\`\`bash
   cd backend
   npm start
   \`\`\`
   
   Terminal 2 (Frontend):
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`

7. **Open your browser**
   
   Navigate to \`http://localhost:5173\` to view the application.

## 📚 API Documentation

### Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/jobs\` | Get all jobs |
| GET | \`/api/jobs/:id\` | Get single job |
| POST | \`/api/jobs\` | Create new job (admin) |
| PUT | \`/api/jobs/:id\` | Update job (admin) |
| DELETE | \`/api/jobs/:id\` | Delete job (admin) |

### Applications Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/apply/:jobId\` | Submit job application |
| GET | \`/api/apply/job/:jobId\` | Get applications for job (admin) |
| GET | \`/api/apply\` | Get all applications (admin) |
| PUT | \`/api/apply/:id/status\` | Update application status (admin) |

### Example API Requests

**Create a new job:**
\`\`\`json
POST /api/jobs
{
  "title": "Frontend Developer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "description": "We are looking for a skilled frontend developer...",
  "salary": 90000,
  "type": "Full-time"
}
\`\`\`

**Submit job application:**
\`\`\`json
POST /api/apply/60f7b3b3b3b3b3b3b3b3b3b3
{
  "name": "John Doe",
  "email": "john@example.com",
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am interested in this position..."
}
\`\`\`

## 🎨 UI Components

### Key Components
- **JobCard**: Displays job information in a card format
- **SearchBar**: Handles job search and filtering
- **Navbar**: Navigation component with routing
- **LoadingSpinner**: Loading state indicator
- **Footer**: Site footer with links and information

### Pages
- **JobListings**: Main page displaying all jobs
- **ApplyJob**: Job application form
- **AdminPanel**: Admin interface for job management

## 🔧 Development



### Database Schema

**Job Model:**
\`\`\`javascript
{
  title: String (required),
  company: String (required),
  location: String (required),
  description: String (required),
  salary: Number,
  type: String (enum: ['Full-time', 'Part-time', 'Contract', 'Remote']),
  requirements: [String],
  benefits: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

**Application Model:**
\`\`\`javascript
{
  jobId: ObjectId (ref: 'Job'),
  name: String (required),
  email: String (required),
  resumeUrl: String (required),
  coverLetter: String,
  status: String (enum: ['pending', 'reviewed', 'shortlisted', 'rejected']),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🚀 Deployment

### Production Build

1. **Build the React app:**
   \`\`\`bash
   cd client
   npm run build
   \`\`\`

2. **Set production environment variables**

3. **Deploy to your preferred platform:**
   - **Heroku**: Use the provided Procfile
   - **Vercel**: Deploy the client separately
   - **DigitalOcean**: Use App Platform or Droplets
   - **AWS**: Use Elastic Beanstalk or EC2


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing library
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database
- Express.js for the minimal web framework
- Lucide React for the beautiful icons

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🚀**
\`\`\`

This is a complete, beautiful, and fully functional job board application built with the MERN stack. The application includes:

✅ **Beautiful Frontend**: Modern, responsive design with Tailwind CSS
✅ **Full CRUD Operations**: Create, read, update, and delete jobs
✅ **Search & Filter**: Advanced job search functionality
✅ **Job Applications**: Complete application system
✅ **Admin Panel**: Job management interface
✅ **Context API**: Global state management
✅ **RESTful API**: Well-structured backend API
✅ **MongoDB Integration**: Efficient data storage
✅ **Responsive Design**: Works on all devices
✅ **Error Handling**: Comprehensive error management
✅ **Database Seeding**: Sample data for testing

The application is production-ready and includes all the features requested in the assignment. You can run it locally by following the setup instructions in the README file.
