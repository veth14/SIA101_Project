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
    <div className="min-h-screen bg-gradient-to-br from-heritage-green/5 via-white to-heritage-light/10">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-heritage-green to-heritage-neutral py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <span className="text-white font-bold text-3xl">
                    {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : userData.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-heritage-light rounded-full flex items-center justify-center border-3 border-white">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {profile.firstName && profile.lastName 
                    ? `${profile.firstName} ${profile.lastName}`
                    : userData.displayName || 'Welcome, Guest'
                  }
                </h1>
                <p className="text-white/90 text-lg">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-heritage-light rounded-full"></div>
                  <span className="text-white/80 text-sm">Verified Member</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl backdrop-blur-sm ${
            message.includes('successfully') 
              ? 'bg-green-100/80 border border-green-200 text-green-800' 
              : 'bg-red-100/80 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.includes('successfully') ? 'bg-green-200' : 'bg-red-200'
              }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {message.includes('successfully') ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-gray-600">Manage your account details and preferences</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-heritage-green to-heritage-neutral text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                      >
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 inline mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                          !isEditing 
                            ? 'bg-gray-50/50 border-gray-200 text-gray-600' 
                            : 'bg-white border-heritage-green/30 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10'
                        }`}
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                        !isEditing 
                          ? 'bg-gray-50/50 border-gray-200 text-gray-600' 
                          : 'bg-white border-heritage-green/30 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10'
                      }`}
                      placeholder="Enter your last name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        disabled={true}
                        className="w-full px-4 py-4 rounded-xl border-2 bg-gray-50/50 border-gray-200 text-gray-600"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                        !isEditing 
                          ? 'bg-gray-50/50 border-gray-200 text-gray-600' 
                          : 'bg-white border-heritage-green/30 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                        !isEditing 
                          ? 'bg-gray-50/50 border-gray-200 text-gray-600' 
                          : 'bg-white border-heritage-green/30 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10'
                      }`}
                    />
                  </div>

                  {/* Nationality */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={profile.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                        !isEditing 
                          ? 'bg-gray-50/50 border-gray-200 text-gray-600' 
                          : 'bg-white border-heritage-green/30 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10'
                      }`}
                      placeholder="Enter your nationality"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Address
                    </label>
                    <textarea
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 resize-none ${
                        !isEditing 
                          ? 'bg-gray-50/50 border-gray-200 text-gray-600' 
                          : 'bg-white border-heritage-green/30 focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10'
                      }`}
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/bookings')}
                  className="w-full p-4 bg-gradient-to-r from-heritage-green/10 to-heritage-neutral/10 rounded-xl hover:from-heritage-green/20 hover:to-heritage-neutral/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-heritage-green/20 rounded-xl flex items-center justify-center group-hover:bg-heritage-green/30 transition-colors">
                      <svg className="w-6 h-6 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">My Bookings</div>
                      <div className="text-sm text-gray-600">View reservations</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/booking')}
                  className="w-full p-4 bg-gradient-to-r from-heritage-light/10 to-heritage-green/10 rounded-xl hover:from-heritage-light/20 hover:to-heritage-green/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-heritage-light/20 rounded-xl flex items-center justify-center group-hover:bg-heritage-light/30 transition-colors">
                      <svg className="w-6 h-6 text-heritage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">New Booking</div>
                      <div className="text-sm text-gray-600">Reserve a room</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl border border-green-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email Verified</div>
                      <div className="text-sm text-gray-600">Your email is confirmed</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="w-full p-4 bg-red-50/50 rounded-xl hover:bg-red-100/50 transition-all duration-300 group border border-red-200/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100/50 rounded-xl flex items-center justify-center group-hover:bg-red-200/50 transition-colors">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-red-700">Sign Out</div>
                      <div className="text-sm text-red-600">Logout securely</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
