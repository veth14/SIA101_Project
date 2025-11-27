import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../hooks/useAuth';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Calendar, Mail, FileText, Search, ChevronRight, Package, XCircle, Trash2 } from 'lucide-react';
export const MyRequestsPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRequest, setExpandedRequest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 5;
    const [cancellingId, setCancellingId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    useEffect(() => {
        const fetchRequests = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                console.log('🔍 Fetching requests for user:', user.uid);
                const requestsRef = collection(db, 'contactRequests');
                const q = query(requestsRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedRequests = [];
                console.log('📦 Found', querySnapshot.size, 'requests in Firebase');
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log('📄 Request document:', doc.id, data);
                    // Convert Firestore Timestamp to ISO string for consistent handling
                    const submittedAtValue = data.submittedAt?.toDate?.()
                        ? data.submittedAt.toDate().toISOString()
                        : data.submittedAt || new Date().toISOString();
                    fetchedRequests.push({
                        id: doc.id,
                        referenceNumber: data.referenceNumber,
                        inquiryType: data.inquiryType,
                        subject: data.subject,
                        message: data.message,
                        status: data.status,
                        submittedAt: submittedAtValue,
                        bookingReference: data.bookingReference,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone
                    });
                });
                console.log('✅ Loaded', fetchedRequests.length, 'requests');
                setRequests(fetchedRequests);
            }
            catch (error) {
                console.error('❌ Error fetching requests:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user]);
    const handleCancelRequest = async (request) => {
        setRequestToCancel(request);
        setShowCancelModal(true);
    };
    const confirmCancelRequest = async () => {
        if (!requestToCancel)
            return;
        setCancellingId(requestToCancel.id);
        try {
            const requestRef = doc(db, 'contactRequests', requestToCancel.id);
            await updateDoc(requestRef, {
                status: 'cancelled',
                cancelledAt: new Date().toISOString(),
                cancelledBy: user?.uid
            });
            // Update local state
            setRequests(prev => prev.map(req => req.id === requestToCancel.id
                ? { ...req, status: 'cancelled' }
                : req));
            setShowCancelModal(false);
            setRequestToCancel(null);
        }
        catch (error) {
            console.error('Error cancelling request:', error);
            alert('Failed to cancel request. Please try again.');
        }
        finally {
            setCancellingId(null);
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return _jsx(Clock, { className: "w-5 h-5 text-amber-500" });
            case 'in-progress':
                return _jsx(AlertCircle, { className: "w-5 h-5 text-blue-500" });
            case 'resolved':
                return _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" });
            case 'cancelled':
                return _jsx(XCircle, { className: "w-5 h-5 text-red-500" });
            default:
                return _jsx(Clock, { className: "w-5 h-5 text-gray-500" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'resolved':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };
    const filteredRequests = requests
        .filter(req => filter === 'all' || req.status === filter)
        .filter(req => searchQuery === '' ||
        req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.message.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
        // Sort by submittedAt in descending order (newest first)
        const dateA = new Date(a.submittedAt).getTime();
        const dateB = new Date(b.submittedAt).getTime();
        return dateB - dateA;
    });
    // Pagination calculations
    const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
    // Reset to page 1 when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery]);
    if (!user) {
        return (_jsx("div", { className: "min-h-screen py-20 bg-gradient-to-br from-heritage-light via-white to-heritage-green/5", children: _jsx("div", { className: "container px-4 mx-auto", children: _jsxs("div", { className: "max-w-2xl p-12 mx-auto text-center bg-white shadow-xl rounded-3xl", children: [_jsx(MessageSquare, { className: "w-16 h-16 mx-auto mb-4 text-heritage-green" }), _jsx("h2", { className: "mb-4 text-2xl font-bold text-gray-800", children: "Sign In Required" }), _jsx("p", { className: "text-gray-600", children: "Please sign in to view your contact requests." })] }) }) }));
    }
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-20 sm:pt-24", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-heritage-green/10 to-emerald-500/10 blur-3xl animate-pulse" }), _jsx("div", { className: "absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl animate-pulse", style: { animationDelay: '2s' } }), _jsx("div", { className: "absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-2xl animate-pulse", style: { animationDelay: '4s' } })] }), _jsx("div", { className: "relative z-10 py-8 sm:py-12", children: _jsxs("div", { className: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8 sm:mb-10 md:mb-12 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-heritage-green to-emerald-600 rounded-2xl hover:scale-110", children: _jsx(MessageSquare, { className: "w-8 h-8 sm:w-10 sm:h-10 text-white" }) }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsx("h1", { className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-transparent bg-gradient-to-r from-slate-900 via-heritage-green to-emerald-600 bg-clip-text px-4", children: "My Requests" }), _jsxs("p", { className: "max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 px-4", children: ["Track and manage your support requests at ", _jsx("span", { className: "font-semibold text-heritage-green", children: "Balay Ginhawa" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 mt-6 sm:mt-8 px-4", children: [_jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Live Sync" })] }), _jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0", style: { animationDelay: '1s' } }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Real-time Updates" })] }), _jsxs("div", { className: "flex items-center px-3 sm:px-4 py-2 space-x-2 border rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-white/20", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-heritage-green flex-shrink-0" }), _jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Secure" })] })] })] }), _jsx("div", { className: "p-4 sm:p-6 mb-6 bg-white shadow-xl rounded-2xl sm:rounded-3xl", children: _jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "relative w-full md:flex-1 md:max-w-md", children: [_jsx(Search, { className: "absolute w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transform -translate-y-1/2 left-3 sm:left-4 top-1/2" }), _jsx("input", { type: "text", placeholder: "Search requests...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-sm sm:text-base transition-all duration-300 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10" })] }), _jsxs("div", { className: "grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3", children: [_jsx("button", { onClick: () => setFilter('all'), className: `px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-200 ${filter === 'all'
                                                    ? 'bg-heritage-green text-white'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`, children: "All" }), _jsx("button", { onClick: () => setFilter('pending'), className: `px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-200 ${filter === 'pending'
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-white text-orange-600 border border-gray-300 hover:bg-orange-50'}`, children: "Pending" }), _jsx("button", { onClick: () => setFilter('in-progress'), className: `px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-200 ${filter === 'in-progress'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-blue-600 border border-gray-300 hover:bg-blue-50'}`, children: "In Progress" }), _jsx("button", { onClick: () => setFilter('resolved'), className: `px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-200 ${filter === 'resolved'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white text-green-600 border border-gray-300 hover:bg-green-50'}`, children: "Resolved" }), _jsx("button", { onClick: () => setFilter('cancelled'), className: `px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-200 ${filter === 'cancelled'
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-white text-red-600 border border-gray-300 hover:bg-red-50'}`, children: "Cancelled" })] })] }) }), loading ? (_jsxs("div", { className: "p-12 text-center bg-white shadow-xl rounded-3xl", children: [_jsx(Clock, { className: "w-12 h-12 mx-auto mb-4 text-heritage-green animate-spin" }), _jsx("p", { className: "text-gray-600", children: "Loading your requests..." })] })) : filteredRequests.length === 0 ? (
                        /* Empty State */
                        _jsxs("div", { className: "p-16 text-center bg-white shadow-xl rounded-3xl", children: [_jsxs("div", { className: "relative inline-block mb-6", children: [_jsx("div", { className: "absolute inset-0 bg-gray-200 rounded-full opacity-50 blur-2xl" }), _jsx("div", { className: "relative p-6 bg-gray-100 rounded-full", children: _jsx(Package, { className: "w-16 h-16 text-gray-400" }) })] }), _jsx("h3", { className: "mb-3 text-2xl font-black text-gray-800", children: "No Requests Found" }), _jsx("p", { className: "max-w-md mx-auto mb-6 text-gray-600", children: searchQuery
                                        ? `No requests match "${searchQuery}". Try a different search term.`
                                        : filter === 'all'
                                            ? "You haven't submitted any requests yet. Contact us through the Help Center to get started."
                                            : `You don't have any ${filter.replace('-', ' ')} requests at the moment.` }), searchQuery && (_jsx("button", { onClick: () => setSearchQuery(''), className: "px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-heritage-green to-heritage-neutral rounded-2xl hover:shadow-xl hover:scale-105", children: "Clear Search" }))] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-6 space-y-4 sm:space-y-5", children: currentRequests.map((request) => (_jsxs("div", { className: "overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl sm:rounded-3xl hover:shadow-2xl", children: [_jsxs("div", { className: "p-4 sm:p-6 pb-3 sm:pb-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4", children: [_jsxs("div", { className: "flex items-start flex-1 gap-2 sm:gap-4 min-w-0", children: [_jsx("div", { className: `p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 ${request.status === 'pending' ? 'bg-gradient-to-br from-amber-100 to-amber-50' :
                                                                            request.status === 'in-progress' ? 'bg-gradient-to-br from-blue-100 to-blue-50' :
                                                                                'bg-gradient-to-br from-green-100 to-green-50'}`, children: getStatusIcon(request.status) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:gap-3 mb-2", children: [_jsx("h3", { className: "text-base sm:text-lg md:text-xl font-black text-gray-800 break-words", children: request.subject }), _jsx("span", { className: `px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs font-bold rounded-full whitespace-nowrap ${getStatusColor(request.status)}`, children: request.status.replace('-', ' ').toUpperCase() })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-xs sm:text-sm", children: [_jsxs("span", { className: "flex items-center gap-1 sm:gap-1.5 font-semibold text-heritage-green", children: [_jsx(FileText, { className: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" }), _jsx("span", { className: "truncate", children: request.referenceNumber })] }), _jsxs("span", { className: "flex items-center gap-1 sm:gap-1.5 text-gray-600", children: [_jsx(Calendar, { className: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" }), _jsx("span", { className: "truncate", children: new Date(request.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })] }), _jsx("span", { className: "px-2 sm:px-3 py-1 text-xs font-semibold capitalize rounded-full bg-heritage-green/10 text-heritage-green whitespace-nowrap", children: request.inquiryType.replace('_', ' ') })] }), request.bookingReference && (_jsxs("div", { className: "inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 mb-2 sm:mb-3 text-xs sm:text-sm font-semibold border-2 rounded-xl sm:rounded-2xl bg-amber-50 border-amber-200 text-amber-800", children: [_jsx(AlertCircle, { className: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" }), "Booking: ", request.bookingReference] }))] })] }), _jsx("button", { onClick: () => setExpandedRequest(expandedRequest === request.id ? null : request.id), className: "p-1.5 sm:p-2 transition-all duration-300 rounded-xl sm:rounded-2xl hover:bg-gray-100 flex-shrink-0", children: _jsx(ChevronRight, { className: `w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-300 ${expandedRequest === request.id ? 'rotate-90' : ''}` }) })] }), _jsx("p", { className: `text-sm sm:text-base text-gray-600 leading-relaxed ${expandedRequest === request.id ? '' : 'line-clamp-2'}`, children: request.message })] }), expandedRequest === request.id && (_jsxs("div", { className: "px-6 pb-6 space-y-4 border-t-2 border-gray-100 animate-fadeIn", children: [_jsxs("div", { className: "grid gap-4 pt-4 md:grid-cols-2", children: [_jsxs("div", { className: "p-4 border-2 rounded-2xl bg-gradient-to-br from-heritage-green/5 to-heritage-light/10 border-heritage-green/20", children: [_jsxs("h4", { className: "flex items-center gap-2 mb-3 text-sm font-black text-gray-700", children: [_jsx(Mail, { className: "w-4 h-4 text-heritage-green" }), "Contact Information"] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-gray-600", children: "Name:" }), _jsxs("span", { className: "text-gray-800", children: [request.firstName, " ", request.lastName] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-gray-600", children: "Email:" }), _jsx("span", { className: "text-gray-800", children: request.email })] }), request.phone && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-gray-600", children: "Phone:" }), _jsx("span", { className: "text-gray-800", children: request.phone })] }))] })] }), _jsxs("div", { className: "p-4 border-2 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-gray-200", children: [_jsxs("h4", { className: "flex items-center gap-2 mb-3 text-sm font-black text-gray-700", children: [_jsx(FileText, { className: "w-4 h-4 text-gray-600" }), "Request Details"] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-gray-600", children: "Type:" }), _jsx("span", { className: "text-gray-800 capitalize", children: request.inquiryType.replace('_', ' ') })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-gray-600", children: "Status:" }), _jsx("span", { className: `px-2 py-0.5 text-xs font-bold rounded-full ${getStatusColor(request.status)}`, children: request.status.replace('-', ' ').toUpperCase() })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-gray-600", children: "Submitted:" }), _jsx("span", { className: "text-gray-800", children: new Date(request.submittedAt).toLocaleString() })] })] })] })] }), _jsxs("div", { className: "p-4 border-2 rounded-2xl bg-gray-50 border-gray-200", children: [_jsx("h4", { className: "mb-2 text-sm font-black text-gray-700", children: "Full Message" }), _jsx("p", { className: "text-sm leading-relaxed text-gray-700 whitespace-pre-wrap", children: request.message })] }), request.status === 'pending' && (_jsxs("div", { className: "pt-4 border-t-2 border-gray-100", children: [_jsx("button", { onClick: () => handleCancelRequest(request), disabled: cancellingId === request.id, className: "flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-white transition-all duration-300 bg-red-600 rounded-2xl hover:bg-red-700 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed", children: cancellingId === request.id ? (_jsxs(_Fragment, { children: [_jsx(Clock, { className: "w-5 h-5 animate-spin" }), "Cancelling..."] })) : (_jsxs(_Fragment, { children: [_jsx(Trash2, { className: "w-5 h-5" }), "Cancel This Request"] })) }), _jsx("p", { className: "mt-2 text-xs text-center text-gray-500", children: "You can only cancel pending requests. Once in progress or resolved, cancellation is not available." })] }))] }))] }, request.id))) }), totalPages > 1 && (_jsxs("div", { className: "flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white shadow-xl sm:flex-row sm:justify-between rounded-2xl sm:rounded-3xl", children: [_jsxs("div", { className: "text-xs sm:text-sm text-gray-600 text-center sm:text-left", children: ["Showing ", _jsx("span", { className: "font-bold text-heritage-green", children: indexOfFirstRequest + 1 }), " to", ' ', _jsx("span", { className: "font-bold text-heritage-green", children: Math.min(indexOfLastRequest, filteredRequests.length) }), ' ', "of ", _jsx("span", { className: "font-bold text-heritage-green", children: filteredRequests.length }), " requests"] }), _jsxs("div", { className: "flex items-center gap-1 sm:gap-2", children: [_jsxs("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: `px-3 sm:px-4 py-2 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl transition-all duration-300 ${currentPage === 1
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-heritage-green text-white hover:shadow-lg active:scale-95 sm:hover:scale-105'}`, children: [_jsx("span", { className: "hidden sm:inline", children: "Previous" }), _jsx("span", { className: "sm:hidden", children: "Prev" })] }), _jsx("div", { className: "flex gap-1 sm:gap-2", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl transition-all duration-300 ${currentPage === page
                                                            ? 'bg-gradient-to-r from-heritage-green to-heritage-neutral text-white shadow-lg scale-105 sm:scale-110'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: page }, page))) }), _jsx("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: `px-3 sm:px-4 py-2 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl transition-all duration-300 ${currentPage === totalPages
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-heritage-green text-white hover:shadow-lg active:scale-95 sm:hover:scale-105'}`, children: "Next" })] })] }))] }))] }) }), showCancelModal && requestToCancel && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "w-full max-w-md p-6 bg-white shadow-2xl rounded-3xl animate-slideUp", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-red-100 rounded-2xl", children: _jsx(AlertCircle, { className: "w-6 h-6 text-red-600" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Cancel Request?" })] }), _jsxs("div", { className: "mb-6 space-y-3", children: [_jsx("p", { className: "text-gray-700", children: "Are you sure you want to cancel this request?" }), _jsxs("div", { className: "p-4 border-2 rounded-2xl bg-gray-50 border-gray-200", children: [_jsx("p", { className: "mb-1 text-xs font-semibold text-gray-500", children: "Reference Number" }), _jsx("p", { className: "mb-2 text-sm font-bold text-heritage-green", children: requestToCancel.referenceNumber }), _jsx("p", { className: "mb-1 text-xs font-semibold text-gray-500", children: "Subject" }), _jsx("p", { className: "text-sm text-gray-800", children: requestToCancel.subject })] }), _jsx("div", { className: "p-3 border-l-4 rounded-r-2xl bg-amber-50 border-amber-500", children: _jsx("p", { className: "text-sm font-semibold text-amber-800", children: "\u26A0\uFE0F This action cannot be undone. You'll need to submit a new request if needed." }) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => {
                                        setShowCancelModal(false);
                                        setRequestToCancel(null);
                                    }, className: "flex-1 px-6 py-3 font-bold text-gray-700 transition-all duration-300 bg-gray-100 rounded-2xl hover:bg-gray-200", children: "Keep Request" }), _jsx("button", { onClick: confirmCancelRequest, disabled: cancellingId !== null, className: "flex items-center justify-center flex-1 gap-2 px-6 py-3 font-bold text-white transition-all duration-300 bg-red-600 rounded-2xl hover:bg-red-700 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed", children: cancellingId ? (_jsxs(_Fragment, { children: [_jsx(Clock, { className: "w-5 h-5 animate-spin" }), "Cancelling..."] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "w-5 h-5" }), "Yes, Cancel"] })) })] })] }) }))] }));
};
