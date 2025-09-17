import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Set session persistence globally - user will be logged out when tab is closed
    setPersistence(auth, browserSessionPersistence).catch((error) => {
      console.error('Failed to set session persistence:', error);
    });
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Determine user role based on email domain or specific emails
          let userRole: 'admin' | 'staff' | 'guest' = 'guest'; // Default to guest
          const email = firebaseUser.email || '';
          
          // Admin emails (you can modify this list)
          const adminEmails = ['admin@hotel.com', 'manager@hotel.com'];
          // Staff emails (you can modify this list)  
          const staffEmails = ['staff@hotel.com', 'reception@hotel.com'];
          
          if (adminEmails.includes(email.toLowerCase())) {
            userRole = 'admin';
          } else if (staffEmails.includes(email.toLowerCase()) || email.includes('@staff.')) {
            userRole = 'staff';
          }
          
          // Create a basic user object without Firestore dependency
          const basicUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            role: userRole,
            createdAt: new Date(),
            lastLogin: new Date(),
            isEnabled: true
          };

          setState({
            user: basicUser,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Error setting user data:', error);
          setState({
            user: null,
            isLoading: false,
            error: 'Failed to set user data'
          });
        }
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }: LoginCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener will handle the rest
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to login'
      }));
      throw error;
    }
  };

  const register = async ({ email, password, firstName, lastName }: RegisterCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Determine user role based on email
      let userRole: 'admin' | 'staff' | 'guest' = 'guest';
      const adminEmails = ['admin@hotel.com', 'manager@hotel.com'];
      const staffEmails = ['staff@hotel.com', 'reception@hotel.com'];
      
      if (adminEmails.includes(email.toLowerCase())) {
        userRole = 'admin';
      } else if (staffEmails.includes(email.toLowerCase()) || email.includes('@staff.')) {
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
        isEnabled: true
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log('User data saved to Firestore:', userData);
      
      // If user is a guest, also create guest and guest profile documents
      if (userRole === 'guest') {
        // Create guest document
        const guestData = {
          uid: userCredential.user.uid,
          email: email,
          firstName: firstName,
          lastName: lastName,
          fullName: `${firstName} ${lastName}`,
          phone: '', // Can be updated later
          address: '', // Can be updated later
          dateOfBirth: null, // Can be updated later
          nationality: '', // Can be updated later
          idType: '', // Can be updated later
          idNumber: '', // Can be updated later
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          },
          preferences: {
            roomType: '',
            bedType: '',
            smokingPreference: false,
            dietaryRestrictions: []
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
        
        await setDoc(doc(db, 'guests', userCredential.user.uid), guestData);
        console.log('Guest data saved to Firestore:', guestData);
        
        // Create guest profile document
        const guestProfileData = {
          uid: userCredential.user.uid,
          guestId: userCredential.user.uid,
          email: email,
          firstName: firstName,
          lastName: lastName,
          fullName: `${firstName} ${lastName}`,
          profilePicture: '',
          loyaltyPoints: 0,
          membershipTier: 'Bronze',
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: null,
          preferences: {
            communicationMethod: 'email',
            newsletter: true,
            promotions: true,
            roomPreferences: {
              floor: '',
              view: '',
              bedType: '',
              amenities: []
            }
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
        
        await setDoc(doc(db, 'guestprofiles', userCredential.user.uid), guestProfileData);
        console.log('Guest profile data saved to Firestore:', guestProfileData);
      }
      
      // Set loading to false on successful registration - don't update user state yet
      // This allows the registration modal to show before auto-login
      setState(prev => ({ ...prev, isLoading: false }));
      
    } catch (error) {
      console.error('Registration error:', error);
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
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to logout'
      }));
      throw error;
    }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!state.user) return false;
    if (Array.isArray(role)) {
      return role.includes(state.user.role);
    }
    return state.user.role === role;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isStaff = (): boolean => hasRole('staff');

  const contextValue: AuthContextType = {
    ...state,
    userData: state.user,
    loading: state.isLoading,
    isAuthenticated: !!state.user,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isStaff
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Move useAuth to a separate file
export { useAuth } from '../hooks/useAuth';
