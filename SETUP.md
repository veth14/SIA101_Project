# 🚀 SIA101 Hotel Management System - Setup Instructions

## Prerequisites
- **Node.js 18** (check `.nvmrc` file)
  - If you have nvm: `nvm use 18`
  - If not, download Node 18 from [nodejs.org](https://nodejs.org)

## Quick Setup (5 minutes)

### 1. Clone the repository
```bash
git clone https://github.com/veth14/SIA101_Project.git
cd SIA101
```

### 2. Install dependencies
```bash
npm install
```
This automatically installs ALL required packages:
- React, TypeScript, Vite
- Tailwind CSS v3, Framer Motion, Lucide icons
- Chart.js, Recharts for analytics
- Firebase for auth/database
- All other UI components and tools

### 3. Setup environment variables
```bash
# Copy the template
cp .env.example .env
```

Then edit the `.env` file with these values:

```env
# Firebase Configuration (REQUIRED)
VITE_FIREBASE_API_KEY=AIzaSyAzJaAvE6_KjaH8k57S0oDIlbfUYjZ7bog
VITE_FIREBASE_AUTH_DOMAIN=sia101hotel.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sia101hotel
VITE_FIREBASE_STORAGE_BUCKET=sia101hotel.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1080592606767
VITE_FIREBASE_APP_ID=1:1080592606767:web:47867f6192e4ee6d1388da
VITE_FIREBASE_MEASUREMENT_ID=G-W6VVQGKZ1C

# Database URLs
VITE_FIREBASE_DATABASE_URL=https://sia101hotel-default-rtdb.firebaseio.com

# Hotel Configuration
VITE_HOTEL_NAME=Balay Ginhawa
VITE_HOTEL_EMAIL=contact@balayginhawahotel.com
VITE_HOTEL_PHONE=+63_xxx_xxx_xxxx

# Development Environment
NODE_ENV=development
VITE_APP_ENV=development
```

### 4. Run the project
```bash
npm run dev
```
Open the URL it shows (usually `http://localhost:5173`)

## Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

## Test Login Credentials

### Admin Access
- **Email:** `balayginhawaAdmin123@gmail.com`
- **Password:** `Admin12345`

### Regular User
- Register a new account through the UI
- Or use any existing user account

## Project Structure
```
src/
├── pages/auth/          # Login/register pages
├── pages/admin/         # Admin dashboard
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── data/               # Sample data and types
└── services/           # API services
```

## Troubleshooting

### Node version errors?
- Make sure you're using Node 18: `node --version`
- Use nvm to switch: `nvm use 18`

### Blank screen or auth errors?
- Check your `.env` file has all the Firebase values
- Make sure Firebase Authentication is enabled in the console

### Install errors?
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Firebase permission errors?
- Ensure Firestore and Storage rules allow read/write for authenticated users
- Check that Authentication → Email/Password is enabled

## Key Features to Test
1. **Authentication:** Register/login functionality
2. **Admin Dashboard:** Use admin credentials to access admin features
3. **Responsive Design:** Test on different screen sizes
4. **Navigation:** All routes and page transitions
5. **Forms:** Registration, login, and other form validations

## Development Notes
- The app uses Vite for fast development
- Tailwind CSS for styling
- Firebase for backend services
- React Router for navigation
- TypeScript for type safety

## Need Help?
- Check the console for error messages
- Verify all environment variables are set correctly
- Make sure Firebase project is properly configured
- Contact the team lead if issues persist

---

**⚠️ Important:** Never commit the `.env` file to git! It contains sensitive configuration data.
