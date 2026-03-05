# Gidy Profile Project

A high-fidelity full-stack MERN application that replicates the profile page from [Gidy.ai](https://gidy.ai) with powerful edit functionality, AI-enhanced features, and a polished, responsive user experience.

---

## 🎯 Project Overview

This is a complete implementation of the **"The Profile Project"** challenge from Gidy.ai. The application demonstrates end-to-end full-stack development capabilities, from database schema design to pixel-perfect CSS implementation.

### Core Features ✅

- **Responsive Profile UI**: Pixel-perfect replica of the Gidy.ai profile page with a clean, modern design
- **Live Data Integration**: Fetch and display profile data from a RESTful backend
- **Edit Mode**: Seamless edit experience to update profile information with instant persistence
- **Comprehensive Profile Sections**: Name, Bio, Profile Picture, Social Links, Skills, Experience, Education, and Certifications
- **Dark Mode**: Toggle between light and dark themes with persistent settings
- **Profile Completion Tracker**: Visual indicator showing profile completeness

---

## 📱 Live Demo & Code

- **Live Link**: [https://gidy-profile.vercel.app](https://gidy-profile-alpha.vercel.app/)
- **GitHub Repository**: [https://github.com/farseent/gidy-profile](https://github.com/farseent/Gidy-Profile)

---

## 🛠 Tech Stack

| Layer        | Technology                           | Purpose                   |
| ------------ | ------------------------------------ | ------------------------- |
| **Frontend** | React                                | UI framework & build tool |
| **Styling**  | Tailwind CSS                         | Utility-first CSS         |
| **Backend**  | Node.js + Express.js (ESM)           | RESTful API server        |
| **Database** | MongoDB + Mongoose                   | NoSQL data persistence    |
| **AI**       | Grok API                             | AI bio generation         |
| **Hosting**  | Vercel (frontend) + Render (backend) | Production deployment     |
| **HTTP**     | Axios                                | Frontend API client       |
| **Utils**    | UUID, Dotenv                         | Utilities & configuration |

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** and npm
- **MongoDB Atlas** account (free tier available) or local MongoDB instance
- **Anthropic API key** (for AI bio generation feature)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gidy-profile.git
cd gidy-profile
```

### 2. Backend Setup

```bash
cd server

# Create environment file
cp .env.example .env

# Edit .env and add these variables:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gidy-profile
# GROQ_API_KEY=gsk-your-api-key-here
# PORT=5000

# Install dependencies and run
npm install
npm run dev        # Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../client

# Create environment file
cp .env.example .env

# Edit .env and add:
# REACT_API_BASE_URL=http://localhost:5000

npm install
npm run dev        # Frontend runs on http://localhost:3000
```

### 4. Seed Initial Profile Data

Open your browser and POST to `http://localhost:5000/api/profile`:

```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "title": "Your Title",
    "location": "City, Country",
    "email": "your-email@example.com",
    "bio": "Your professional bio...",
    "profileImage": "https://example.com/image.jpg",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/yourprofile",
      "github": "https://github.com/yourprofile",
      "twitter": "https://twitter.com/yourprofile"
    }
  }'
```

The response will include an `_id`. Update `client/.env`:

```
# REACT_APP_PROFILE_ID=<paste-the-id-here>
```

---

## 📚 API Documentation

### Profile Endpoints

| Method | Endpoint                        | Description                                  |
| ------ | ------------------------------- | -------------------------------------------- |
| GET    | `/api/profile/:id`              | Retrieve complete profile                    |
| POST   | `/api/profile`                  | Create new profile                           |
| PUT    | `/api/profile/:id`              | Update profile information                   |
| POST   | `/api/profile/:id/generate-bio` | **AI Generate bio from skills & experience** |

### Skills & Endorsements

| Method | Endpoint                                   | Description          |
| ------ | ------------------------------------------ | -------------------- |
| POST   | `/api/profile/:id/skills`                  | Add skill to profile |
| DELETE | `/api/profile/:id/skills/:skillId`         | Remove skill         |

### Experience, Education & Certifications

| Method | Endpoint                                  | Description          |
| ------ | ----------------------------------------- | -------------------- |
| POST   | `/api/profile/:id/experience`             | Add work experience  |
| PUT    | `/api/profile/:id/experience/:expId`      | Update experience    |
| DELETE | `/api/profile/:id/experience/:expId`      | Delete experience    |
| POST   | `/api/profile/:id/education`              | Add education        |
| PUT    | `/api/profile/:id/education/:eduId`       | Update education     |
| DELETE | `/api/profile/:id/education/:eduId`       | Delete education     |
| POST   | `/api/profile/:id/certifications`         | Add certification    |
| PUT    | `/api/profile/:id/certifications/:certId` | Update certification |
| DELETE | `/api/profile/:id/certifications/:certId` | Delete certification |

---

## 💡 Innovation Features

### 1. AI-Powered Bio Generator ✨

**Feature Description**:
Clicking the **"Generate Bio with AI"** button on the profile header intelligently compiles the user's name, professional title, skills, experience highlights, and career goals. This data is sent to the Claude API, which generates a polished, professional 2-3 sentence bio in first-person voice. The generated bio is instantly saved to the database and displayed on the profile. Results are cached to prevent unnecessary API calls.

**Why This Feature?**
Writing a compelling professional bio is often the most challenging part of profile creation. Users either leave it blank or produce generic descriptions. This AI feature solves that by understanding the user's actual experience and creating contextual, authentic bios that are far more effective than templates. It transforms disconnected profile data into a cohesive professional narrative.

**Technical Implementation**:

- Backend integration with Grok API
- Intelligent context gathering from multiple profile sections
- Database caching with timestamp tracking
- Seamless UI/UX with loading states and success feedback

---

### 2. Dark Mode with Persistent Settings 🌙

**Feature Description**:
The app features a fully-implemented dark mode toggle accessible in the navbar. All components are styled with both light and dark themes. User theme preference is persisted to localStorage, so the setting is remembered across sessions.

**Why This Feature?**
Modern applications need accessibility and user preference support. Dark mode reduces eye strain in low-light environments and provides aesthetic preference choice. Persistence ensures users don't have to toggle it on every visit.

---

### 3. Profile Completion Tracker 📊

**Feature Description**:
A visual progress indicator on the profile shows completion percentage based on filled sections. This guides users to complete their profile comprehensively.

**Why This Feature?**
Encourages users to provide complete information, resulting in richer, more professional profiles. The visual indicator creates a sense of progression and achievement.

---

## 📁 Project Structure

```
gidy-profile/
│
├── client/                           # React Frontend
│   ├── public/
│   │   └── index.html               # Entry HTML file
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx       # Navigation with dark mode toggle
│   │   │   ├── profile/
│   │   │   │   ├── ProfileHeader.jsx          # Name, title, bio, image
│   │   │   │   ├── SkillsSection.jsx          # Skills 
│   │   │   │   ├── ExperienceSection.jsx      # Work history
│   │   │   │   ├── EducationSection.jsx       # Educational background
│   │   │   │   ├── CertificationSection.jsx   # Certifications
│   │   │   │   ├── CareerGoals.jsx            # Career vision
│   │   │   │   └── ProfileCompletion.jsx      # Completion tracker
│   │   │   ├── modals/
│   │   │   │   ├── EditProfileModal.jsx       # Profile info editor
│   │   │   │   ├── AddSkillModal.jsx          # Add skill form
│   │   │   │   ├── AddExperienceModal.jsx     # Add experience form
│   │   │   │   ├── AddEducationModal.jsx      # Add education form
│   │   │   │   ├── AddCertificationModal.jsx  # Add certification form
│   │   │   │   └── AddSocialsModal.jsx        # Social links editor
│   │   │   └── ui/
│   │   │       ├── DarkModeToggle.jsx         # Theme switcher
│   │   │       └── LoadingSpinner.jsx         # Loading indicator
│   │   ├── context/
│   │   │   ├── ProfileContext.jsx             # Global profile state
│   │   │   └── DarkModeContext.jsx            # Dark mode state
│   │   ├── pages/
│   │   │   └── ProfilePage.jsx                # Main profile page
│   │   ├── services/
│   │   │   └── api.js                         # Axios API client
│   │   ├── utils/
│   │   │   └── helpers.js                     # Utility functions
│   │   ├── App.jsx                            # Root component
│   │   ├── index.css                          # Global styles
│   │   └── index.js                           # App entry point
│   ├── tailwind.config.js                     # Tailwind configuration
│   ├── package.json
│   └── README.md
│
├── server/                           # Express.js Backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── models/
│   │   ├── Profile.js              # User profile schema
│   │   ├── Skill.js                # Skill 
│   │   ├── Experience.js           # Work experience
│   │   ├── Education.js            # Educational records
│   │   └── Certification.js        # Certifications
│   ├── controllers/
│   │   ├── profileController.js    # Profile CRUD logic
│   │   ├── skillController.js      # Skill 
│   │   ├── experienceController.js # Experience CRUD logic
│   │   ├── educationController.js  # Education CRUD logic
│   │   └── certificationController.js # Certification CRUD logic
│   ├── routes/
│   │   ├── profileRoutes.js        # Profile endpoints
│   │   ├── skillRoutes.js          # Skill endpoints
│   │   ├── experienceRoutes.js     # Experience endpoints
│   │   ├── educationRoutes.js      # Education endpoints
│   │   └── certificationRoutes.js  # Certification endpoints
│   ├── middleware/
│   │   └── errorHandler.js         # Error handling middleware
│   ├── utils/
│   │   ├── generateBio.js          # AI bio generation logic
│   │   └── profileCompletion.js    # Completion percentage calc
│   ├── uploads/                    # File storage for avatar and resume
│   ├── server.js                   # Express app setup
│   ├── package.json
│   └── .env.example
│
├── README.md                         # This file
└── .gitignore
```

---

## 🎨 Code Quality & Architecture Highlights

### Frontend

- **Component-Based Architecture**: Modular, reusable React components
- **State Management**: Context API for global profile and theme state
- **Responsive Design**: Mobile-first Tailwind CSS implementation
- **Modal-Driven Editing**: Non-disruptive edit experience with dedicated modals
- **Error Handling**: Graceful error states and user feedback

### Backend

- **RESTful Design**: Clean, consistent API endpoints following REST conventions
- **Separation of Concerns**: Controllers, models, and routes properly separated
- **Database Abstraction**: Mongoose ODM for schema validation and type safety
- **Error Middleware**: Centralized error handling across the application
- **Utility Functions**: Reusable functions for AI integration and calculations

---

## 🚢 Deployment Instructions

### Frontend (Vercel)

```bash
# Login to Vercel
vercel login

# Deploy from client/ directory
cd client
vercel --prod
```

### Backend (Render)

```bash
# Push to GitHub, then:
# 1. Go to https://render.com
# 2. Create new service
# 3. Connect GitHub repo
# 4. Set environment variables (MONGO_URI, GROK_API_KEY)
# 5. Deploy
```

---

## 📝 Environment Variables Reference

### Backend (.env)

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/gidy-profile
ANTHROPIC_API_KEY=skg-your-api-key
PORT=5000
NODE_ENV=production
```

### Frontend (.env)

```env
VITE_API_BASE_URL=https://gidy-profile-backend.onrender.com
VITE_PROFILE_ID=<your-profile-mongodb-id>
```

---

## 🎓 Key Learnings & Design Decisions

1. **MERN Stack**: Chose MongoDB for flexibility, Express for familiarity, and React for component reusability
2. **Tailwind CSS**: Utility-first approach allowed rapid UI development while maintaining consistency
3. **Grok AI**: Integrated for bio generation to add meaningful, differentiating value beyond a static clone
4. **Dark Mode**: Implemented using Context API for global state, localStorage for persistence

---

## 📞 Support & Contact

For questions or issues, contact: **farseen247@gmail.com**

---

## 📄 License

This project is open source and available under the MIT License.

---
