const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportAllCollections() {
  const collections = await db.listCollections();

  for (const collection of collections) {
    const snapshot = await collection.get();
    const data = [];

    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    fs.writeFileSync(
      `${collection.id}.json`,
      JSON.stringify(data, null, 2)
    );

    console.log(`✅ Exported: ${collection.id}`);
  }

  console.log("🎉 ALL FIRESTORE COLLECTIONS EXPORTED!");
}

exportAllCollections().catch(console.error);
