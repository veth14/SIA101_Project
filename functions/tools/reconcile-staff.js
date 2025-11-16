/**
 * One-time reconciliation script to compute staff counts and write them to
 * stats/dashboard. Run locally with a service account or against the
 * Firebase Emulator (recommended if you don't want to enable billing).
 *
 * Usage (local with service account):
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
 *   node functions/tools/reconcile-staff.js
 *
 * Usage (emulator):
 *   Start the emulator and set FIRESTORE_EMULATOR_HOST, then run the script.
 */

const admin = require('firebase-admin');

async function main() {
  try {
    // Initialize admin app (will use GOOGLE_APPLICATION_CREDENTIALS or emulator env)
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    const db = admin.firestore();
    console.log('Counting staff documents...');

    // Use aggregation query if available (count documents without downloading payload)
    let totalStaff = 0;
    let activeStaff = 0;

    try {
      const totalSnap = await db.collection('staff').count().get();
      totalStaff = Number(totalSnap.data().count || 0);
    } catch (err) {
      // Fallback: iterate if count() isn't supported in environment
      console.warn('count() aggregation failed, falling back to get() iteration:', err.message || err);
      const all = await db.collection('staff').get();
      totalStaff = all.size;
      // Prefer isActive boolean when present; fallback to status === 'active'
      activeStaff = all.docs.filter(d => {
        const data = d.data();
        if (typeof data.isActive === 'boolean') return data.isActive === true;
        return data.status === 'active';
      }).length;
    }

    // If activeStaff isn't already computed, run a count for active staff
    if (!activeStaff) {
      try {
        // First try counting documents where isActive == true
        const activeByFlag = await db.collection('staff').where('isActive', '==', true).count().get();
        activeStaff = Number(activeByFlag.data().count || 0);
      } catch (err) {
        try {
          // Fallback to status === 'active'
          const activeSnap = await db.collection('staff').where('status', '==', 'active').count().get();
          activeStaff = Number(activeSnap.data().count || 0);
        } catch (err2) {
          const activeQ = await db.collection('staff').where('status', '==', 'active').get();
          activeStaff = activeQ.size;
        }
      }
    }

    console.log(`Total staff: ${totalStaff}, active staff: ${activeStaff}`);

    // Write to stats/dashboard
    const statsRef = db.doc('stats/dashboard');
    await statsRef.set({ totalStaff, activeStaff, migratedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

    console.log('Wrote staff counts to stats/dashboard');
    process.exit(0);
  } catch (err) {
    console.error('Failed to reconcile staff counts:', err);
    process.exit(1);
  }
}

main();
