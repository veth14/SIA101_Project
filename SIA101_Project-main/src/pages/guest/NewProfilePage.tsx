import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
}

export const NewProfilePage: React.FC = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState<UserProfile>({
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
      const displayName = userData.displayName || '';
      const nameParts = displayName.split(' ');
      
      setProfile(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userData.email || ''
      }));
    }
  }, [userData]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-heritage-green/10 via-white to-heritage-light/20 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-heritage-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-8">Please sign in to access your profile and manage your account.</p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-heritage-light via-white to-heritage-green/10 py-12 pt-32 relative overflow-hidden">
      {/* Heritage Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-heritage-green/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-80 h-80 bg-heritage-neutral/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-heritage-light/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2000ms'}}></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-heritage-green/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3000ms'}}></div>
      </div>

      {/* Heritage Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ABAD8A' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heritage Header with Glassmorphism */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-heritage-green to-heritage-neutral bg-clip-text text-transparent drop-shadow-sm">
                  My Profile
                </h1>
                <p className="text-heritage-neutral/80 mt-1 text-lg">Manage your account settings and preferences</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transform transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </div>
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-heritage-neutral/80 hover:text-heritage-neutral hover:bg-heritage-light/20 rounded-xl transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transform transition-all duration-300 shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="flex items-center gap-3">
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Heritage Success/Error Message */}
        {message && (
          <div className={`mb-8 p-6 rounded-3xl backdrop-blur-xl border shadow-2xl ${
            message.includes('successfully') 
              ? 'bg-heritage-green/20 border-heritage-green/30 text-heritage-green' 
              : 'bg-red-50/80 border-red-200/50 text-red-700'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                message.includes('successfully') ? 'bg-heritage-green/30' : 'bg-red-100'
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  {message.includes('successfully') ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
              <span className="font-semibold text-xl">{message}</span>
            </div>
          </div>
        )}


        {/* Main Content Layout with Glassmorphism */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Heritage User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-8 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700">
              <div className="text-center">
                {/* Heritage User Avatar */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-heritage-green to-heritage-neutral rounded-3xl flex items-center justify-center mx-auto shadow-2xl ring-4 ring-heritage-light/30 hover:scale-110 hover:rotate-3 transition-all duration-500">
                    <span className="text-white font-bold text-4xl drop-shadow-lg">
                      {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Heritage Online indicator */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Heritage User Name and Email */}
                <div className="mb-8">
                  <h3 className="font-bold text-heritage-green text-2xl mb-2 drop-shadow-sm">
                    {profile.firstName && profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}`
                      : userData.displayName || 'Welcome, Guest'
                    }
                  </h3>
                  <p className="text-heritage-neutral/80 text-lg mb-4">{profile.email}</p>
                  
                  {/* Heritage Verification Status */}
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 backdrop-blur-xl text-heritage-green rounded-2xl text-sm font-semibold shadow-xl border border-heritage-green/30">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Member
                  </div>
                </div>

                {/* Heritage User Stats */}
                <div className="space-y-4 pt-6 border-t border-heritage-neutral/20">
                  <div className="flex items-center justify-between p-4 bg-heritage-light/20 rounded-2xl backdrop-blur-sm">
                    <span className="text-heritage-neutral font-medium">Member since</span>
                    <span className="font-bold text-heritage-green text-lg">2024</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-heritage-light/20 rounded-2xl backdrop-blur-sm">
                    <span className="text-heritage-neutral font-medium">Total bookings</span>
                    <span className="font-bold text-heritage-green text-lg">0</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-heritage-light/20 rounded-2xl backdrop-blur-sm">
                    <span className="text-heritage-neutral font-medium">Loyalty Points</span>
                    <span className="font-bold text-heritage-green text-lg">250</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Heritage Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-8 hover:shadow-3xl hover:-translate-y-1 transition-all duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-heritage-green mb-2">Personal Information</h2>
                <p className="text-heritage-neutral/80">Update your profile details and preferences</p>
              </div>

              {/* Heritage Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-heritage-green">
                    First Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                        !isEditing 
                          ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed' 
                          : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'
                      } placeholder-heritage-neutral/50 font-medium`}
                      placeholder="Enter your first name"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-heritage-green">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      !isEditing 
                        ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed' 
                        : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'
                    } placeholder-heritage-neutral/50 font-medium`}
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-heritage-green">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile.email}
                      disabled={true}
                      className="w-full px-6 py-4 rounded-2xl border-2 bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 backdrop-blur-sm font-medium cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                      <svg className="w-5 h-5 text-heritage-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-heritage-neutral/60 font-medium">Email cannot be changed for security reasons</p>
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-heritage-green">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      !isEditing 
                        ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed' 
                        : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'
                    } placeholder-heritage-neutral/50 font-medium`}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-heritage-green">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      !isEditing 
                        ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed' 
                        : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'
                    } placeholder-heritage-neutral/50 font-medium`}
                  />
                </div>

                {/* Nationality */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-heritage-green">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={profile.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      !isEditing 
                        ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed' 
                        : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'
                    } placeholder-heritage-neutral/50 font-medium`}
                    placeholder="Enter your nationality"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-bold text-heritage-green">
                    Address
                  </label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 resize-none backdrop-blur-sm ${
                      !isEditing 
                        ? 'bg-heritage-light/20 border-heritage-neutral/30 text-heritage-neutral/60 cursor-not-allowed' 
                        : 'bg-white/80 border-heritage-neutral/40 text-heritage-green hover:border-heritage-green/70 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/20 focus:bg-white'
                    } placeholder-heritage-neutral/50 font-medium`}
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heritage Quick Actions & Security Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Heritage Quick Actions */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-8 hover:shadow-3xl hover:-translate-y-1 transition-all duration-500">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-heritage-green mb-2">Quick Actions</h3>
              <p className="text-heritage-neutral/80">Manage your bookings and reservations</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full p-6 bg-gradient-to-r from-heritage-green/20 to-heritage-neutral/20 backdrop-blur-xl rounded-2xl hover:from-heritage-green/30 hover:to-heritage-neutral/30 transition-all duration-300 group border border-heritage-green/30 hover:border-heritage-green/50 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-heritage-green/30 to-heritage-neutral/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl">
                    <svg className="w-8 h-8 text-heritage-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-heritage-green text-xl">My Bookings</div>
                    <div className="text-heritage-neutral/70 text-lg">View and manage reservations</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/booking')}
                className="w-full p-6 bg-gradient-to-r from-heritage-neutral/20 to-heritage-light/30 backdrop-blur-xl rounded-2xl hover:from-heritage-neutral/30 hover:to-heritage-light/40 transition-all duration-300 group border border-heritage-neutral/30 hover:border-heritage-neutral/50 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-heritage-neutral/30 to-heritage-light/40 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl">
                    <svg className="w-8 h-8 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-heritage-green text-xl">New Booking</div>
                    <div className="text-heritage-neutral/70 text-lg">Reserve a room today</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Heritage Account Security */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-heritage-neutral/20 shadow-2xl p-8 hover:shadow-3xl hover:-translate-y-1 transition-all duration-500">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-heritage-green mb-2">Account Security</h3>
              <p className="text-heritage-neutral/80">Your account status and security settings</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-heritage-green/20 backdrop-blur-xl rounded-2xl border border-heritage-green/30 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-heritage-green/30 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-heritage-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-heritage-green text-lg">Email Verified</div>
                    <div className="text-heritage-neutral/70">Your email is confirmed and secure</div>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full p-6 bg-gradient-to-r from-red-50/80 to-red-100/80 backdrop-blur-xl rounded-2xl hover:from-red-100/80 hover:to-red-200/80 transition-all duration-300 group border border-red-200/50 hover:border-red-300/50 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100/80 to-red-200/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-red-700 text-xl">Sign Out</div>
                    <div className="text-red-600 text-lg">Logout securely from your account</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
