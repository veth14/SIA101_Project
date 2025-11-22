import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../admin/Modal';
import loyaltyService, { GuestProfile } from '../../../services/loyaltyService';
import { useAuth } from '../../../hooks/useAuth';

type LoyaltyMember = {
  id: string;
  name: string;
  email: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  totalSpent: number;
  joinDate?: string;
  lastStay?: string | null;
  status: 'active' | 'inactive' | 'Active' | 'Inactive';
  phone?: string;
  rewardsClaimed?: string[];
};

export const LoyaltyProgram: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>([]);
  const { user } = useAuth();

  const loadGuests = useCallback(async () => {
    try {
      const guests = await loyaltyService.getGuests({ limitResults: 200 });
      const normalizeTimestamp = (v: unknown): string | undefined => {
        if (!v) return undefined;
        if (typeof v === 'object' && v !== null) {
          if ('toDate' in v && typeof (v as { toDate?: unknown }).toDate === 'function') {
            return (v as { toDate: () => Date }).toDate().toISOString();
          }
          return String(v);
        }
        return String(v);
      };
      const mapped = (guests as GuestProfile[]).map((g: GuestProfile) => ({
        id: g.id || '',
        name: g.fullName || '',
        email: g.email || '',
        tier: (g.membershipTier as LoyaltyMember['tier']) || 'Bronze',
        points: g.loyaltyPoints ?? loyaltyService.computePointsFromTotal(g.totalSpent ?? 0),
        totalSpent: g.totalSpent ?? 0,
        // createdAt and lastBookingDate can be Timestamp or string — normalize safely
        joinDate: normalizeTimestamp(g.createdAt),
        lastStay: normalizeTimestamp(g.lastBookingDate) || null,
        status: typeof g.status === 'string' ? g.status : 'Active',
        rewardsClaimed: []
      }));
      setLoyaltyMembers(mapped);
    } catch (err) {
      console.error('Failed to load guests', err);
    }
  }, []);

  useEffect(() => { loadGuests(); }, [loadGuests]);

  // Redeem modal state
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [redeemMember, setRedeemMember] = useState<LoyaltyMember | null>(null);

  const rewardsCatalog: { id: string; label: string; cost: number }[] = [
    { id: 'r1', label: 'Free welcome drink', cost: 300 },
    { id: 'r2', label: 'Free breakfast for 2', cost: 800 },
    { id: 'r3', label: '₱500 discount voucher', cost: 1500 },
    { id: 'r4', label: '10% room discount', cost: 3000 },
    { id: 'r5', label: 'Free 1 Night – Silid Payapa', cost: 6000 }
  ];

  const openRedeem = (m: LoyaltyMember) => {
    setRedeemMember(m);
    setIsRedeemOpen(true);
  };
  const closeRedeem = () => {
    setIsRedeemOpen(false);
    setRedeemMember(null);
  };

  

  const confirmRedeem = (memberId: string, rewardId: string) => {
    const reward = rewardsCatalog.find(r => r.id === rewardId);
    if (!reward) return;
    // call service to redeem (transactional)
    const by = user?.email || user?.uid || 'system';
    loyaltyService.redeemReward(memberId, reward.cost, reward.label, String(by))
      .then(() => {
        // optimistic update: reload or update local entry
        setLoyaltyMembers(prev => prev.map(m => m.id === memberId ? { ...m, points: Math.max(0, m.points - reward.cost), rewardsClaimed: [...(m.rewardsClaimed || []), reward.label] } : m));
        setRedeemMember(prev => prev ? { ...prev, points: Math.max(0, prev.points - reward.cost), rewardsClaimed: [...(prev.rewardsClaimed || []), reward.label] } : prev);
      })
      .catch((err: unknown) => {
        const msg = (typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message : String(err);
        alert('Redeem failed: ' + (msg || String(err)));
      });
    closeRedeem();
  };

  // modals and active member state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<LoyaltyMember | null>(null);
  const [formMember, setFormMember] = useState<Partial<LoyaltyMember> | null>(null);

  const openDetails = (m: LoyaltyMember) => {
    setActiveMember(m);
    setIsDetailsOpen(true);
  };
  const closeDetails = () => {
    setIsDetailsOpen(false);
    setActiveMember(null);
  };

  const openAdd = () => {
    setActiveMember(null);
    setFormMember({
      name: '',
      email: '',
      tier: 'Bronze',
      points: 0,
      totalSpent: 0,
      phone: '',
      joinDate: new Date().toISOString(),
      lastStay: null,
      status: 'active'
    });
    setIsAddOpen(true);
  };
  const openEdit = (m: LoyaltyMember) => {
    setActiveMember(m);
    setFormMember({ ...m });
    setIsAddOpen(true);
  };
  const closeAdd = () => {
    setIsAddOpen(false);
    setActiveMember(null);
    setFormMember(null);
  };

  const updateMemberStatus = (status: LoyaltyMember['status']) => {
    if (!activeMember) return;
    setLoyaltyMembers(prev => prev.map(m => m.id === activeMember.id ? { ...m, status } : m));
    setActiveMember(prev => prev ? { ...prev, status } : prev);
  };

  const saveMember = (member: Partial<LoyaltyMember>) => {
    (async () => {
      try {
        if (member.id) {
          await loyaltyService.updateGuest(member.id, {
            fullName: member.name,
            email: member.email,
              membershipTier: (member.tier as LoyaltyMember['tier']),
            totalSpent: member.totalSpent,
            status: member.status
            });
          await loadGuests();
        } else {
          await loyaltyService.createGuest({
            fullName: member.name,
            email: member.email,
            phone: member.phone ?? '',
            membershipTier: (member.tier as LoyaltyMember['tier']),
            // System-generated defaults for walk-in/new members
            totalSpent: 0,
            loyaltyPoints: 0,
            totalBookings: 0,
            lastBookingDate: null,
            status: member.status ?? 'Active'
          });
          await loadGuests();
        }
      } catch (err) {
        console.error('Save member failed', err);
        alert('Failed to save member');
      }
    })();
    closeAdd();
  };

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
    (selectedTier === 'all' || member.tier === selectedTier) &&
    (search.trim() === '' || member.name.toLowerCase().includes(search.toLowerCase()) || member.email.toLowerCase().includes(search.toLowerCase()))
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
        <button onClick={openAdd} className="bg-heritage-green text-white px-4 py-2 rounded-xl hover:bg-heritage-green/90 transition-colors font-medium flex items-center space-x-2">
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
                      <div className="text-xs text-gray-400">Member since {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '—'}</div>
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
                    <div className="text-sm text-gray-700">{member.lastStay ? new Date(member.lastStay).toLocaleDateString() : '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openDetails(member)} className="text-heritage-green hover:text-heritage-green/80 transition-colors" aria-label="View member details">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button onClick={() => openEdit(member)} className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="Edit member">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      <button onClick={() => openRedeem(member)} className="text-yellow-600 hover:text-yellow-800 transition-colors" aria-label="Redeem rewards">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14" />
                        </svg>
                      </button>
                      {user?.role === 'admin' && (
                        <button onClick={async () => {
                          const deltaStr = window.prompt('Adjust points (use negative to deduct). Enter integer:');
                          if (!deltaStr) return;
                          const delta = Number(deltaStr);
                          if (Number.isNaN(delta)) return alert('Invalid number');
                          const reason = window.prompt('Reason for adjustment:') || 'Adjustment by admin';
                          try {
                            await loyaltyService.adjustPoints(member.id, delta, reason, user?.email || user?.uid || 'admin');
                            await loadGuests();
                          } catch (err: unknown) {
                            const msg = (typeof err === 'object' && err !== null && 'message' in err) ? (err as { message?: string }).message : String(err);
                            alert('Adjust failed: ' + (msg || String(err)));
                          }
                        }} className="text-red-600 hover:text-red-800 transition-colors" aria-label="Adjust points">⚙️</button>
                      )}
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

      {/* Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={closeDetails} title="Member Details" size="md">
        {activeMember && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="text-sm text-gray-500">Name</div>
              <div className="text-lg font-semibold text-gray-900">{activeMember.name}</div>
            </div>

            <div className="border-b pb-3">
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-base text-gray-900">{activeMember.email}</div>
            </div>

            <div className="border-b pb-3">
              <div className="text-sm text-gray-500">Tier</div>
              <div className="text-base text-gray-900 inline-flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(activeMember.tier)}`}>
                  <span>{getTierIcon(activeMember.tier)}</span>
                  <span>{activeMember.tier}</span>
                </span>
              </div>
            </div>

            <div className="border-b pb-3">
              <div className="text-sm text-gray-500">Points</div>
              <div className="text-base text-gray-900">{activeMember.points.toLocaleString()}</div>
            </div>

            <div className="border-b pb-3">
              <div className="text-sm text-gray-500">Total Spent</div>
              <div className="text-base text-gray-900">₱{activeMember.totalSpent.toLocaleString()}</div>
            </div>

            <div className="border-b pb-3">
              <div className="text-sm text-gray-500">Join Date</div>
              <div className="text-base text-gray-900">{activeMember.joinDate ? new Date(activeMember.joinDate).toLocaleDateString() : '—'}</div>
            </div>

            <div className="border-b pb-3">
              <div className="text-sm text-gray-500">Last Stay</div>
              <div className="text-base text-gray-900">{activeMember.lastStay ? new Date(activeMember.lastStay).toLocaleDateString() : '—'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="mt-2">
                <select
                  value={activeMember.status}
                  onChange={(e) => updateMemberStatus(e.target.value as LoyaltyMember['status'])}
                  className="px-3 py-2 border border-gray-200 rounded-xl"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Modal */}
      <Modal isOpen={isAddOpen} onClose={closeAdd} title={activeMember ? 'Edit Member' : 'Add Member'} size="md">
        {formMember && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                value={formMember.name || ''}
                onChange={(e) => setFormMember(prev => ({ ...(prev || {}), name: e.target.value }))}
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                value={formMember.email || ''}
                onChange={(e) => setFormMember(prev => ({ ...(prev || {}), email: e.target.value }))}
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <input
                value={formMember.phone || ''}
                onChange={(e) => setFormMember(prev => ({ ...(prev || {}), phone: e.target.value }))}
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Tier</label>
                <select
                  value={formMember.tier || 'Bronze'}
                  onChange={(e) => setFormMember(prev => ({ ...(prev || {}), tier: e.target.value as LoyaltyMember['tier'] }))}
                  className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">Points</label>
                <input
                  type="number"
                  value={formMember.points ?? 0}
                  onChange={(e) => setFormMember(prev => ({ ...(prev || {}), points: Number(e.target.value) }))}
                  className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Total Spent</label>
              <input
                type="number"
                value={formMember.totalSpent ?? 0}
                onChange={(e) => setFormMember(prev => ({ ...(prev || {}), totalSpent: Number(e.target.value) }))}
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Last Stay</label>
                <input
                  type="date"
                  value={formMember.lastStay ? new Date(formMember.lastStay).toISOString().slice(0,10) : ''}
                  onChange={(e) => setFormMember(prev => ({ ...(prev || {}), lastStay: new Date(e.target.value).toISOString() }))}
                  className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Status</label>
                <select
                  value={formMember.status || 'active'}
                  onChange={(e) => setFormMember(prev => ({ ...(prev || {}), status: e.target.value as LoyaltyMember['status'] }))}
                  className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button onClick={closeAdd} className="px-4 py-2 rounded-xl border border-gray-200">Cancel</button>
              <button
                onClick={() => formMember && saveMember({ ...(formMember as Partial<LoyaltyMember>) })}
                className="px-4 py-2 rounded-xl bg-heritage-green text-white"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Redeem Modal */}
      <Modal isOpen={isRedeemOpen} onClose={closeRedeem} title="Redeem Rewards" size="sm">
        {redeemMember && (
          <div className="space-y-4">
            <div className="text-sm text-gray-500">Points balance</div>
            <div className="text-lg font-semibold">{redeemMember.points.toLocaleString()} pts</div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Available rewards</div>
              <div className="space-y-2">
                {rewardsCatalog.map(r => (
                  <div key={r.id} className={`flex items-center justify-between p-3 border rounded-xl ${redeemMember.points < r.cost ? 'opacity-50' : ''}`}>
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-xs text-gray-500">Cost: {r.cost} pts</div>
                    </div>
                    <div>
                      <button
                        disabled={redeemMember.points < r.cost}
                        onClick={() => confirmRedeem(redeemMember.id, r.id)}
                        className="px-3 py-1 rounded-xl bg-heritage-green text-white disabled:opacity-40"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
