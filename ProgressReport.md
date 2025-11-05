## Progress Report 

Format:
1. Task/Feature: What you worked on.
2. Status: ( OnGoing / Completed / Pending )
3. Time Spent: Rough estimate or hours worked.
4. Remarks: Any issues, notes, or dependencies.

Example:
Task: Login UI for Employees
Status: Ongoing
Time Spent: 3 hours 
Remarks: Ready for integration 

Reports should submitted every Saturday ( 9:00 PM )
- Detera (Front Desk)
- Roces (Inventory)
- Mamaril (Maintenance)
- Valmores (Finance)


Front Desk
1. DETERA (Lost and Found)
    A.) Task/Feature: Add Lost and Found Items to DB
    B.) Status: On-Going
    C.) Time Spent: 3 hours
    D.) Remarks: Added a refresh button for force update list from db 
2. DETERA (Lost and Found )
    A.) Task/Feature: View Modal of Lost and Found Items   
    B.) Status: Completed
    C.) Time Spent: 2 hours
    D.) Remarks: Included changing of status inside view modal

3. INFIESTO (Reservation-v2 )
    A.) Task/Feature: Replaced any hardcode data into Firebase, on both WalkIn and Edit, Removed automatic room assignment. 
    B.) Status: OnGoing
    C.) Time Spent: 5 hours
    D.) Remarks: No validation, had to Edit Modal.tsx to change blur value from 8px into 0. Previously could not see anything.

4. INFIESTO (Reservation-v2 )
    A.) Task/Feature: Added additional fee per guest above base, fixed naming, added validation checks.
    B.) Status: OnGoing
    C.) Time Spent: 3 hours
    D.) Remarks: Still need to create a Roomtype collection, add function to the 4 other buttons


Inventory
1.
2.
3.
4.
5

Maintenance
1. Albiola (Archive)
    A.)Task: Added clock logs in the archive section
    B.)Status: Completed
    C.)Time Spent: 1 hour
    D.)Remarks: No backend logic yet.
2. Cruz (Tickets & Tasks)
    A.)Task: Added create ticket modals and action buttons
    B.)Status: Completed
    C.)Time Spent: 1 hour
    D.)Remarks: No backend logic yet.
3.
4.
5.

## Finance
## Completed:
1. Valmores (Payments Page)
    A.) Task/Feature: Design of The List and Activity
    B.) Status: Completed
    C.) Time Spent: 3 Hours
    D.) Remarks: Issue with Responsiveness

2. Valmores (Payments Page)
    A.) Task/Feature: View Modal of Payments
    B.) Status: Completed
    C.) Time Spent: 1 Hour
    D.) Remarks: Process Refund not done yet 

3. Valmores (AdminDashboardPage)
    A.) Task/Feature: Fix Errors | Refactor and Optimize AdminDashboardPage | Removed Embedded Code
    B.) Status: Completed
    C.) Time Spent: 2 Hours
    D.) Remarks: Removed Embedded Admin Account  

3a. Valmores (Booking Payment Page)
    A.) Task/Feature: Fixing Errors and Logics
    B.) Status: Completed
    C.) Time Spent: 2 Hours 
    D.) Remarks: For Redesigning | Reverted back to the Old Design

4. Valmores (Payments Page)
    A.) Task/Feature: View Modal of Payments Button Designs | Skeleton Loader Components
    B.) Status: Completed
    C.) Time Spent: 2 Hours
    D.) Remarks: Functions 

5. Valmores (Revenue Tracking)
    A.) Task/Feature: Redesign added Tabs for Profit Page 
    B.) Status: Completed
    C.) Time Spent: 2 Hours
    D.) Remarks: Back-end not done yet

6. Valmores (Help Center & Contact System)
    A.) Task/Feature: Refactored Help Center with Tabbed Interface | Contact Form with Cancellation Request | Auto-Fill User Data
    B.) Status: Completed
    C.) Time Spent: 3 Hours
    D.) Remarks: Implemented centralized FAQ data, GuestLayout component, smooth tab transitions, scroll-to-top navigation, contact form with cancellation request feature, and smart auto-fill for logged-in users (name, email, phone)

7. Valmores (Code Cleanup & Optimization)
    A.) Task/Feature: Removed unused files | Fixed MyBookings navigation | Cleaned imports
    B.) Status: Completed
    C.) Time Spent: 1 Hour
    D.) Remarks: Deleted ProfilePage.tsx, unused standalone pages, fixed route mismatch (/my-bookings → /mybookings)

8. Valmores (MyBookingsPage Redesign)
    A.) Task/Feature: Complete redesign of MyBookingsPage with modern UI | Streamlined controls panel | Enhanced filter tabs | Improved card layout
    B.) Status: Completed
    C.) Time Spent: 2 Hours
    D.) Remarks: Fixed JSX structure issues, implemented compact search, enhanced filter tabs with shadow effects, improved responsive design, added results info display

9. Valmores (Account Creation & Validation System + Profile Verification Badge Fix + Security Rules)
    A.) Task/Feature: Enhanced authentication with comprehensive validation | Password strength indicator | Email verification | Security improvements | Profile verification badge | Firestore security rules
    B.) Status: Completed
    C.) Time Spent: 6 Hours
    D.) Remarks: Implemented:
        - Real-time password strength indicator with visual feedback
        - 5-level strength meter (Weak, Fair, Good, Strong)
        - Password requirements checklist (8+ chars, uppercase, lowercase, number, special char)
        - Email format validation with regex pattern
        - Automatic email verification link sent upon registration via Firebase
        - **ENFORCED email verification before login** - Users CANNOT access account until verified
        - **Explicit verification modal** with step-by-step instructions after registration
        - Email verification modal with resend functionality for unverified login attempts
        - Enhanced form validation with detailed error messages
        - Visual feedback for all validation states
        - **Prominent success modal** with animated email icon, warning box, and clear instructions
        - Security best practices implemented (password visibility toggle, secure storage)
        - Created PasswordStrengthIndicator component for reusability
        - Created EmailVerificationModal component with resend feature
        - Redesigned SuccessModal with explicit Gmail checking instructions
        - Updated AuthContext to support sendEmailVerification from Firebase
        - Login blocks unverified users and shows verification modal
        - Admin accounts exempt from email verification requirement
        - Improved modal responsiveness for mobile devices
        - Disabled backdrop click and ESC key on critical verification modal
        - Removed auto-login after registration to enforce verification
        - Created EMAIL_VERIFICATION_TROUBLESHOOTING.md guide
        - **Fixed Profile Verification Badge**: Badge now correctly shows "Verified Member" only for verified emails
        - Added "Email Not Verified" warning badge for unverified accounts
        - Added emailVerified property to User interface and AuthContext
        - Fixed profile card height to match personal information section (full height flex layout)
        - **CRITICAL FIX**: Added emailVerified field to Firestore on registration (initially false)
        - **CRITICAL FIX**: User is signed out immediately after registration to prevent auto-login
        - **CRITICAL FIX**: Success modal now displays properly after registration
        - Firestore emailVerified field synced to true on first verified login
        - Email verification status tracked in both Firebase Auth and Firestore
        - **Connected Profile Stats to Firestore**: Member since, Total bookings, Loyalty points, Membership tier now show real data
        - Member since fetched from user creation date in Firestore
        - Total bookings counted from actual bookings collection
        - Loyalty points fetched from guestprofiles collection
        - Membership tier displayed with color-coded badges (Bronze, Silver, Gold, Platinum)
        - **Implemented Profile Save Functionality**: Profile edits now save to Firestore
        - Saves to guestprofiles collection (primary)
        - Also updates users collection for consistency
        - Profile data loaded from guestprofiles on page load
        - Updates firstName, lastName, phone, dateOfBirth, nationality, address
        - **Removed guests collection**: Consolidated all data into guestprofiles
        - guestprofiles now contains basic info, loyalty data, AND booking-specific data
        - Simplified data structure - no more duplication across collections
        - Added emergencyContact, idInfo, bookingPreferences to guestprofiles
        - **CRITICAL FIX**: Registration flag using useRef prevents brief unauthorized access after registration
        - Fixed race condition where onAuthStateChanged fired before signOut during registration
        - Users are now completely blocked from accessing protected routes during registration
        - **Fixed Resend Verification Email**: Modal now temporarily signs in, resends email, then signs out
        - Resend button passes user's password to allow temporary authentication
        - **CRITICAL FIX**: Added flag to block navigation during resend operation
        - Prevents user from being redirected to landing page during temporary sign-in for resend
        - Modal stays open, user stays on auth page, seamless UX
        - **Enhanced Verification Modal UI**: Clean, simplified design with lock icon
        - Success message stays visible (doesn't auto-hide after 5 seconds)
        - Simple, non-intrusive success notification when email is resent
        - Removed cluttered warning boxes and excessive instructions
        - Clean layout with minimal colored boxes
        - Error messages displayed clearly when needed
        - Loading state with spinner while resending
        - Users can only access their own data (principle of least privilege)
        - Admin role verified by email address
        - Fixed "Missing or insufficient permissions" Firestore errors
        -**Verified Working**: Gmail integration confirmed, emails being sent successfully, verification badge displays correctly, modal shows after registration, profile stats connected to database, NO unauthorized access during registration

## On-Going:

## Pending:
1. Valmores (Financial Reports)
    A.) Task/Feature:
    B.) Status: Pending
    C.) Time Spent:
    D.) Remarks:

2. Valmores (Expense Management)
    A.) Task/Feature:
    B.) Status: Pending
    C.) Time Spent:
    D.) Remarks:

3. Valmores (Backend)
    A.) Task/Feature: Backend Logic of Each Pages for finance
    B.) Status: Pending
    C.) Time Spent:
    D.) Remarks:

4. Valmores (Payroll)
    A.) Task/Feature:
    B.) Status: Pending
    C.) Time Spent:
    D.) Remarks: