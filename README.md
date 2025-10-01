# 🏨 Hotel Management System

<div align="center">
  
  ![Hotel Management](https://img.shields.io/badge/Hotel-Management-blue.svg)
  ![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript)
  ![Firebase](https://img.shields.io/badge/Firebase-Latest-FFCA28.svg?logo=firebase)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css)
  
  **A comprehensive hotel management system built with modern web technologies**
  
  *Featuring role-based access control, real-time updates, and intuitive user experience*

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-based access control** (Admin, Staff, Guest)
- **Secure Firebase authentication**
- **Protected routes** with role verification
- **User management** with proper permissions

### 🏨 Hotel Management
- **Front Desk Operations** - Complete reservation management and guest services
- **Room Management** - Real-time room status, availability, and maintenance
- **Guest Management** - Comprehensive guest profiles and service history
- **Lost & Found** - Track and manage guest belongings
- **Check-in/Check-out** - Streamlined guest arrival and departure processes

### 📦 Inventory Management
- **Inventory Dashboard** - Real-time stock levels and analytics
- **Item Management** - Complete inventory item tracking and control
- **Procurement System** - Purchase orders and vendor management
- **Requisitions** - Internal department requests and approvals
- **Supplier Management** - Vendor relationships and contract tracking
- **Analytics & Reports** - Comprehensive inventory analytics
- **Department Management** - Multi-department inventory allocation

### 💰 Financial Management
- **Income Tracking** - Revenue monitoring and booking income
- **Expense Management** - Operating costs and budget tracking
- **Payroll System** - Staff compensation and salary management
- **Financial Reports** - Comprehensive financial analytics and reporting

### 🔧 Maintenance Operations
- **Maintenance Overview** - Complete facility management dashboard
- **Staff Management** - Maintenance personnel and role assignment
- **Staff Scheduling** - Shift management and availability tracking
- **On-Duty Monitoring** - Real-time staff status and location
- **Ticket System** - Maintenance request and task management
- **Archive System** - Historical maintenance records and documentation

### 📊 Dashboard & Analytics
- **Admin dashboard** with comprehensive statistics
- **Real-time data** updates
- **Booking analytics** and reporting
- **Revenue tracking**

---

## 🛠️ Technology Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://techstack-generator.vercel.app/react-icon.svg" alt="React" width="48" height="48" />
<br>React 18
</td>
<td align="center" width="96">
<img src="https://techstack-generator.vercel.app/ts-icon.svg" alt="TypeScript" width="48" height="48" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="Firebase" width="48" height="48" />
<br>Firebase
</td>
<td align="center" width="96">
<img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind" width="48" height="48" />
<br>Tailwind CSS
</td>
</tr>
<tr>
<td align="center" width="96">
<img src="https://vitejs.dev/logo.svg" alt="Vite" width="48" height="48" />
<br>Vite
</td>
<td align="center" width="96">
<img src="https://react-hook-form.com/images/logo/react-hook-form-logo-only.svg" alt="React Hook Form" width="48" height="48" />
<br>React Hook Form
</td>
<td align="center" width="96">
<img src="https://zod.dev/logo.svg" alt="Zod" width="48" height="48" />
<br>Zod
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Router" width="48" height="48" />
<br>React Router
</td>
</tr>
</table>

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Styling**: Tailwind CSS
- **Icons**: Tabler Icons
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM

---

## 📋 Prerequisites

Before running this application, make sure you have:

| Requirement | Version | Download |
|-------------|---------|----------|
| **Node.js** | 18.0+ | [Download](https://nodejs.org/) |
| **npm** | 8.0+ | Included with Node.js |
| **Firebase Project** | Latest | [Firebase Console](https://console.firebase.google.com/) |

> **Note**: Ensure Firebase Authentication and Firestore Database are enabled in your project

---

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd SIA101
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Firebase Configuration

Set up your Firebase project and configure the connection in `src/config/firebase.ts`. You'll need to:

- 🔥 Create a new Firebase project in the Firebase Console
- 🔐 Enable Authentication and Firestore Database  
- 🔑 Get your project configuration keys
- ⚙️ Update the configuration file with your project details

> **⚠️ Security Note**: Keep your Firebase configuration secure and never expose sensitive keys.

### Step 4: Start Development Server
```bash
npm run dev
```

🎉 **Success!** Your application should now be running at `http://localhost:5173`

---

## 🔧 Firebase Setup

### 1️⃣ Firestore Security Rules

Configure your Firestore security rules in the Firebase Console to ensure proper access control based on user roles. The rules should:

- ✅ Allow authenticated users to read their own data
- 🔒 Restrict write operations based on user roles
- 👥 Implement proper role-based access for different collections
- 🛡️ Protect sensitive operations requiring admin privileges

📚 Refer to the Firebase documentation for implementing role-based security rules.

### 2️⃣ Initial Admin User Setup

Create your first admin user using the provided utility function. Refer to the user initialization utilities in the codebase for proper setup procedures.

---

## 📁 Project Structure

```
src/
├── 📂 components/
│   ├── 👨‍💼 admin/           # Admin-specific components
│   ├── 🔐 auth/            # Authentication components
│   ├── 🔄 common/          # Shared components
│   └── 🎨 ui/              # UI components
├── 🌐 contexts/
│   └── 🔑 AuthContext/     # Authentication context
├── 🪝 hooks/               # Custom React hooks
├── 📄 pages/
│   ├── 👨‍💼 admin/           # Admin pages
│   ├── 🔐 auth/            # Authentication pages
│   └── 👤 guest/           # Guest-facing pages
├── ⚙️ services/            # API and service functions
├── 📝 types/               # TypeScript type definitions
├── 🛠️ utils/               # Utility functions
└── ⚙️ config/
    └── 🔥 firebase.ts      # Firebase configuration
```

---

## 👥 User Roles & Permissions

<div align="center">

| Role | Icon | Access Level | Permissions |
|------|------|-------------|-------------|
| **Administrator** | 👨‍💼 | Full System Access | • **Dashboard** - Comprehensive system overview<br>• **Front Desk Management** - Reservations, room management, lost & found<br>• **Inventory Management** - Full inventory control, procurement, requisitions, suppliers, analytics<br>• **Financial Management** - Income tracking, expenses, payroll, financial reports<br>• **Maintenance Operations** - Staff management, schedules, tickets & tasks, archive<br>• **User Management** - Create, edit, delete users<br>• **System Configuration** - Complete administrative control |
| **Staff** | 👨‍🔧 | Operational Access | • **Front Desk Operations** - Guest check-in/check-out, reservations<br>• **Room Management** - Room status updates, availability<br>• **Booking Management** - Handle guest reservations<br>• **Guest Assistance** - Customer service and support<br>• **Limited Reporting** - Basic operational reports |
| **Guest** | 👤 | Limited Access | • **Room Browsing** - View available rooms and amenities<br>• **Booking System** - Make and manage reservations<br>• **Personal Dashboard** - View booking history and status<br>• **Profile Management** - Update personal information<br>• **Guest Services** - Access to hotel services and information |

</div>

---

## ⚡ Development Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | 🚀 Start development server | Development mode with hot reload |
| `npm run build` | 🏗️ Build for production | Creates optimized production build |
| `npm run preview` | 👀 Preview production build | Test production build locally |
| `npm run lint` | 🧹 Run linting | Check code quality and standards |
| `npm run type-check` | 🔍 Type checking | Verify TypeScript types |

### Quick Start Commands
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build
```

---

## 🔒 Environment Variables

Configure your environment variables for Firebase integration. Create a `.env` file in the root directory with the necessary Firebase configuration keys.

📚 Refer to the Firebase documentation for the required environment variables for your specific setup.

> **🚨 Important**: Never commit your `.env` file to version control. Add it to your `.gitignore` file to keep your credentials secure.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 **Fork the repository**
2. 🌟 **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 💾 **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. 📤 **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. 🔄 **Open a Pull Request**

### Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Write clear commit messages

---

## 🔐 Security Considerations

<div align="center">

| Security Aspect | Implementation | Status |
|----------------|----------------|--------|
| **Input Validation** | Zod schemas | ✅ Implemented |
| **Access Control** | Firebase security rules | ✅ Implemented |
| **Role Permissions** | Role-based operations | ✅ Implemented |
| **Password Security** | Firebase Auth | ✅ Implemented |
| **Configuration Security** | Environment variables | ⚠️ User Responsibility |
| **Database Protection** | Firestore rules | ⚠️ User Configuration |

</div>

### Key Security Features:
- 🛡️ All user inputs are validated using Zod schemas
- 🔒 Firebase security rules enforce proper access control
- 👥 Sensitive operations require appropriate role permissions
- 🔐 User passwords are handled securely through Firebase Auth
- 🚫 **Never expose Firebase configuration keys in client-side code**
- 🔑 **Keep all environment variables and credentials secure**
- 🛡️ **Use Firebase security rules to protect your database**

---

## 💬 Support

For technical support or questions about the system:

| Support Type | Method | Response Time |
|-------------|--------|---------------|
| 🐛 **Bug Reports** | [Create an Issue](../../issues) | 24-48 hours |
| 💡 **Feature Requests** | [Feature Request](../../issues) | 48-72 hours |
| 📚 **Documentation** | Check existing docs | Immediate |
| 💻 **Development Help** | Contact team | 1-3 days |

### Before Creating an Issue:
1. 🔍 Check existing issues
2. 📝 Provide detailed information
3. 🖼️ Include screenshots if applicable
4. 🔧 Mention your environment details

---

## 📄 License

<div align="center">

![License](https://img.shields.io/badge/License-MIT-green.svg)

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

</div>

---

## 🎓 Academic Notice

<div align="center">

**📚 Educational Project**

*This system is designed for educational purposes as part of the SIA101 course project.*

*For production use, additional security measures and testing should be implemented.*

---

<p align="center">
  <strong>Made with ❤️ for SIA101 Course</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Academic-Project-blue.svg" alt="Academic Project">
  <img src="https://img.shields.io/badge/Course-SIA101-green.svg" alt="SIA101 Course">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg" alt="Active Status">
</p>

</div>
