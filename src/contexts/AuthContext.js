import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
export const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        user: null,
        isLoading: true,
        error: null
    });
    const isRegisteringRef = useRef(false);
    const isResendingVerificationRef = useRef(false);
    useEffect(() => {
        // Check for admin session and authenticate with Firebase if needed
        const checkAndAuthenticateAdmin = async () => {
            const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
            const adminUserData = sessionStorage.getItem('adminUser');
            if (isAdminAuthenticated === 'true' && adminUserData) {
                try {
                    const adminUser = JSON.parse(adminUserData);
                    // Authenticate with Firebase Auth using admin credentials
                    if (adminUser.email === 'balayginhawaAdmin123@gmail.com') {
                        try {
                            // Try to sign in with Firebase Auth
                            await signInWithEmailAndPassword(auth, adminUser.email, 'Admin12345');
                            return true;
                        }
                        catch (firebaseError) {
                            // Fallback to session data if Firebase Auth fails
                            setState({
                                user: {
                                    ...adminUser,
                                    createdAt: new Date(),
                                    lastLogin: new Date(),
                                    isEnabled: true
                                },
                                isLoading: false,
                                error: null
                            });
                            // Redirect admin to dashboard
                            navigate('/admin/dashboard');
                            return true;
                        }
                    }
                }
                catch (error) {
                    console.error('Error processing admin session:', error);
                    sessionStorage.removeItem('isAdminAuthenticated');
                    sessionStorage.removeItem('adminUser');
                }
            }
            return false;
        };
        // Always set up Firebase Auth listener
        const unsubscribe = setupFirebaseAuthListener();
        // Check and authenticate admin session
        checkAndAuthenticateAdmin();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);
    const setupFirebaseAuthListener = () => {
        // Set session persistence globally - user will be logged out when tab is closed
        setPersistence(auth, browserSessionPersistence).catch((error) => {
            console.error('Failed to set session persistence:', error);
        });
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            // Don't update state if currently in registration process
            if (isRegisteringRef.current) {
                return;
            }
            // Don't update state if currently resending verification email
            if (isResendingVerificationRef.current) {
                return;
            }
            if (firebaseUser) {
                try {
                    // Determine user role based on email domain or specific emails
                    let userRole = 'guest'; // Default to guest
                    const email = firebaseUser.email || '';
                    // Admin emails (you can modify this list)
                    const adminEmails = [
                        'admin@hotel.com',
                        'manager@hotel.com',
                        'balayginhawaadmin123@gmail.com' // Lowercase version for comparison
                    ];
                    // Staff emails (you can modify this list)  
                    const staffEmails = ['staff@hotel.com', 'reception@hotel.com'];
                    if (adminEmails.includes(email.toLowerCase())) {
                        userRole = 'admin';
                    }
                    else if (staffEmails.includes(email.toLowerCase()) || email.includes('@staff.')) {
                        userRole = 'staff';
                    }
                    // Create a basic user object without Firestore dependency
                    const basicUser = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || undefined,
                        role: userRole,
                        createdAt: new Date(),
                        lastLogin: new Date(),
                        isEnabled: true,
                        emailVerified: firebaseUser.emailVerified
                    };
                    setState({
                        user: basicUser,
                        isLoading: false,
                        error: null
                    });
                    // Auto-redirect based on user role
                    if (userRole === 'admin') {
                        navigate('/admin/dashboard');
                    }
                }
                catch (error) {
                    console.error('Error setting user data:', error);
                    setState({
                        user: null,
                        isLoading: false,
                        error: 'Failed to set user data'
                    });
                }
            }
            else {
                setState({
                    user: null,
                    isLoading: false,
                    error: null
                });
            }
        });
        return unsubscribe;
    };
    const login = async ({ email, password }) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Check if email is verified (skip for admin accounts)
            const email_lower = userCredential.user.email?.toLowerCase() || '';
            const adminEmails = [
                'admin@hotel.com',
                'manager@hotel.com',
                'balayginhawaadmin123@gmail.com' // Lowercase version for comparison
            ];
            const isAdmin = adminEmails.includes(email_lower);
            // Enforce email verification for non-admin users
            if (!isAdmin && !userCredential.user.emailVerified) {
                // Sign out the user immediately
                await signOut(auth);
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Please verify your email address before logging in. Check your inbox for the verification link.'
                }));
                throw new Error('Email not verified. Please check your inbox and verify your email address before logging in.');
            }
            // The onAuthStateChanged listener will handle the redirect for admin users
            // Update Firestore emailVerified field if it was just verified
            if (userCredential.user.emailVerified) {
                try {
                    const userDocRef = doc(db, 'users', userCredential.user.uid);
                    await setDoc(userDocRef, {
                        emailVerified: true,
                        lastLogin: new Date()
                    }, { merge: true });
                }
                catch (firestoreError) {
                    console.error('Failed to update Firestore verification status:', firestoreError);
                    // Don't throw - user can still log in
                }
            }
            // Auth state listener will handle the rest
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to login'
            }));
            throw error;
        }
    };
    const register = async ({ email, password, firstName, lastName }) => {
        try {
            // Set registration flag to prevent onAuthStateChanged from firing
            isRegisteringRef.current = true;
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update the user's display name
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });
            // Determine user role based on email
            let userRole = 'guest';
            const adminEmails = [
                'admin@hotel.com',
                'manager@hotel.com',
                'balayginhawaadmin123@gmail.com' // Lowercase version for comparison
            ];
            const staffEmails = ['staff@hotel.com', 'reception@hotel.com'];
            if (adminEmails.includes(email.toLowerCase())) {
                userRole = 'admin';
            }
            else if (staffEmails.includes(email.toLowerCase()) || email.includes('@staff.')) {
                userRole = 'staff';
            }
            // Save user data to Firestore
            const userData = {
                uid: userCredential.user.uid,
                email: email,
                firstName: firstName,
                lastName: lastName,
                displayName: `${firstName} ${lastName}`,
                role: userRole,
                createdAt: new Date(),
                lastLogin: new Date(),
                isEnabled: true,
                emailVerified: false // Initially false, will be true after verification
            };
            await setDoc(doc(db, 'users', userCredential.user.uid), userData);
            // Send email verification
            try {
                await sendEmailVerification(userCredential.user);
            }
            catch (emailError) {
                console.error('Failed to send verification email:', emailError);
                // Don't throw error - allow registration to continue even if email fails
            }
            // If user is a guest, create comprehensive guest profile document
            if (userRole === 'guest') {
                // Create single guest profile document with all data
                const guestProfileData = {
                    // Basic Info
                    uid: userCredential.user.uid,
                    guestId: userCredential.user.uid,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    fullName: `${firstName} ${lastName}`,
                    phone: '',
                    address: '',
                    dateOfBirth: null,
                    nationality: '',
                    profilePicture: '',
                    // Loyalty & Stats
                    loyaltyPoints: 0,
                    membershipTier: 'Bronze',
                    totalBookings: 0,
                    totalSpent: 0,
                    lastBookingDate: null,
                    // Booking-Specific Data (moved from guests collection)
                    emergencyContact: {
                        name: '',
                        phone: '',
                        relationship: ''
                    },
                    idInfo: {
                        idType: '',
                        idNumber: ''
                    },
                    bookingPreferences: {
                        roomType: '',
                        bedType: '',
                        smokingPreference: false,
                        dietaryRestrictions: [],
                        floor: '',
                        view: '',
                        amenities: []
                    },
                    // Communication Preferences
                    communicationPreferences: {
                        method: 'email',
                        newsletter: true,
                        promotions: true
                    },
                    // Metadata
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true
                };
                await setDoc(doc(db, 'guestprofiles', userCredential.user.uid), guestProfileData);
            }
            // IMPORTANT: Sign out the user immediately after registration
            // User must verify their email before they can log in
            // This prevents auto-login and forces the verification flow
            await signOut(auth);
            // Clear registration flag and set loading to false
            isRegisteringRef.current = false;
            setState(prev => ({
                ...prev,
                isLoading: false,
                user: null // Clear user state to ensure they can't access anything
            }));
        }
        catch (error) {
            console.error('Registration error:', error);
            // Clear registration flag on error
            isRegisteringRef.current = false;
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to register'
            }));
            throw error;
        }
    };
    const logout = async () => {
        try {
            // Clear all session storage first to prevent auto-login on refresh
            sessionStorage.removeItem('isAdminAuthenticated');
            sessionStorage.removeItem('adminUser');
            // Sign out from Firebase Auth
            await signOut(auth);
            // Clear user state
            setState({
                user: null,
                isLoading: false,
                error: null
            });
            // Navigate to home page
            navigate('/');
        }
        catch (error) {
            console.error('Logout failed:', error);
            // Even if Firebase signOut fails, clear session storage
            sessionStorage.removeItem('isAdminAuthenticated');
            sessionStorage.removeItem('adminUser');
            setState({
                user: null,
                isLoading: false,
                error: null
            });
            navigate('/');
        }
    };
    const hasRole = (role) => {
        if (!state.user)
            return false;
        if (Array.isArray(role)) {
            return role.includes(state.user.role);
        }
        return state.user.role === role;
    };
    const isAdmin = () => hasRole('admin');
    const isStaff = () => hasRole('staff');
    const setResendingVerification = (isResending) => {
        isResendingVerificationRef.current = isResending;
    };
    const contextValue = {
        ...state,
        userData: state.user,
        loading: state.isLoading,
        isAuthenticated: !!state.user,
        login,
        register,
        logout,
        hasRole,
        isAdmin,
        isStaff,
        setResendingVerification
    };
    return (_jsx(AuthContext.Provider, { value: contextValue, children: children }));
};
// Move useAuth to a separate file
export { useAuth } from '../hooks/useAuth';
