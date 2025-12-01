import { useEffect, useMemo, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getTimeValue } from '@/lib/utils';
import loyaltyService, { GuestProfile } from '@/services/loyaltyService';

export interface GuestServicesStatsData {
  avgRating: number; // 0..5
  totalFeedback: number;
  responseRate: number; // 0..1
  activeLoyaltyMembers: number;
  loyaltyGrowthPct: number | null; // percentage change vs previous 30 days
  assistanceOpenCount: number;
  assistanceAvgResponseMins: number | null; // average minutes from submit to first update/completion
  loading: boolean;
}

export function useGuestServicesStats(): GuestServicesStatsData {
  const [loading, setLoading] = useState(true);

  // Feedback snapshot
  const [feedbackAgg, setFeedbackAgg] = useState({
    count: 0,
    ratingSum: 0,
    ratingCount: 0,
    responded: 0
  });

  useEffect(() => {
    const col = collection(db, 'guestReview');
    const qy = query(col, orderBy('submittedAt', 'desc'), limit(500));
    const unsub = onSnapshot(
      qy,
      (snap) => {
        let count = 0;
        let ratingSum = 0;
        let ratingCount = 0;
        let responded = 0;
        snap.forEach((docSnap) => {
          const d = docSnap.data() as Record<string, any>;
          const r = Number(d.rating ?? 0);
          if (Number.isFinite(r) && r > 0) {
            ratingSum += r;
            ratingCount += 1;
          }
          const status = (d.status as string) || 'new';
          if (status === 'responded') responded += 1;
          count += 1;
        });
        setFeedbackAgg({ count, ratingSum, ratingCount, responded });
      },
      (error) => {
        console.error('useGuestServicesStats: feedback snapshot failed', error);
        setFeedbackAgg({ count: 0, ratingSum: 0, ratingCount: 0, responded: 0 });
      }
    );
    return () => unsub();
  }, []);

  // Loyalty members one-off fetch
  const [loyaltyAgg, setLoyaltyAgg] = useState({
    active: 0,
    last30: 0,
    prev30: 0
  });

  useEffect(() => {
    (async () => {
      try {
        const rows = await loyaltyService.getGuests({ limitResults: 1000 });
        const items = (rows as GuestProfile[]) || [];
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        const last30Start = now - 30 * day;
        const prev30Start = now - 60 * day;

        let active = 0;
        let last30 = 0;
        let prev30 = 0;
        for (const g of items) {
          const status = (g.status as string) || '';
          if (status.toLowerCase() === 'active') active += 1;
          const createdMs = getTimeValue(g.createdAt);
          if (createdMs) {
            if (createdMs >= last30Start) last30 += 1;
            else if (createdMs >= prev30Start && createdMs < last30Start) prev30 += 1;
          }
        }
        setLoyaltyAgg({ active, last30, prev30 });
      } catch (e) {
        console.error('useGuestServicesStats: loyalty fetch failed', e);
        setLoyaltyAgg({ active: 0, last30: 0, prev30: 0 });
      }
    })().finally(() => setLoading(false));
  }, []);

  // Assistance one-off fetch from both sources
  const [assistAgg, setAssistAgg] = useState({
    open: 0,
    avgRespMin: null as number | null
  });

  useEffect(() => {
    (async () => {
      try {
        const [contactSnap, guestSnap] = await Promise.all([
          getDocs(query(collection(db, 'contactRequests'), orderBy('createdAt', 'desc'), limit(200))),
          getDocs(query(collection(db, 'guest_request'), orderBy('createdAt', 'desc'), limit(200))),
        ]);

        type Row = { created: number | null; updated: number | null; status: string };
        const rows: Row[] = [];

        contactSnap.forEach((docSnap) => {
          const d = docSnap.data() as Record<string, any>;
          const statusRaw = (d.status as string) || 'pending';
          let status = statusRaw;
          if (statusRaw === 'resolved') status = 'completed';
          const created = getTimeValue(d.submittedAt) || getTimeValue(d.createdAt);
          const updated = getTimeValue(d.updatedAt) || null;
          rows.push({ created: created ?? null, updated, status });
        });

        guestSnap.forEach((docSnap) => {
          const d = docSnap.data() as Record<string, any>;
          const status = (d.status as string) || 'pending';
          const created = getTimeValue(d.submittedAt) || getTimeValue(d.createdAt);
          const updated = getTimeValue(d.updatedAt) || null;
          rows.push({ created: created ?? null, updated, status });
        });

        let open = 0;
        const deltas: number[] = [];
        for (const r of rows) {
          if (r.status === 'pending' || r.status === 'in-progress') open += 1;
          if (r.created && r.updated && (r.status === 'in-progress' || r.status === 'completed')) {
            const mins = (r.updated - r.created) / (60 * 1000);
            if (Number.isFinite(mins) && mins >= 0) deltas.push(mins);
          }
        }
        const avgRespMin = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : null;
        setAssistAgg({ open, avgRespMin });
      } catch (e) {
        console.error('useGuestServicesStats: assistance fetch failed', e);
        setAssistAgg({ open: 0, avgRespMin: null });
      }
    })();
  }, []);

  const data: GuestServicesStatsData = useMemo(() => {
    const avgRating = feedbackAgg.ratingCount ? feedbackAgg.ratingSum / feedbackAgg.ratingCount : 0;
    const responseRate = feedbackAgg.count ? feedbackAgg.responded / feedbackAgg.count : 0;
    const { active, last30, prev30 } = loyaltyAgg;
    let loyaltyGrowthPct: number | null = null;
    if (prev30 === 0 && last30 > 0) loyaltyGrowthPct = 100;
    else if (prev30 > 0) loyaltyGrowthPct = ((last30 - prev30) / prev30) * 100;
    return {
      avgRating,
      totalFeedback: feedbackAgg.count,
      responseRate,
      activeLoyaltyMembers: active,
      loyaltyGrowthPct,
      assistanceOpenCount: assistAgg.open,
      assistanceAvgResponseMins: assistAgg.avgRespMin,
      loading
    };
  }, [feedbackAgg, loyaltyAgg, assistAgg, loading]);

  return data;
}
