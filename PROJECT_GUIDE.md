# 🏋️ AI Fitness Trainer & Scheduler Chatbot

A full-stack AI-powered fitness training and scheduling application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Google's Gemini AI**.

## 🌟 Features

### Core Features Implemented ✅

1. **AI-Powered Fitness Chat**
   - Natural conversation with AI fitness trainer using Google Gemini API
   - Personalized workout recommendations
   - Exercise form corrections and tips
   - Nutrition advice
   - Goal-based guidance
   - Context-aware responses with chat history

2. **User Authentication**
   - Secure signup/login with JWT
   - Password hashing with bcrypt
   - Protected routes with middleware
   - User profile management with fitness details

3. **Persistent Chat History**
   - All conversations saved to MongoDB
   - Loads last 20 messages for AI context
   - Survives server restarts
   - Each user has separate chat history
   - View and clear history options

4. **Personalized Workout Plans**
   - AI-generated workout plans based on:
     - Fitness level (beginner/intermediate/advanced)
     - Goals (weight loss, muscle gain, endurance, etc.)
     - Available equipment
     - Time constraints
     - Injuries/limitations

5. **Exercise Recommendations**
   - Muscle group-specific exercises
   - Equipment-based filtering
   - Difficulty levels
   - Detailed form instructions

6. **User Profile System**
   - Age, gender, height, weight
   - Fitness level and activity level
   - Goals and target weight
   - Equipment preferences
   - Dietary restrictions
   - Injury tracking
   - Workout streak counter

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database with multiple schemas
- **Google Gemini AI** (`gemini-1.5-flash`) - AI chatbot intelligence
- **JWT** (jsonwebtoken) - Secure authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Auto-restart on file changes (dev)

### Frontend
- **React 19** - UI framework with hooks
- **React Router v6** - Navigation and routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with animations and gradients

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema with auth & profile
│   │   ├── Workout.js        # Exercise, Workout, Schedule, Progress schemas
│   │   └── ChatMessage.js    # Chat history schema (NEW)
│   ├── routes/
│   │   ├── auth.js           # Authentication routes (signup/login/profile)
│   │   └── chat.js           # AI chat routes with DB persistence
│   ├── services/
│   │   └── gemini.js         # Gemini AI integration service
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── db.js                 # MongoDB connection with error handling
│   ├── server.js             # Express server setup with all routes
│   ├── .env                  # Environment variables (DO NOT COMMIT)
│   └── package.json          # Backend dependencies
│
├── src/
│   ├── components/
│   │   ├── Auth.jsx          # Login/Signup component with tabs
│   │   └── Chat.jsx          # Chat interface with AI responses
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context & state
│   ├── utils/
│   │   └── api.js            # Axios instance with interceptors
│   ├── styles/
│   │   ├── Auth.css          # Auth component styles
│   │   └── Chat.css          # Chat component styles (242 lines)
│   ├── App.jsx               # Main app with routing logic
│   ├── App.css               # Global styles
│   ├── main.jsx              # React entry point
│   └── index.css             # Base CSS
│
├── .env                      # Frontend environment variables
├── package.json              # Frontend dependencies
├── vite.config.js            # Vite configuration
└── PROJECT_GUIDE.md          # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API key (free tier available)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd AI-Fitness-Trainer-and-Scheduler-Chat-Bot---5th-sem
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Installed Packages:**
- express@5.1.0
- mongoose@8.19.2
- @google/generative-ai@0.24.1
- bcryptjs@3.0.2
- jsonwebtoken@9.0.2
- cors@2.8.5
- dotenv@16.6.1
- axios@1.13.1
- nodemon@3.1.10 (dev dependency)

### 3. Configure Environment Variables

Create `backend/.env`:

```env
# MongoDB Connection (Replace with your credentials)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/AI_Fitness_ChatBot_DB?retryWrites=true&w=majority

# Server Port
PORT=5000

# JWT Secret (Random string - make it long and complex)
JWT_SECRET=fitness-chatbot-super-secret-key-2025-xyz789abc456def!@#

# Gemini API Key (Get from: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-actual-gemini-api-key-here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

**IMPORTANT NOTES:**
- ❌ Do NOT use quotes around values in .env file
- ✅ Correct: `GEMINI_API_KEY=AIzaSyABC123...`
- ❌ Wrong: `GEMINI_API_KEY="AIzaSyABC123..."`
- JWT_SECRET is just a random string YOU create (no need to get it anywhere)
- Never commit .env file to git

### 4. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Paste it in `backend/.env` as `GEMINI_API_KEY`
6. Free tier includes 15 requests per minute

**Model Used:** `gemini-1.5-flash` (works with free API keys)

### 5. Frontend Setup

```bash
cd ..  # Return to root directory
npm install
```

**Installed Packages:**
- react@19.1.1
- react-dom@19.1.1
- react-router-dom@7.9.5
- axios@1.13.1
- vite@7.1.7

Create `.env` in root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

## 🎮 Running the Application

### Option 1: Development Mode (Recommended)

**Start Backend with Nodemon (Auto-restart on changes):**
```bash
cd backend
npm run dev
```

You'll see:
```
[nodemon] 3.1.10
[nodemon] watching path(s): *.*
[nodemon] starting `node server.js`
🚀 Server is running on port 5000
📍 http://localhost:5000
🤖 AI Fitness Trainer API Ready!
🔗 Mongoose connected to MongoDB
✅ MongoDB Connected: <your-cluster>
📦 Database Name: AI_Fitness_ChatBot_DB
```

**Nodemon Benefits:**
- Auto-restarts on file changes
- No manual restart needed
- Type `rs` to manually restart
- Watches .js, .json, .mjs, .cjs files

**Start Frontend (in new terminal):**
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Option 2: Production Mode

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
npm run build
npm run preview
```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

```javascript
POST   /api/auth/signup
Body: { name: string, email: string, password: string }
Response: { success: boolean, token: string, user: object }

POST   /api/auth/login
Body: { email: string, password: string }
Response: { success: boolean, token: string, user: object }

GET    /api/auth/me (Protected)
Headers: { Authorization: "Bearer <token>" }
Response: { success: boolean, user: object }

PUT    /api/auth/profile (Protected)
Body: { profile: object, goals: object, preferences: object }
Response: { success: boolean, user: object }
```

### Chat Routes (`/api/chat`)

```javascript
POST   /api/chat/message (Protected)
Body: { message: string }
Response: { success: boolean, message: string, timestamp: string }
// Saves to database and returns AI response

POST   /api/chat/workout-plan (Protected)
Response: { success: boolean, workoutPlan: string, userProfile: object }
// Generates personalized workout plan

POST   /api/chat/exercises (Protected)
Body: { muscleGroup: string, equipment: string, difficulty: string }
Response: { success: boolean, exercises: string }

GET    /api/chat/history (Protected)
Query: { limit: number } (default: 50)
Response: { success: boolean, history: array, count: number }
// Returns chat history from database

DELETE /api/chat/history (Protected)
Response: { success: boolean, deletedCount: number }
// Clears all chat history for user
```

## 🗄️ Database Schemas

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profile: {
    age: Number,
    gender: String (male/female/other),
    height: Number (cm),
    weight: Number (kg),
    fitnessLevel: String (beginner/intermediate/advanced),
    activityLevel: String (sedentary/light/moderate/active/very-active)
  },
  goals: {
    targetWeight: Number,
    fitnessGoal: String (weight-loss/muscle-gain/maintenance/endurance/flexibility),
    timeline: String,
    weeklyWorkouts: Number
  },
  preferences: {
    equipment: [String],
    workoutDuration: Number (minutes),
    dietaryRestrictions: [String],
    injuries: [String]
  },
  streak: {
    current: Number,
    longest: Number,
    lastWorkoutDate: Date
  },
  timestamps: true
}
```

### ChatMessage Schema (NEW)
```javascript
{
  userId: ObjectId (ref: User, indexed),
  role: String (user/assistant),
  content: String (required),
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Exercise Schema
```javascript
{
  name: String,
  category: String (strength/cardio/flexibility/balance/core),
  muscleGroup: [String],
  difficulty: String,
  equipment: [String],
  instructions: String,
  sets: Number,
  reps: String,
  restTime: Number,
  caloriesPerMinute: Number,
  videoUrl: String,
  imageUrl: String,
  tips: [String]
}
```

## 🎯 Usage Examples

### 1. Sign Up / Login
1. Navigate to `http://localhost:5173`
2. Create account or login
3. Redirected to chat interface automatically

### 2. Chat with AI Trainer

Example questions:
```
- "Create a workout plan for me"
- "I want to build muscle, suggest exercises"
- "How do I do a proper squat?"
- "What should I eat for muscle gain?"
- "I'm a beginner, what exercises should I start with?"
- "Suggest a 30-minute home workout"
- "How many calories should I eat to lose weight?"
```

### 3. Generate Workout Plan
1. Click "📋 Get Workout Plan" button
2. AI generates plan based on your profile
3. Includes exercises, sets, reps, and schedule

### 4. Update Your Profile
Use Postman or frontend (if implemented):
```javascript
PUT /api/auth/profile
{
  "profile": {
    "fitnessLevel": "intermediate",
    "height": 175,
    "weight": 70
  },
  "goals": {
    "fitnessGoal": "muscle-gain",
    "weeklyWorkouts": 4
  },
  "preferences": {
    "equipment": ["dumbbells", "barbell"],
    "workoutDuration": 45,
    "injuries": []
  }
}
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token authentication (7-day expiry)
- ✅ Protected API routes with middleware
- ✅ Input validation
- ✅ CORS protection
- ✅ Secure HTTP headers
- ✅ MongoDB injection prevention (Mongoose)
- ✅ Environment variable protection
- ✅ Token stored in localStorage (frontend)

## 🎨 UI Features

- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Smooth animations and transitions
- ✅ Gradient themes (purple/blue)
- ✅ Real-time typing indicators
- ✅ Message timestamps
- ✅ User-friendly interface
- ✅ Tab switching (Login/Signup)
- ✅ Auto-scroll to new messages
- ✅ Loading states
- ✅ Error handling with user feedback

## 🔮 Future Enhancements (Not Yet Implemented)

- [ ] Progress tracking dashboard
- [ ] Workout scheduling calendar
- [ ] Exercise video library
- [ ] Nutrition tracking
- [ ] Social features (share progress)
- [ ] Gamification (badges, achievements)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Workout history analytics
- [ ] Multi-language support
- [ ] Image upload for form check
- [ ] Voice input/output
- [ ] Integration with fitness trackers
- [ ] Meal planning feature
- [ ] Water intake tracker

## 🐛 Troubleshooting

### Backend won't start
**Issue:** Server fails to start
**Solutions:**
- Check MongoDB connection string in `.env`
- Verify all environment variables are set
- Ensure port 5000 is not in use: `netstat -ano | findstr :5000`
- Check Node.js version: `node -v` (should be 18+)
- Delete `node_modules` and run `npm install` again

### Frontend can't connect to backend
**Issue:** `ERR_CONNECTION_REFUSED` or CORS errors
**Solutions:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is configured in `backend/server.js`
- Clear browser cache
- Check browser console for errors

### AI responses not working
**Issue:** 500 error or no response from AI
**Solutions:**
- Verify Gemini API key is valid (no quotes in .env)
- Check API quota limits at [Google AI Studio](https://makersuite.google.com)
- Ensure model name is `gemini-1.5-flash`
- Check backend logs for detailed errors
- Test API key: `console.log(process.env.GEMINI_API_KEY)`

### Gemini Model 404 Error
**Issue:** `models/gemini-xxx is not found for API version v1beta`
**Solution:**
- Model name must be exactly: `gemini-1.5-flash`
- Free tier API keys work with this model
- Check `backend/services/gemini.js` line 53

### Database connection issues
**Issue:** MongoDB connection timeout or authentication failed
**Solutions:**
- Whitelist your IP in MongoDB Atlas
- Check username/password in connection string
- Ensure database name exists
- Test connection string in MongoDB Compass

### Nodemon not restarting
**Issue:** Changes not reflected, manual restart needed
**Solutions:**
- Make sure you ran `npm run dev` (not `npm start`)
- Check nodemon is installed: `npm list nodemon`
- Type `rs` in terminal to force restart
- Check file is saved (Ctrl+S)

## 📝 Environment Variables Reference

### Backend (`backend/.env`)
```env
MONGODB_URI=<your-mongodb-connection-string>
PORT=5000
JWT_SECRET=<your-random-secret-string>
GEMINI_API_KEY=<your-gemini-api-key>
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env` in root)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚨 Common Mistakes to Avoid

1. ❌ Using quotes in .env file values
2. ❌ Committing .env files to git
3. ❌ Using wrong Gemini model name
4. ❌ Forgetting to create JWT_SECRET
5. ❌ Not whitelisting IP in MongoDB Atlas
6. ❌ Running `npm start` instead of `npm run dev` for development
7. ❌ Forgetting to restart after .env changes (now fixed with nodemon!)
8. ❌ Not installing backend dependencies before running
9. ❌ Using incompatible Node.js version

## 📊 Project Status

### Completed ✅
- [x] Backend API with Express
- [x] MongoDB database integration
- [x] User authentication (JWT)
- [x] Gemini AI chat integration
- [x] Persistent chat history
- [x] Frontend React app
- [x] Login/Signup UI
- [x] Chat interface
- [x] API integration
- [x] Nodemon for dev mode
- [x] Error handling
- [x] CORS configuration
- [x] Protected routes
- [x] User context management

### In Progress 🚧
- [ ] Profile update UI
- [ ] Workout plan display
- [ ] Exercise library

### Planned 📋
- [ ] Dashboard
- [ ] Progress tracking
- [ ] Calendar integration

## 🤝 Contributing

If you're picking up this project:

1. Read this entire guide
2. Set up environment variables
3. Install all dependencies (both backend and frontend)
4. Test authentication flow
5. Test chat functionality
6. Check database connections
7. Review code structure

## 📧 Support

For issues and questions:
1. Check troubleshooting section
2. Review backend logs in terminal
3. Check browser console for frontend errors
4. Verify all environment variables
5. Test API endpoints with Postman

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [JWT Introduction](https://jwt.io/introduction)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

## 📄 License

This project is for educational purposes as part of a 5th-semester project.

## 🙏 Acknowledgments

- Google Gemini AI for the AI capabilities
- MongoDB for the database
- React team for the amazing framework
- All open-source contributors

---

**Built with ❤️ for Fitness Enthusiasts**

🏋️ **Stay Fit, Stay Healthy!** 💪

---

## 📝 Version History

### v1.0.0 (Current)
- Initial implementation
- User authentication
- AI chat with Gemini
- Persistent chat history in MongoDB
- Basic workout plan generation
- Profile management
- Nodemon integration for dev mode

---

**Last Updated:** October 31, 2025

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd AI-Fitness-Trainer-and-Scheduler-Chat-Bot---5th-sem
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create/Edit `backend/.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Server Port
PORT=5000

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Gemini API Key (Get from: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy the key and paste it in `backend/.env`

### 5. Frontend Setup

```bash
cd ..  # Return to root directory
npm install
```

Create `.env` in root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎮 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

Backend will run on: `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📚 API Endpoints

### Authentication Routes

```
POST   /api/auth/signup     - Register new user
POST   /api/auth/login      - Login user
GET    /api/auth/me         - Get current user (Protected)
PUT    /api/auth/profile    - Update user profile (Protected)
```

### Chat Routes

```
POST   /api/chat/message        - Send message to AI (Protected)
POST   /api/chat/workout-plan   - Generate workout plan (Protected)
POST   /api/chat/exercises      - Get exercise recommendations (Protected)
GET    /api/chat/history        - Get chat history (Protected)
DELETE /api/chat/history        - Clear chat history (Protected)
```

## 🎯 Usage Examples

### 1. Sign Up / Login
- Navigate to the app
- Create a new account or login
- You'll be redirected to the chat interface

### 2. Chat with AI Trainer
Ask questions like:
- "Create a workout plan for me"
- "I want to build muscle, suggest exercises"
- "How do I do a proper squat?"
- "What should I eat for muscle gain?"

### 3. Generate Workout Plan
- Click "Get Workout Plan" button
- AI will generate a personalized plan based on your profile

### 4. Update Your Profile
- Use the update profile endpoint to set:
  - Fitness level
  - Goals
  - Available equipment
  - Workout preferences

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS protection
- ✅ Secure HTTP headers

## 🎨 UI Features

- ✅ Responsive design
- ✅ Smooth animations
- ✅ Real-time typing indicators
- ✅ Message timestamps
- ✅ User-friendly interface
- ✅ Gradient themes

## 🔮 Future Enhancements

- [ ] Progress tracking dashboard
- [ ] Workout scheduling calendar
- [ ] Exercise video library
- [ ] Nutrition tracking
- [ ] Social features (share progress)
- [ ] Gamification (badges, streaks)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Workout history analytics
- [ ] Multi-language support

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Ensure CORS is configured properly

### AI responses not working
- Verify Gemini API key is valid
- Check API quota limits
- Review server logs for errors

## 📝 Environment Variables Reference

### Backend (.env in /backend)
```env
MONGODB_URI=<your-mongodb-connection-string>
PORT=5000
JWT_SECRET=<your-jwt-secret>
GEMINI_API_KEY=<your-gemini-api-key>
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env in root)
```env
VITE_API_URL=http://localhost:5000/api
```

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a pull request

## 📄 License

This project is for educational purposes as part of a 5th-semester project.

## 🙏 Acknowledgments

- Google Gemini AI for the AI capabilities
- MongoDB for the database
- React team for the amazing framework
- All open-source contributors

## 📧 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ by [Your Team Name]**

🏋️ **Stay Fit, Stay Healthy!** 💪
