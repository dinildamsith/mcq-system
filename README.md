# Online MCQ Exam System

A comprehensive web-based Multiple Choice Question (MCQ) exam system built with Next.js, React, and TypeScript. This system allows students to take mock exams, view results, and track their progress.

## 🚀 Features

### Student Features
- **User Authentication**: Simple login system with demo credentials
- **Exam Dashboard**: View available mock exam papers
- **Interactive Exam Interface**: 
  - Timer functionality
  - Question navigation (Previous/Next)
  - Progress tracking
  - Answer selection with radio buttons
- **Real-time Results**: 
  - Instant score calculation
  - Detailed question-wise analysis
  - Performance metrics and badges
- **Result History**: View all past exam attempts with detailed analytics

### Technical Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Timer**: Automatic submission when time expires
- **Progress Tracking**: Visual progress indicators throughout the exam
- **Data Persistence**: Results stored and retrievable
- **Modern UI**: Clean, professional interface using shadcn/ui components

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

### Backend
- **Next.js API Routes** (Node.js)
- **RESTful API** design
- **JSON-based data storage** (easily replaceable with database)

### UI/UX
- **Responsive Design** with mobile-first approach
- **Dark/Light mode** support
- **Accessibility** features implemented
- **Loading states** and error handling

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd mcq-exam-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

Use these credentials to test the system:

- **Email**: student@example.com
- **Password**: password123

## 📊 System Architecture

### Database Design (Conceptual)

The system uses the following data models:

#### Users
- id: string
- name: string  
- email: string
- password: string (hashed in production)

#### Exams
- id: string
- title: string
- description: string
- duration: number (minutes)
- totalQuestions: number
- difficulty: string
- subject: string

#### Questions
- id: string
- examId: string
- questionText: string
- options: string[]
- correctOption: number

#### Results
- resultId: string
- examId: string
- userId: string
- score: number
- totalQuestions: number
- percentage: number
- timeSpent: number (seconds)
- submittedAt: string (ISO date)
- questions: QuestionResult[]

## 🔄 API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login

### Exams
- \`GET /api/exams\` - Get all available exams
- \`GET /api/exams/[id]\` - Get specific exam with questions
- \`POST /api/exams/submit\` - Submit exam answers

### Results
- \`GET /api/results?userId=[id]\` - Get user's result history
- \`GET /api/results/[id]\` - Get specific result details

## 🎯 Key Features Implemented

### 1. User Authentication
- Simple login system with validation
- Session management using localStorage
- Protected routes

### 2. Exam Management
- 3 sample exam papers with different difficulty levels
- 5 questions per exam
- Timed examinations (15-25 minutes)
- Auto-submission on timeout

### 3. Interactive Exam Interface
- Question navigation
- Answer selection
- Progress tracking
- Time remaining display
- Warning for unanswered questions

### 4. Results & Analytics
- Immediate result display
- Score calculation and percentage
- Question-wise analysis
- Performance badges
- Result history

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: For static deployment
- **Railway**: For full-stack deployment
- **Render**: For containerized deployment

## 🔧 Customization

### Adding New Exams
1. Edit \`app/api/exams/route.ts\` to add exam metadata
2. Edit \`app/api/exams/[id]/route.ts\` to add questions
3. Update the submit route with new exam data

### Styling Customization
- Modify \`tailwind.config.ts\` for theme changes
- Update component styles in respective files
- Add custom CSS in \`app/globals.css\`

### Database Integration
To integrate with a real database:

1. **MongoDB Integration**
   \`\`\`bash
   npm install mongodb mongoose
   \`\`\`

2. **PostgreSQL Integration**
   \`\`\`bash
   npm install pg @types/pg
   \`\`\`

3. **MySQL Integration**
   \`\`\`bash
   npm install mysql2
   \`\`\`

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can login with demo credentials
- [ ] Dashboard displays available exams
- [ ] Exam timer works correctly
- [ ] Questions can be navigated
- [ ] Answers are saved properly
- [ ] Results are calculated correctly
- [ ] Result history is accessible

### Automated Testing (Future Enhancement)
\`\`\`bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
\`\`\`

## 🔒 Security Considerations

### Current Implementation
- Basic input validation
- Client-side session management
- CORS protection via Next.js

### Production Recommendations
- Implement JWT authentication
- Add password hashing (bcrypt)
- Use HTTPS in production
- Add rate limiting
- Implement CSRF protection
- Add input sanitization

## 📈 Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Caching**: API route caching
- **Lazy Loading**: Components loaded on demand

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   \`\`\`bash
   npm run build
   \`\`\`
   Check for TypeScript errors and fix them

2. **API Route Issues**
   - Ensure API routes are in \`app/api/\` directory
   - Check request/response formats
   - Verify HTTP methods

3. **Styling Issues**
   - Clear browser cache
   - Check Tailwind CSS classes
   - Verify component imports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is created for educational purposes as part of an internship assignment.


## 🎉 Acknowledgments

- Built with Next.js and React
- UI components from shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS

---

**Note**: This is a demo application for internship evaluation. In a production environment, implement proper authentication, database integration, and security measures.
