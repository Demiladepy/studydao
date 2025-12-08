# 📚 StudyDAO - AI Study Accountability Agent

> **An intelligent AI-powered study companion that helps university students track study sessions, set goals, and stay motivated through conversational interactions.**

StudyDAO leverages **ADK-TS (Agent Development Kit)** to create a sophisticated AI agent that understands natural language commands, tracks study habits, and provides personalized motivation. Built with Next.js 14, TypeScript, and Prisma for a seamless, type-safe experience.

---

## 🎯 Problem It Solves

University students struggle with:
- **Lack of accountability** - No one tracking their study progress
- **Poor time management** - Difficulty estimating and tracking study hours
- **Low motivation** - No encouragement or progress visualization
- **Inconsistent habits** - Hard to maintain daily study routines
- **Goal setting challenges** - Setting unrealistic or unattainable study goals

## ✨ Solution & Features

StudyDAO solves these pain points with an intelligent AI agent that:

### 🤖 **Natural Language Interaction**
- Chat conversationally with the agent using everyday language
- Commands like "start studying math" or "show my progress" work seamlessly
- No need to learn complex commands or navigate menus

### ⏱️ **Smart Study Timer**
- Start/stop study sessions with simple commands
- Automatic course/subject detection from natural language
- Real-time timer display with live updates
- Automatic duration calculation and session logging

### 📊 **Comprehensive Analytics**
- **Today's Progress** - See hours studied today at a glance
- **Weekly Overview** - Track weekly study patterns
- **Study Streaks** - Maintain daily study habits with streak tracking
- **Session History** - View all completed study sessions
- **Goal Progress** - Visual progress bars for daily/weekly/monthly goals

### 🎯 **Goal Setting & Tracking**
- Set daily, weekly, or monthly study goals
- Automatic progress tracking as you study
- Goal completion celebrations
- Progress percentage visualization

### 💬 **Motivational Support**
- Personalized encouragement based on your progress
- Streak celebrations
- Goal achievement recognition
- Context-aware motivational messages

### 🎨 **Beautiful Modern UI**
- Clean, intuitive chat interface
- Real-time stats sidebar
- Active timer display
- Dark mode support
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions

---

## 🚀 How ADK-TS Powers StudyDAO

**ADK-TS (Agent Development Kit - TypeScript)** is the core technology that makes StudyDAO's intelligent agent possible:

### **1. Natural Language Understanding**
ADK-TS enables the agent to understand conversational commands:
- "start studying math" → Extracts subject and starts timer
- "I want to study 3 hours today" → Parses goal and sets it
- "show my progress" → Retrieves and formats statistics
- "feeling unmotivated" → Provides personalized encouragement

### **2. Tool Integration**
ADK-TS's tool system allows the agent to:
- **Start/Stop Timers** - Direct database integration via Prisma
- **Query Statistics** - Real-time data retrieval and formatting
- **Set Goals** - Goal creation and progress tracking
- **Provide Motivation** - Context-aware message generation

### **3. Conversation Context**
- Maintains conversation history
- Remembers user preferences
- Tracks active sessions across messages
- Provides contextual responses

### **4. Model Integration**
- Uses **Gemini 2.0 Flash** for fast, accurate responses
- Handles complex queries and multi-step operations
- Generates natural, human-like responses

### **5. Error Handling**
- Graceful error recovery
- User-friendly error messages
- Automatic retry logic
- Comprehensive logging

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management and API integration

### **Backend**
- **ADK-TS** - Agent Development Kit for AI agent
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **SQLite** - Lightweight database (production-ready for PostgreSQL)

### **AI & Agent**
- **Gemini 2.0 Flash** - Google's advanced language model
- **ADK-TS Tools** - Custom tools for timer, stats, goals
- **Natural Language Processing** - Command recognition

### **Authentication**
- **NextAuth.js** - Secure authentication
- **JWT** - Token-based sessions

---

## 📦 Setup Instructions

### **Prerequisites**
- Node.js 18+ (v22+ recommended)
- npm or yarn
- Google API Key for Gemini (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### **Step 1: Clone the Repository**
```bash
git clone <repository-url>
cd studydao
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Set Up Environment Variables**
Create a `.env` file in the root directory:

```env
# Google API Key for ADK-TS (Gemini model)
GOOGLE_API_KEY=your_google_api_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database (SQLite - already configured)
# For production, use PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/studydao
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### **Step 4: Set Up Database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
# npx prisma db seed
```

### **Step 5: Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` and you're ready to go! 🎉

### **Step 6: Create Your First Account**
1. Navigate to `/register`
2. Create an account with your email and password
3. Log in at `/login`
4. Start chatting with your StudyDAO agent at `/chat`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google API key for Gemini model | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | ✅ Yes |
| `NEXTAUTH_URL` | Base URL of your application | ✅ Yes |
| `DATABASE_URL` | Database connection string | ❌ No (defaults to SQLite) |

---

## 🎬 Demo

**Live Demo:** [Coming Soon - Add your demo link here]

**Video Walkthrough:** [Add video link here]

---

## 📸 Screenshots

### Chat Interface
![Chat Interface](./screenshots/chat-interface.png)
*Beautiful chat UI with message bubbles and stats sidebar*

### Timer Display
![Timer Display](./screenshots/timer-display.png)
*Real-time timer with course information*

### Statistics Dashboard
![Statistics](./screenshots/statistics.png)
*Comprehensive study statistics and goal tracking*

### Mobile View
![Mobile View](./screenshots/mobile-view.png)
*Fully responsive mobile experience*

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Chat UI    │  │  Stats Side  │  │ Timer Display│      │
│  │  Component   │  │   Component  │  │  Component   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘            │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  React Hooks   │                       │
│                    │  (useChat,     │                       │
│                    │   useTimer,    │                       │
│                    │   useStats)    │                       │
│                    └───────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   API Client     │
                    │   (lib/api)     │
                    └────────┬─────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                    Backend (Next.js API)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/chat    │  │ /api/timer/* │  │ /api/stats   │      │
│  │              │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘            │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  ADK-TS Agent  │                       │
│                    │  (AgentBuilder)│                       │
│                    └───────┬────────┘                       │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  Agent Tools   │                       │
│                    │  (startTimer,  │                       │
│                    │   stopTimer,   │                       │
│                    │   showStats,   │                       │
│                    │   setGoal,     │                       │
│                    │   getMotivation)│                      │
│                    └───────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   Prisma ORM     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │   SQLite/Postgres│
                    │   Database       │
                    └──────────────────┘
```

### **Data Flow**
1. User sends message → React Hook
2. Hook calls API Client → API Route
3. API Route processes → ADK-TS Agent
4. Agent uses Tools → Database (Prisma)
5. Response flows back → UI Update

---

## 🚧 Future Improvements

### **Short Term**
- [ ] **Study Analytics Dashboard** - Visual charts and graphs
- [ ] **Study Reminders** - Push notifications for study time
- [ ] **Study Groups** - Collaborative study sessions
- [ ] **Achievement Badges** - Gamification elements
- [ ] **Export Data** - CSV/PDF export of study history

### **Medium Term**
- [ ] **AI Study Plans** - Personalized study schedules
- [ ] **Pomodoro Integration** - Built-in Pomodoro timer
- [ ] **Focus Music** - Integrated background music
- [ ] **Study Notes** - Note-taking within sessions
- [ ] **Calendar Integration** - Sync with Google Calendar

### **Long Term**
- [ ] **Multi-language Support** - Internationalization
- [ ] **Voice Commands** - Voice interaction with agent
- [ ] **Mobile App** - Native iOS/Android apps
- [ ] **Social Features** - Share progress with friends
- [ ] **AI Tutoring** - Subject-specific help from agent

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **IQAI** - For the amazing ADK-TS framework
- **Google** - For Gemini AI model
- **Vercel** - For Next.js framework
- **Prisma** - For the excellent ORM

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/studydao/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/studydao/discussions)
- **Email:** support@studydao.com

---

## ⭐ Show Your Support

If you find StudyDAO helpful, please give us a star on GitHub! ⭐

---

**Built with ❤️ for students, by students.**

*StudyDAO - Your AI Study Accountability Companion*
