import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc } from 'firebase/firestore';
export const NewProfilePage = () => {
    const { userData, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userStats, setUserStats] = useState({
        memberSince: new Date().getFullYear(),
        totalBookings: 0,
        loyaltyPoints: 0,
        membershipTier: 'Bronze'
    });
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: userData?.email || '',
        phone: '',
        dateOfBirth: '',
        nationality: '',
        address: ''
    });
    useEffect(() => {
        if (userData) {
            // Fetch user stats and profile data from Firestore
            fetchUserStats();
            fetchProfileData();
        }
    }, [userData]);
    const fetchProfileData = async () => {
        if (!userData?.uid)
            return;
        try {
            // Try to get data from guestprofiles first
            const guestProfileRef = doc(db, 'guestprofiles', userData.uid);
            const guestProfileSnap = await getDoc(guestProfileRef);
            if (guestProfileSnap.exists()) {
                const data = guestProfileSnap.data();
                setProfile({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: userData.email || '',
                    phone: data.phone || '',
                    dateOfBirth: data.dateOfBirth || '',
                    nationality: data.nationality || '',
                    address: data.address || ''
                });
            }
            else {
                // Fallback to displayName from userData
                const displayName = userData.displayName || '';
                const nameParts = displayName.split(' ');
                setProfile(prev => ({
                    ...prev,
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    email: userData.email || ''
                }));
            }
        }
        catch (error) {
            console.error('Error fetching profile data:', error);
            // Fallback to displayName
            const displayName = userData.displayName || '';
            const nameParts = displayName.split(' ');
            setProfile(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: userData.email || ''
            }));
        }
    };
    const fetchUserStats = async () => {
        if (!userData?.uid)
            return;
        try {
            // Get user creation date from users collection
            const userDocRef = doc(db, 'users', userData.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userFirestoreData = userDocSnap.data();
                const createdAt = userFirestoreData.createdAt?.toDate() || new Date();
                const memberYear = createdAt.getFullYear();
                setUserStats(prev => ({
                    ...prev,
                    memberSince: memberYear
                }));
            }
            // Get guest profile stats if user is a guest
            if (userData.role === 'guest') {
                const guestProfileRef = doc(db, 'guestprofiles', userData.uid);
                const guestProfileSnap = await getDoc(guestProfileRef);
                if (guestProfileSnap.exists()) {
                    const guestData = guestProfileSnap.data();
                    setUserStats(prev => ({
                        ...prev,
                        loyaltyPoints: guestData.loyaltyPoints || 0,
                        totalBookings: guestData.totalBookings || 0,
                        membershipTier: guestData.membershipTier || 'Bronze'
                    }));
                }
                // Also count actual bookings from bookings collection
                const bookingsQuery = query(collection(db, 'bookings'), where('guestId', '==', userData.uid));
                const bookingsSnapshot = await getDocs(bookingsQuery);
                const bookingCount = bookingsSnapshot.size;
                setUserStats(prev => ({
                    ...prev,
                    totalBookings: bookingCount
                }));
            }
        }
        catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };
    const handleInputChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        if (!userData?.uid)
            return;
        setLoading(true);
        try {
            // Update guestprofiles collection
            const guestProfileRef = doc(db, 'guestprofiles', userData.uid);
            const guestProfileData = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                fullName: `${profile.firstName} ${profile.lastName}`,
                phone: profile.phone || '',
                dateOfBirth: profile.dateOfBirth || null,
                nationality: profile.nationality || '',
                address: profile.address || '',
                updatedAt: new Date()
            };
            await setDoc(guestProfileRef, guestProfileData, { merge: true });
            // Also update users collection for consistency
            const userRef = doc(db, 'users', userData.uid);
            await updateDoc(userRef, {
                firstName: profile.firstName,
                lastName: profile.lastName,
                displayName: `${profile.firstName} ${profile.lastName}`,
                lastLogin: new Date()
            });
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        }
        catch (error) {
            setMessage('Failed to update profile. Please try again.');
            console.error('Profile update error:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        if (userData) {
            const displayName = userData.displayName || '';
            const nameParts = displayName.split(' ');
            setProfile(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: userData.email || ''
            }));
        }
    };
    if (!userData) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-heritage-green/10 via-white to-heritage-light/20 flex items-center justify-center", children: _jsxs("div", { className: "bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4", children: [_jsx("div", { className: "w-20 h-20 bg-heritage-green/10 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx("svg", { className: "w-10 h-10 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Access Required" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Please sign in to access your profile and manage your account." }), _jsx("button", { onClick: () => navigate('/auth'), className: "w-full px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300", children: "Sign In to Continue" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-heritage-light via-white to-heritage-green/10 py-8 sm:py-12 pt-24 sm:pt-28 md:pt-36 relative overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute top-20 left-20 w-96 h-96 bg-heritage-green/15 rounded-full blur-3xl animate-pulse" }), _jsx("div", { className: "absolute top-40 right-32 w-80 h-80 bg-heritage-neutral/20 rounded-full blur-3xl animate-pulse", style: { animationDelay: '1000ms' } }), _jsx("div", { className: "absolute bottom-32 left-1/3 w-72 h-72 bg-heritage-light/30 rounded-full blur-3xl animate-pulse", style: { animationDelay: '2000ms' } }), _jsx("div", { className: "absolute bottom-20 right-20 w-64 h-64 bg-heritage-green/10 rounded-full blur-3xl animate-pulse", style: { animationDelay: '3000ms' } })] }), _jsx("div", { className: "absolute inset-0 opacity-30", children: _jsx("div", { className: "absolute inset-0", style: {
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ABAD8A' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    } }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: [_jsxs("div", { className: "relative bg-gradient-to-br from-white via-heritage-light/10 to-white backdrop-blur-2xl rounded-3xl border-2 border-heritage-green/30 shadow-2xl overflow-hidden mb-8 sm:mb-10 md:mb-12 transform hover:shadow-3xl transition-shadow duration-500", children: [_jsxs("div", { className: "absolute inset-0 opacity-[0.03]", children: [_jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-heritage-green rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-0 left-0 w-72 h-72 bg-heritage-neutral rounded-full blur-3xl" })] }), _jsx("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-heritage-green to-transparent" }), _jsx("div", { className: "relative p-6 sm:p-8 md:p-10 lg:p-12", children: _jsxs("div", { className: "flex items-center gap-5 sm:gap-6 md:gap-8", children: [_jsxs("div", { className: "relative flex-shrink-0 group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-heritage-green/40 to-heritage-neutral/40 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-heritage-green via-heritage-green/90 to-heritage-neutral rounded-3xl flex items-center justify-center shadow-2xl ring-4 ring-white/60 group-hover:ring-heritage-green/30 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500", children: [_jsx("svg", { className: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white drop-shadow-2xl", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), _jsx("div", { className: "absolute -top-1 -right-1 w-3 h-3 bg-heritage-light rounded-full border-2 border-white shadow-lg" })] })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h1", { className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-heritage-green via-heritage-green to-heritage-neutral bg-clip-text text-transparent drop-shadow-sm leading-tight", children: "My Profile" }), userData?.emailVerified && (_jsx("div", { className: "hidden sm:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-full shadow-lg ring-2 ring-white/50 animate-pulse", children: _jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }))] }), _jsx("p", { className: "text-heritage-neutral/70 text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-3 sm:mb-4", children: "Manage your account settings and preferences" }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 sm:gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-heritage-green/10 rounded-full border border-heritage-green/20", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-2 h-2 bg-heritage-green rounded-full animate-pulse" }), _jsx("div", { className: "absolute inset-0 w-2 h-2 bg-heritage-green rounded-full animate-ping" })] }), _jsx("span", { className: "text-xs sm:text-sm text-heritage-green font-bold", children: "Active Now" })] }), _jsx("div", { className: "hidden sm:block w-px h-4 bg-heritage-neutral/20" }), _jsxs("div", { className: "flex items-center gap-2 text-xs sm:text-sm text-heritage-neutral/60", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("span", { className: "font-medium", children: "Updated today" })] })] })] })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-heritage-green/20 to-transparent" })] }), message && (_jsx("div", { className: `mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl border shadow-2xl ${message.includes('successfully')
                            ? 'bg-heritage-green/20 border-heritage-green/30 text-heritage-green'
                            : 'bg-red-50/80 border-red-200/50 text-red-700'}`, children: _jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [_jsx("div", { className: `w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${message.includes('successfully') ? 'bg-heritage-green/30' : 'bg-red-100'}`, children: _jsx("svg", { className: "w-5 h-5 sm:w-6 sm:h-6", fill: "currentColor", viewBox: "0 0 20 20", children: message.includes('successfully') ? (_jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" })) : (_jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" })) }) }), _jsx("span", { className: "font-semibold text-sm sm:text-base md:text-xl", children: message })] }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8", children: [_jsx("div", { className: "lg:col-span-1", children: _jsx("div", { className: "bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-heritage-neutral/20 shadow-2xl p-6 sm:p-8 sm:hover:shadow-3xl sm:hover:-translate-y-2 transition-all duration-700 h-full flex flex-col", children: _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "relative mb-6 sm:mb-8", children: [_jsx("div", { className: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-2xl ring-4 ring-heritage-light/30 sm:hover:scale-110 sm:hover:rotate-3 transition-all duration-500", children: _jsx("span", { className: "text-white font-bold text-3xl sm:text-4xl drop-shadow-lg", children: profile.firstName ? profile.firstName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase() }) }), _jsx("div", { className: "absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-full border-2 sm:border-4 border-white shadow-xl flex items-center justify-center animate-pulse", children: _jsx("svg", { className: "w-3 h-3 sm:w-4 sm:h-4 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) })] }), _jsxs("div", { className: "mb-6 sm:mb-8", children: [_jsx("h3", { className: "font-bold text-heritage-green text-xl sm:text-2xl mb-2 drop-shadow-sm", children: profile.firstName && profile.lastName
                                                            ? `${profile.firstName} ${profile.lastName}`
                                                            : userData.displayName || 'Welcome, Guest' }), _jsx("p", { className: "text-heritage-neutral/80 text-sm sm:text-base md:text-lg mb-4", children: profile.email }), userData?.emailVerified ? (_jsxs("div", { className: "inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 backdrop-blur-xl text-heritage-green rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl border border-heritage-green/30", children: [_jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }), "Verified Member"] })) : (_jsxs("div", { className: "inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-100/80 to-amber-50/80 backdrop-blur-xl text-amber-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl border border-amber-300/50", children: [_jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), "Email Not Verified"] }))] }), _jsxs("div", { className: "space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-heritage-neutral/20 flex-grow", children: [_jsxs("div", { className: "flex items-center justify-between p-3 sm:p-4 bg-heritage-light/20 rounded-xl sm:rounded-2xl backdrop-blur-sm", children: [_jsx("span", { className: "text-heritage-neutral text-sm sm:text-base font-medium", children: "Member since" }), _jsx("span", { className: "font-bold text-heritage-green text-base sm:text-lg", children: userStats.memberSince })] }), _jsxs("div", { className: "flex items-center justify-between p-3 sm:p-4 bg-heritage-light/20 rounded-xl sm:rounded-2xl backdrop-blur-sm", children: [_jsx("span", { className: "text-heritage-neutral text-sm sm:text-base font-medium", children: "Total bookings" }), _jsx("span", { className: "font-bold text-heritage-green text-base sm:text-lg", children: userStats.totalBookings })] }), _jsxs("div", { className: "flex items-center justify-between p-3 sm:p-4 bg-heritage-light/20 rounded-xl sm:rounded-2xl backdrop-blur-sm", children: [_jsx("span", { className: "text-heritage-neutral text-sm sm:text-base font-medium", children: "Loyalty Points" }), _jsx("span", { className: "font-bold text-heritage-green text-base sm:text-lg", children: userStats.loyaltyPoints.toLocaleString() })] }), _jsxs("div", { className: "flex items-center justify-between p-3 sm:p-4 bg-heritage-light/20 rounded-xl sm:rounded-2xl backdrop-blur-sm", children: [_jsx("span", { className: "text-heritage-neutral text-sm sm:text-base font-medium", children: "Membership Tier" }), _jsx("span", { className: `font-bold text-sm sm:text-base md:text-lg px-2 sm:px-3 py-1 rounded-lg ${userStats.membershipTier === 'Platinum' ? 'bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900' :
                                                                    userStats.membershipTier === 'Gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900' :
                                                                        userStats.membershipTier === 'Silver' ? 'bg-gradient-to-r from-gray-300 to-gray-100 text-gray-700' :
                                                                            'bg-gradient-to-r from-amber-600 to-amber-400 text-white'}`, children: userStats.membershipTier })] })] })] }) }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-heritage-neutral/20 shadow-2xl p-6 sm:p-8 sm:hover:shadow-3xl sm:hover:-translate-y-1 transition-all duration-500", children: [_jsxs("div", { className: "mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-heritage-green mb-2", children: "Personal Information" }), _jsx("p", { className: "text-heritage-neutral/80 text-sm sm:text-base", children: "Update your profile details and preferences" })] }), !isEditing ? (_jsx("button", { onClick: () => setIsEditing(true), className: "w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold hover:shadow-2xl active:scale-95 sm:hover:scale-105 transform transition-all duration-300 shadow-xl flex-shrink-0", children: _jsxs("div", { className: "flex items-center justify-center gap-2 sm:gap-3", children: [_jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }), "Edit Profile"] }) })) : (_jsxs("div", { className: "flex gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto flex-shrink-0", children: [_jsx("button", { onClick: handleCancel, className: "flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-heritage-neutral/80 hover:text-heritage-neutral hover:bg-heritage-light/20 rounded-lg sm:rounded-xl transition-all duration-300 font-medium", children: "Cancel" }), _jsx("button", { onClick: handleSave, disabled: loading, className: "flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold hover:shadow-2xl active:scale-95 sm:hover:scale-105 transform transition-all duration-300 shadow-xl disabled:opacity-50 disabled:hover:scale-100", children: _jsxs("div", { className: "flex items-center justify-center gap-2 sm:gap-3", children: [loading ? (_jsxs("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })) : (_jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })), loading ? 'Saving...' : 'Save Changes'] }) })] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6", children: [_jsxs("div", { className: "space-y-2 sm:space-y-3", children: [_jsx("label", { className: "block text-xs sm:text-sm font-bold text-heritage-green", children: "First Name" }), _jsx("div", { className: "relative group", children: _jsx("input", { type: "text", value: profile.firstName, onChange: (e) => handleInputChange('firstName', e.target.value), disabled: !isEditing, className: `w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${!isEditing
                                                                    ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed'
                                                                    : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'} placeholder-heritage-neutral/50 font-medium`, placeholder: "Enter your first name" }) })] }), _jsxs("div", { className: "space-y-2 sm:space-y-3", children: [_jsx("label", { className: "block text-xs sm:text-sm font-bold text-heritage-green", children: "Last Name" }), _jsx("input", { type: "text", value: profile.lastName, onChange: (e) => handleInputChange('lastName', e.target.value), disabled: !isEditing, className: `w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${!isEditing
                                                                ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed'
                                                                : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'} placeholder-heritage-neutral/50 font-medium`, placeholder: "Enter your last name" })] }), _jsxs("div", { className: "space-y-2 sm:space-y-3", children: [_jsx("label", { className: "block text-xs sm:text-sm font-bold text-heritage-green", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "email", value: profile.email, disabled: true, className: "w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 backdrop-blur-sm font-medium cursor-not-allowed" }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6", children: _jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5 text-heritage-neutral/50", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) })] }), _jsx("p", { className: "text-xs text-heritage-neutral/60 font-medium", children: "Email cannot be changed for security reasons" })] }), _jsxs("div", { className: "space-y-2 sm:space-y-3", children: [_jsx("label", { className: "block text-xs sm:text-sm font-bold text-heritage-green", children: "Phone Number" }), _jsx("input", { type: "tel", value: profile.phone, onChange: (e) => handleInputChange('phone', e.target.value), disabled: !isEditing, className: `w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${!isEditing
                                                                ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed'
                                                                : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'} placeholder-heritage-neutral/50 font-medium`, placeholder: "Enter your phone number" })] }), _jsxs("div", { className: "space-y-2 sm:space-y-3", children: [_jsx("label", { className: "block text-xs sm:text-sm font-bold text-heritage-green", children: "Date of Birth" }), _jsx("input", { type: "date", value: profile.dateOfBirth, onChange: (e) => handleInputChange('dateOfBirth', e.target.value), disabled: !isEditing, className: `w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${!isEditing
                                                                ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed'
                                                                : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'} placeholder-heritage-neutral/50 font-medium` })] }), _jsxs("div", { className: "space-y-2 sm:space-y-3", children: [_jsx("label", { className: "block text-xs sm:text-sm font-bold text-heritage-green", children: "Nationality" }), _jsx("input", { type: "text", value: profile.nationality, onChange: (e) => handleInputChange('nationality', e.target.value), disabled: !isEditing, className: `w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${!isEditing
                                                                ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed'
                                                                : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'} placeholder-heritage-neutral/50 font-medium`, placeholder: "Enter your nationality" })] }), _jsxs("div", { className: "md:col-span-2 space-y-2 sm:space-y-3", children: [_jsx("label", { className: "block text-xs sm:text-sm font-bold text-heritage-green", children: "Address" }), _jsx("textarea", { value: profile.address, onChange: (e) => handleInputChange('address', e.target.value), disabled: !isEditing, rows: 4, className: `w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 transition-all duration-300 resize-none backdrop-blur-sm ${!isEditing
                                                                ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed'
                                                                : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'} placeholder-heritage-neutral/50 font-medium`, placeholder: "Enter your complete address" })] })] })] }) })] }), _jsxs("div", { className: "mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8", children: [_jsxs("div", { className: "bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-heritage-neutral/20 shadow-2xl p-6 sm:p-8 sm:hover:shadow-3xl sm:hover:-translate-y-1 transition-all duration-500", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-xl sm:text-2xl font-bold text-heritage-green mb-2", children: "Quick Actions" }), _jsx("p", { className: "text-heritage-neutral/80 text-sm sm:text-base", children: "Manage your bookings and reservations" })] }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsx("button", { onClick: () => navigate('/my-bookings'), className: "w-full p-4 sm:p-6 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 backdrop-blur-xl rounded-xl sm:rounded-2xl hover:from-heritage-green/30 hover:to-heritage-neutral/30 transition-all duration-300 group border border-heritage-green/30 hover:border-heritage-green/50 active:scale-95 sm:hover:scale-105 hover:shadow-2xl", children: _jsxs("div", { className: "flex items-center gap-4 sm:gap-6", children: [_jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-heritage-green/30 to-heritage-neutral/30 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl flex-shrink-0", children: _jsx("svg", { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-heritage-light", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-bold text-heritage-green text-base sm:text-lg md:text-xl", children: "My Bookings" }), _jsx("div", { className: "text-heritage-neutral/70 text-sm sm:text-base md:text-lg", children: "View and manage reservations" })] })] }) }), _jsx("button", { onClick: () => navigate('/booking'), className: "w-full p-4 sm:p-6 bg-gradient-to-r from-heritage-neutral/20 to-heritage-light/30 backdrop-blur-xl rounded-xl sm:rounded-2xl hover:from-heritage-neutral/30 hover:to-heritage-light/40 transition-all duration-300 group border border-heritage-neutral/30 hover:border-heritage-neutral/50 active:scale-95 sm:hover:scale-105 hover:shadow-2xl", children: _jsxs("div", { className: "flex items-center gap-4 sm:gap-6", children: [_jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-heritage-neutral/30 to-heritage-light/40 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl flex-shrink-0", children: _jsx("svg", { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-heritage-green", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-bold text-heritage-green text-base sm:text-lg md:text-xl", children: "New Booking" }), _jsx("div", { className: "text-heritage-neutral/70 text-sm sm:text-base md:text-lg", children: "Reserve a room today" })] })] }) })] })] }), _jsxs("div", { className: "bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-heritage-neutral/20 shadow-2xl p-6 sm:p-8 sm:hover:shadow-3xl sm:hover:-translate-y-1 transition-all duration-500", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-xl sm:text-2xl font-bold text-heritage-green mb-2", children: "Account Security" }), _jsx("p", { className: "text-heritage-neutral/80 text-sm sm:text-base", children: "Your account status and security settings" })] }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsx("div", { className: "flex items-center justify-between p-4 sm:p-6 bg-heritage-green/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-heritage-green/30 shadow-xl", children: _jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [_jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-heritage-green/30 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 sm:w-6 sm:h-6 text-heritage-green", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-heritage-green text-sm sm:text-base md:text-lg", children: "Email Verified" }), _jsx("div", { className: "text-heritage-neutral/70 text-xs sm:text-sm", children: "Your email is confirmed and secure" })] })] }) }), _jsx("button", { onClick: logout, className: "w-full p-4 sm:p-6 bg-gradient-to-r from-red-50/80 to-red-100/80 backdrop-blur-xl rounded-xl sm:rounded-2xl hover:from-red-100/80 hover:to-red-200/80 transition-all duration-300 group border border-red-200/50 hover:border-red-300/50 active:scale-95 sm:hover:scale-105 hover:shadow-2xl", children: _jsxs("div", { className: "flex items-center gap-4 sm:gap-6", children: [_jsx("div", { className: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-100/80 to-red-200/80 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl flex-shrink-0", children: _jsx("svg", { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-bold text-red-700 text-base sm:text-lg md:text-xl", children: "Sign Out" }), _jsx("div", { className: "text-red-600 text-sm sm:text-base md:text-lg", children: "Logout securely from your account" })] })] }) })] })] })] })] })] }));
};
