# Gidy Profile Project

A full-stack MERN application that replicates the Gidy.ai profile page with edit functionality and innovative AI-powered features.

## Live Demo
[https://gidy-profile.vercel.app](https://gidy-profile.vercel.app) *(deploy after setup)*

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS        |
| Backend   | Node.js, Express.js (ESM)           |
| Database  | MongoDB Atlas + Mongoose            |
| AI        | Anthropic Claude API (claude-sonnet-4)|
| Hosting   | Vercel (frontend) + Render (backend)|

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Anthropic API key (for AI Bio feature)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/gidy-profile.git
cd gidy-profile
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
# Fill in MONGO_URI and ANTHROPIC_API_KEY in .env
npm install
npm run dev        # runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd client
cp .env.example .env
# Set VITE_PROFILE_ID to your seeded profile's MongoDB _id
npm install
npm run dev        # runs on http://localhost:5173
```

### 4. Seed a demo profile
```bash
# POST to http://localhost:5000/api/profile with JSON body:
{
  "name": "Farseen T",
  "title": "Final-Year Student",
  "location": "Malappuram, Kerala",
  "email": "farseen247@gmail.com",
  "bio": "I am a final-year B.Tech student and aspiring Software Developer..."
}
# Copy the returned _id into client/.env as VITE_PROFILE_ID
```

---

## API Endpoints

| Method | Endpoint                                    | Description                     |
|--------|---------------------------------------------|---------------------------------|
| GET    | /api/profile/:id                            | Get full profile                |
| POST   | /api/profile                                | Create profile                  |
| PUT    | /api/profile/:id                            | Update profile                  |
| POST   | /api/profile/:id/generate-bio               | **AI Bio Generation**           |
| POST   | /api/profile/:id/experience                 | Add experience                  |
| PUT    | /api/profile/:id/experience/:expId          | Edit experience                 |
| DELETE | /api/profile/:id/experience/:expId          | Delete experience               |
| POST   | /api/profile/:id/skills                     | Add skill                       |
| DELETE | /api/profile/:id/skills/:skillId            | Delete skill                    |
| POST   | /api/profile/:id/skills/:skillId/endorse    | **Endorse a skill**             |
| POST   | /api/profile/:id/education                  | Add education                   |
| PUT    | /api/profile/:id/education/:eduId           | Edit education                  |
| DELETE | /api/profile/:id/education/:eduId           | Delete education                |
| POST   | /api/profile/:id/certifications             | Add certification               |
| PUT    | /api/profile/:id/certifications/:certId     | Edit certification              |
| DELETE | /api/profile/:id/certifications/:certId     | Delete certification            |

---

## Innovation Features

### 1. AI-Powered Bio Generator ✨
Clicking the **"AI Bio"** button on the profile header sends the user's name, title, skills, experience, and career goals to the Claude API. Claude generates a polished, professional 2-3 sentence bio in first-person voice, which is immediately saved to the profile. The bio is cached with a timestamp so it isn't regenerated unnecessarily.

**Why this feature?** Writing a compelling bio is one of the hardest parts of building a profile. An AI that understands your actual skills and experience can produce a bio that is far more contextual and accurate than generic templates.

### 2. Skill Endorsement System 👍
Each skill badge shows a hover state with a **thumbs-up** endorsement button. Anyone can endorse a skill by entering their name. The endorsement count is shown as a badge on the skill chip, and the full list of endorsers is stored in the database. This creates social proof directly on the profile.

**Why this feature?** Endorsements (popularized by LinkedIn) give skills credibility beyond self-declaration. They add a social layer to the profile and make the skills section more trustworthy and engaging.

---

## Project Structure

```
gidy-profile/
├── client/          # React + Vite + Tailwind frontend
│   └── src/
│       ├── components/  # Navbar, profile sections, modals, UI
│       ├── context/     # ProfileContext (global state)
│       ├── pages/       # ProfilePage
│       └── services/    # Axios API layer
└── server/          # Express + Mongoose backend
    ├── models/      # Profile, Experience, Education, Skill, Certification
    ├── controllers/ # Business logic for each resource
    ├── routes/      # RESTful route definitions
    └── utils/       # AI bio generator, profile completion calculator
```
