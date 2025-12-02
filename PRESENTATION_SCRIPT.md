# SIA101 Hotel System – Presentation Script

> Presenter notes: This script is written so you can read it almost verbatim. Feel free to shorten sections depending on your time.

---

## 1. Introduction

Good day everyone. Today I’ll be presenting our hotel management system built for **Balay Ginhawa**.

This system is designed to support **two main perspectives**:

- **Guest side** – focused on a smooth online experience for guests: browsing, booking, and managing their stay.
- **User side** – the internal staff and admin tools that help run daily operations: front desk, maintenance, inventory, and finances.

During this presentation I’ll walk through both sides, show how they connect, and highlight a few technical details behind the scenes.

---

## 2. Guest Side Experience

### 2.1 Landing Page

1. When a guest first visits the site, they are greeted by the **Landing Page**.
2. The design uses our **heritage green** theme and glassmorphism cards to reflect the Balay Ginhawa branding.
3. Here the guest can:
   - **Browse basic information** about the hotel.
   - See **highlights of rooms and amenities**.
   - Quickly navigate to **Sign In** or **Register**.

> Demo cue: Show the landing page and scroll briefly.

---

### 2.2 Authentication: Register and Login

Next, let’s look at how a new guest creates an account and logs in.

#### Registration Flow

1. The guest clicks **Register** and is taken to the **Auth Page**.
2. The registration form collects:
   - First name and last name
   - Email address
   - Password and confirmation
3. We enforce **password rules** – minimum length and character requirements – to improve account security.
4. When the guest submits the form:
   - We **create a Firebase Auth user**.
   - We store a user profile in the **`users` collection** in Firestore.
   - The system automatically **sends a verification email**.
5. After successful registration, the guest sees a **success modal** explaining that they must verify their email before logging in.

> Demo cue: Show filling out the register form and trigger the success modal (no need to actually create a new user every time).

#### Email Verification

1. If the guest tries to log in without verifying their email, the system checks the account and returns an **“Email not verified”** error.
2. In that case we open the **Email Verification Modal**:
   - It clearly says **“Check your email”**.
   - Shows the email address where the verification link was sent.
   - Provides a **“Resend Verification Email”** button.
3. Behind the scenes, this modal can temporarily sign in the user, resend the verification email using Firebase, and then sign them out again.

> Demo cue: Attempt to log in with an unverified account and show the verification modal.

#### Login Flow

1. Once the guest’s email is verified, they can log in from the same Auth Page.
2. On successful login:
   - Guest users are redirected to the **guest landing / dashboard**.
   - Admin users are redirected directly to the **admin dashboard**.

---

### 2.3 Guest Profile Management

After logging in as a guest, they can manage their **profile**.

1. On the **My Profile** page, the guest sees:
   - Their **name and email**.
   - A **verification badge** if the email is verified.
   - A glassmorphism **stats card** showing:
     - *Member since* – based on the account’s creation year.
     - *Total bookings*.
     - *Loyalty points*.
     - *Membership tier* (Bronze, Silver, Gold, Platinum).
2. The design uses:
   - Floating gradient backgrounds.
   - Heritage green highlights.
   - Animated badges for active and verified status.

3. When the guest edits their profile, they can update:
   - Phone number
   - Date of birth
   - Nationality
   - Address

4. On save:
   - Data is written into the **`guestprofiles`** collection.
   - Key fields are also synced back to the **`users`** collection.

> Demo cue: Open My Profile, show the stats card, and quickly toggle into edit mode to show form fields.

---

### 2.4 Reservations (Guest Perspective)

While the detailed reservation UI is more visible on the staff side, from the guest’s perspective:

1. Their bookings are linked to their **Firebase user ID**.
2. Bookings can be summarized in the guest profile as **total bookings** and used for loyalty points and membership tier.
3. All of this data flows into the internal **Modern Reservations Table** used by the front desk.

> Demo cue: Briefly mention that every guest reservation becomes part of the staff dashboard that we’ll see next.

---

## 3. Internal User Side – Staff & Admin

Now I’ll switch to the **internal side** of the system. This is where staff and admins manage day‑to‑day hotel operations.

### 3.1 Authentication and Roles

1. Staff and admins also log in via the **Auth Page**.
2. The system recognizes **roles**, mainly:
   - **Admin** – full access to dashboards and configuration.
   - **Staff** – restricted to their operational modules, like front desk or maintenance.
3. Role information is stored along with the user in Firestore and exposed through the **Auth Context** in React, so components can check `isAdmin` or `isStaff`.

> Demo cue: Log in with an admin account and land on the admin dashboard.

---

### 3.2 Front Desk – Reservations Management

The front desk uses the **Modern Reservations Table** to manage bookings.

1. The table displays key information:
   - Guest name and email
   - Room number and room type
   - Booking status: *confirmed*, *checked-in*, *checked-out*, *cancelled*
   - Payment status
   - Creation time and actions.
2. Staff can:
   - Filter by status
   - Search by guest name, email, room, or booking ID
   - Sort by **status priority** and **creation time**, using a robust date parser that handles different timestamp formats.
3. This module is connected to Firestore using **snapshot listeners**, so new reservations and changes show up live without page refreshes.

> Demo cue: Open the reservations screen, search, and change a reservation status.

---

### 3.3 Maintenance – Staff Management & On‑Duty Status

The **Maintenance** section handles staff records and attendance.

#### Staff Management

1. The **Manage Staff** module lists all staff members with details like:
   - Full name
   - Classification (for example housekeeping or maintenance)
   - Contact information
   - RFID assignment
   - `createdAt` date.
2. The system safely parses timestamps from Firestore so it can work with both **Timestamp objects** and regular **Date or string values**.

#### Attendance & RFID Scanning

1. The **Attendance** module integrates with staff **RFID** tags.
2. When a staff member taps their RFID:
   - The system looks up the staff record by RFID.
   - It checks for an **attendance record for today** in the `attendance` collection.
3. If there’s no record yet, it creates a **Time In** entry.
4. If there is an open record without Time Out, it writes a **Time Out** and treats that as clocking out.

> Demo cue: Show the RFID handling logic or the attendance logs screen.

#### On‑Duty Staff Overview

1. The **On Duty Staff** page summarizes how many staff members are **currently on duty** vs **off duty**.
2. At the top of the page, there are two large **glassmorphism cards** styled like dashboard stats:
   - *Currently On Duty* – shows the count with green "Active" status.
   - *Off Duty* – shows the count with rose "Inactive" status.
3. Below the cards, staff are listed with their **shift times** and **attendance status**, so supervisors can quickly see who is working.

> Demo cue: Navigate to the On Duty Staff page and highlight the two large cards and the list.

---

### 3.4 Maintenance – Archive & Clock Logs

The next section is the **Archive** and **Clock Logs**.

#### Archive of Completed Tickets

1. Maintenance tasks or tickets, once completed, are saved into an **`archived_tickets`** collection.
2. The system fetches and subscribes to this collection using Firestore’s **`onSnapshot`**.
3. Each archived record includes:
   - A title and description
   - Metadata such as priority and status
   - A **`dateArchived`** field that is safely derived from multiple possible date formats.
4. There is also support for generating a **PDF ticket** for each archived record, using **jsPDF**, styled like a physical maintenance slip.

> Demo cue: Open the archive view and show some completed tickets.

#### Clock Logs Section

1. The **Clock Logs** section shows a paginated table of staff attendance logs.
2. Columns include:
   - Staff member
   - Classification
   - Date
   - Time in / Time out
   - Hours worked
   - Status
3. The table is styled with gradients and uses responsive layout so it stays readable on different screen sizes.

> Demo cue: Scroll through clock logs and mention how they align with the attendance and salary computations.

---

### 3.5 Inventory & Procurement

The system also includes **Inventory** and **Procurement** dashboards.

#### Inventory Analytics

1. The **Analytics Chart** component shows trends of inventory consumption over time.
2. Data is grouped by **week or month**, and rendered using **Recharts** with a modern glassmorphism card design.
3. Staff can visually track **which periods have high usage**, helping with purchasing decisions.

#### Procurement Activity

1. The **Dashboard Activity** component merges:
   - Purchase orders
   - Requisitions
   - Invoices
2. It displays a **recent activity timeline** with icons, amounts, and statuses.
3. The layout is optimized to show only a limited number of recent activities to keep the view focused.

> Demo cue: Show the inventory dashboard and the procurement activity list.

---

### 3.6 Finance – Revenue Analytics

On the finance side, we provide a **Revenue Analytics** chart.

1. The chart aggregates invoice data monthly or yearly.
2. It calculates and displays:
   - Total revenue
   - Trends compared to previous periods
   - Key highlights in a metrics row under the chart.
3. The design is consistent with the rest of the dashboards:
   - Gradient header
   - Glassmorphism content area
   - Custom tooltip and legend.

> Demo cue: Open Revenue Analytics and hover the chart to show tooltips.

---

## 4. Technical Highlights

Here are a few technical details that make the system more robust and user-friendly:

1. **React + TypeScript** on the frontend, giving us type safety and cleaner code.
2. **Firebase Authentication** for user accounts, plus Firestore as our main data store.
3. **Snapshot listeners and caching** in several modules to reduce Firestore reads while keeping the UI live.
4. **Safe date parsing utilities** so we can handle different timestamp formats without runtime errors.
5. Consistent **design system**:
   - Tailwind CSS
   - Heritage green color palette
   - Glassmorphism cards and subtle animations.

---

## 5. End‑to‑End Flow Summary

To summarize the entire flow from **guest** to **internal user side**:

1. A guest **registers** and verifies their email.
2. They **log in**, visit their **profile**, and make **bookings**.
3. Those bookings appear on the **front desk reservations table**, where staff manage statuses and check‑ins.
4. Staff **clock in and out** with RFID, and their status is reflected on the **On Duty Staff** overview and **Clock Logs**.
5. Maintenance issues are tracked as tickets, and once completed, they are moved into **Archive**, where admins can review or export them.
6. Inventory usage and procurement activities are visualized in **analytics dashboards**.
7. Finally, finance staff use **Revenue Analytics** to understand income over time.

All of these modules work together to provide a **unified hotel management system** that supports guests, staff, and administrators in a consistent, visually cohesive interface.

---

## 6. Closing

That concludes my presentation of the Balay Ginhawa hotel system.

We’ve seen how the application:

- Guides guests from registration and email verification
- Supports profile and booking management
- Provides powerful tools for staff, maintenance, inventory, and finance
- And ties everything together with real‑time data and a unified design.

Thank you for listening. I’m happy to answer any questions.
