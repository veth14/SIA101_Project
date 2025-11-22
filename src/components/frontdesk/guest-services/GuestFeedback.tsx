import React, { useState, useEffect } from 'react';
import Modal from '../../admin/Modal';
import { db } from '../../../config/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';

interface FeedbackItem {
  id: string;
  guestName: string;
  roomNumber: string;
  rating: number;
  category: 'service' | 'cleanliness' | 'amenities' | 'food' | 'general';
  feedback: string;
  date: string;
  status: 'new' | 'reviewed' | 'responded';
  response?: string;
  respondedBy?: string;
  responseDate?: string;
}

export const GuestFeedback: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // feedbackData is loaded from Firestore `guestReview` collection
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    // listen for guest reviews in real-time, newest first
    const q = query(collection(db, 'guestReview'), orderBy('submittedAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: FeedbackItem[] = snapshot.docs.map(docSnap => {
        const d = docSnap.data() as any;
        return {
          id: docSnap.id,
          guestName: d.guestName || d.guestEmail || 'Guest',
          roomNumber: d.roomName || d.roomType || '',
          rating: d.rating || 0,
          category: (d.category || d.title || 'general').toString().toLowerCase() as FeedbackItem['category'],
          feedback: d.review || '',
          date: d.submittedAt && d.submittedAt.toDate ? d.submittedAt.toDate().toISOString() : (d.stayDate || new Date().toISOString()),
          status: d.status || 'new',
          response: d.response || '',
          respondedBy: d.respondedBy || '',
          responseDate: d.responseDate || ''
        };
      });
      setFeedbackData(items);
    }, (err) => {
      console.error('guestReview onSnapshot error', err);
    });

    return () => unsub();
  }, []);
  

  const getCategoryColor = (category: string) => {
    const colors = {
      service: 'bg-blue-100 text-blue-800 border-blue-200',
      cleanliness: 'bg-green-100 text-green-800 border-green-200',
      amenities: 'bg-purple-100 text-purple-800 border-purple-200',
      food: 'bg-orange-100 text-orange-800 border-orange-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-red-100 text-red-800 border-red-200',
      reviewed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      responded: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const filteredFeedback = feedbackData.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // details modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeFeedback, setActiveFeedback] = useState<FeedbackItem | null>(null);

  const openModal = (item: FeedbackItem) => {
    setActiveFeedback(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveFeedback(null);
  };

  // respond modal state
  const [isRespondOpen, setIsRespondOpen] = useState<boolean>(false);
  const [respondTarget, setRespondTarget] = useState<FeedbackItem | null>(null);
  const [responseDraft, setResponseDraft] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateCategory, setTemplateCategory] = useState<string>('all');

  const categoryTemplates: Record<string, Array<{ key: string; label: string; text: string }>> = {
    service: [
      { key: 'service_apology', label: 'Apology', text: "We're truly sorry your experience with our service fell short. We will investigate what happened during your stay and retrain our team where needed to ensure this doesn't happen again." },
      { key: 'service_thanks', label: 'Positive', text: "Thank you for highlighting our team's service. We're glad they made your stay comfortable — we'll share your kind words with the staff." }
    ],
    cleanliness: [
      { key: 'clean_apology', label: 'Apology', text: "We apologize the room did not meet our cleanliness standards. We have shared this with housekeeping and will follow up to prevent future occurrences." },
      { key: 'clean_thanks', label: 'Positive', text: "Thank you for noting the cleanliness. We're pleased the room met your expectations and will pass your feedback to our housekeeping team." }
    ],
    amenities: [
      { key: 'amenities_apology', label: 'Apology', text: "We're sorry one of our amenities didn't meet your expectations. Please let us know which facility so we can address and improve it promptly." },
      { key: 'amenities_thanks', label: 'Positive', text: "Thank you for your kind words about our amenities. We're delighted you enjoyed them and will share your feedback with the relevant teams." }
    ],
    food: [
      { key: 'food_apology', label: 'Apology', text: "We apologize that the dining options didn't meet your needs. We'll review our menu and work with the kitchen to expand choices, including more vegetarian options." },
      { key: 'food_thanks', label: 'Positive', text: "Thank you for your positive feedback about our food. We're happy you enjoyed the dining experience and will let the kitchen staff know." }
    ],
    general: [
      { key: 'general_apology', label: 'Apology', text: "We're sorry to hear about your experience. Your feedback is important — we'll investigate and take the necessary steps to improve." },
      { key: 'general_thanks', label: 'Positive', text: "Thank you for your feedback. We're glad you had a positive stay and appreciate you taking the time to let us know." }
    ]
  };

  const openRespondModal = (item: FeedbackItem) => {
    setRespondTarget(item);
    setResponseDraft('');
    setSelectedTemplate('');
    setTemplateCategory(item.category || 'all');
    setIsRespondOpen(true);
  };

  const closeRespondModal = () => {
    setIsRespondOpen(false);
    setRespondTarget(null);
    setResponseDraft('');
    setSelectedTemplate('');
  };

  const submitResponse = () => {
    if (!respondTarget) return;
    const timestamp = new Date().toISOString();
    const adminUser = 'Admin User';

    // update Firestore document for this review
    const reviewRef = doc(db, 'guestReview', respondTarget.id);
    updateDoc(reviewRef, {
      status: 'responded',
      response: responseDraft || respondTarget.response || '',
      respondedBy: adminUser,
      responseDate: timestamp
    }).then(() => {
      closeRespondModal();
    }).catch(err => {
      console.error('Failed to send response:', err);
    });
  };

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
              placeholder="Search feedback, guest names, or rooms..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white w-80"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Categories</option>
            <option value="service">Service</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="amenities">Amenities</option>
            <option value="food">Food & Dining</option>
            <option value="general">General</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-green/20 focus:border-heritage-green bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFeedback.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{item.guestName}</div>
                      <div className="text-sm text-gray-500">Room {item.roomNumber}</div>
                      <div className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                      <span className="ml-2 text-sm font-medium text-gray-600">{item.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-700 truncate">{item.feedback}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-heritage-green hover:text-heritage-green/80 transition-colors"
                        aria-label="View feedback details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {(item.status === 'new' || item.status === 'reviewed') && (
                        <button
                          onClick={() => openRespondModal(item)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label="Respond to guest"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Details Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Feedback Details" size="md">
        {activeFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                <div>
                  <div className="text-base font-semibold text-gray-700">Guest</div>
                  <div className="text-sm font-medium text-gray-900">{activeFeedback.guestName}</div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-700">Room</div>
                  <div className="text-sm font-medium text-gray-900">{activeFeedback.roomNumber}</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <div className="text-base font-semibold text-gray-700">Rating</div>
                  <div className="flex items-center space-x-2"><div>{renderStars(activeFeedback.rating)}</div><div className="text-sm text-gray-700">{activeFeedback.rating}/5</div></div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-700">Category</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(activeFeedback.category)}`}>
                    {activeFeedback.category.charAt(0).toUpperCase() + activeFeedback.category.slice(1)}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <div className="text-base font-semibold text-gray-700">Feedback</div>
                <p className="text-sm text-gray-700">{activeFeedback.feedback}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3 items-start">
                <div>
                  <div className="text-base font-semibold text-gray-700">Status</div>
                  <div>
                    {activeFeedback.status === 'responded' ? (
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">Responded</div>
                    ) : (
                      <select
                        value={activeFeedback.status}
                        onChange={async (e) => {
                          if (!activeFeedback) return;
                          const newStatus = e.target.value as FeedbackItem['status'];
                          const prevStatus = activeFeedback.status;

                          // optimistic local update
                          setFeedbackData(prev => prev.map(it => it.id === activeFeedback.id ? { ...it, status: newStatus } : it));
                          setActiveFeedback(prev => prev ? { ...prev, status: newStatus } : prev);

                          try {
                            const reviewRef = doc(db, 'guestReview', activeFeedback.id);
                            await updateDoc(reviewRef, { status: newStatus });
                          } catch (err) {
                            console.error('Failed to update status:', err);
                            // revert on failure
                            setFeedbackData(prev => prev.map(it => it.id === activeFeedback.id ? { ...it, status: prevStatus } : it));
                            setActiveFeedback(prev => prev ? { ...prev, status: prevStatus } : prev);
                          }
                        }}
                        className="mt-1 px-2 py-1 rounded-xl border text-sm"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                      </select>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-700">Date</div>
                  <div className="text-sm font-medium text-gray-700">{new Date(activeFeedback.date).toLocaleDateString()}</div>
                </div>
              </div>

              {activeFeedback.response && (
                <div className="border-b border-gray-100 pb-3">
                  <div className="text-base font-semibold text-gray-700">Response</div>
                  <p className="text-sm text-gray-700">{activeFeedback.response}</p>
                </div>
              )}

              {activeFeedback.respondedBy && (
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <div className="text-base font-semibold text-gray-700">Responded By</div>
                    <div className="text-sm font-medium text-gray-700">{activeFeedback.respondedBy}</div>
                  </div>
                  {activeFeedback.responseDate && (
                    <div>
                      <div className="text-base font-semibold text-gray-700">Response Date</div>
                      <div className="text-sm font-medium text-gray-700">{new Date(activeFeedback.responseDate).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button onClick={closeModal} className="px-4 py-2 bg-heritage-green text-white rounded-xl hover:bg-heritage-green/90">Close</button>
              </div>
            </div>
        )}
      </Modal>

      {/* Respond Modal */}
      <Modal isOpen={isRespondOpen} onClose={closeRespondModal} title={`Respond to ${respondTarget?.guestName ?? 'Guest'}`} size="md">
        {respondTarget && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Templates:</label>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  className="px-2 py-1 border rounded-xl text-sm"
                >
                  <option value="all">All</option>
                  <option value="service">Service</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="amenities">Amenities</option>
                  <option value="food">Food</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                {(() => {
                  const cat = templateCategory === 'all' ? 'all' : templateCategory;
                  if (cat === 'all') {
                    return Object.keys(categoryTemplates).flatMap((c) =>
                      categoryTemplates[c].map(t => (
                        <button
                          key={`${c}-${t.key}`}
                          onClick={() => { setSelectedTemplate(t.key); setResponseDraft(t.text); }}
                          className={`m-1 px-3 py-1 rounded-md text-sm border ${selectedTemplate === t.key ? 'bg-heritage-green/10 border-heritage-green text-heritage-green' : 'bg-white'}`}
                        >
                          {`${c.charAt(0).toUpperCase() + c.slice(1)}: ${t.label}`}
                        </button>
                      ))
                    );
                  }
                  const list = categoryTemplates[cat] || categoryTemplates['general'];
                  return list.map(t => (
                    <button
                      key={t.key}
                      onClick={() => { setSelectedTemplate(t.key); setResponseDraft(t.text); }}
                      className={`m-1 px-3 py-1 rounded-md text-sm border ${selectedTemplate === t.key ? 'bg-heritage-green/10 border-heritage-green text-heritage-green' : 'bg-white'}`}
                    >
                      {t.label}
                    </button>
                  ));
                })()}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Message</div>
              <textarea
                value={responseDraft}
                onChange={(e) => setResponseDraft(e.target.value)}
                rows={5}
                className="mt-1 w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-heritage-green/20"
              />
            </div>

            

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={closeRespondModal} className="px-4 py-2 rounded-xl border text-sm">Cancel</button>
              <button onClick={submitResponse} className="px-4 py-2 bg-heritage-green text-white rounded-xl text-sm">Send Response</button>
            </div>
          </div>
        )}
      </Modal>

      {filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No feedback found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};
