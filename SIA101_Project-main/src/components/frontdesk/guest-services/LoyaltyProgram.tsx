import React, { useState } from 'react';

interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  totalSpent: number;
  joinDate: string;
  lastStay: string;
  status: 'active' | 'inactive';
}

export const LoyaltyProgram: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const loyaltyMembers: LoyaltyMember[] = [
    {
      id: '1',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      tier: 'Gold',
      points: 2850,
      totalSpent: 45000,
      joinDate: '2023-03-15',
      lastStay: '2024-01-10',
      status: 'active'
    },
    {
      id: '2',
      name: 'John Rodriguez',
      email: 'john.rodriguez@email.com',
      tier: 'Silver',
      points: 1200,
      totalSpent: 18500,
      joinDate: '2023-08-22',
      lastStay: '2024-01-05',
      status: 'active'
    },
    {
      id: '3',
      name: 'Lisa Chen',
      email: 'lisa.chen@email.com',
      tier: 'Platinum',
      points: 5200,
      totalSpent: 78000,
      joinDate: '2022-11-10',
      lastStay: '2024-01-12',
      status: 'active'
    },
    {
      id: '4',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@email.com',
      tier: 'Bronze',
      points: 450,
      totalSpent: 8500,
      joinDate: '2023-12-01',
      lastStay: '2024-01-08',
      status: 'active'
    }
  ];

  const getTierColor = (tier: string) => {
    const colors = {
      Bronze: 'bg-amber-100 text-amber-800 border-amber-200',
      Silver: 'bg-gray-100 text-gray-800 border-gray-200',
      Gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Platinum: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[tier as keyof typeof colors] || colors.Bronze;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return '🥉';
      case 'Silver':
        return '🥈';
      case 'Gold':
        return '🥇';
      case 'Platinum':
        return '💎';
      default:
        return '🏆';
    }
  };

  const filteredMembers = loyaltyMembers.filter(member => 
    selectedTier === 'all' || member.tier === selectedTier
  );

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search members, emails, or tiers..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white w-80"
            />
          </div>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Tiers</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
        <button className="bg-heritage-green text-white px-4 py-2 rounded-xl hover:bg-heritage-green/90 transition-colors font-medium flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Member</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Member Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tier</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Points Balance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Stay</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                      <div className="text-xs text-gray-400">Member since {new Date(member.joinDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(member.tier)} space-x-1`}>
                      <span>{getTierIcon(member.tier)}</span>
                      <span>{member.tier}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{member.points.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">₱{member.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">lifetime value</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{new Date(member.lastStay).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-heritage-green hover:text-heritage-green/80 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No loyalty members found for the selected tier.</p>
        </div>
      )}
    </div>
  );
};
