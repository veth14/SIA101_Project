const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function exportAuthUsers() {
  const users = [];
  let nextPageToken;

  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    result.users.forEach(user => {
      users.push({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        disabled: user.disabled,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        providerData: user.providerData
      });
    });

    nextPageToken = result.pageToken;
  } while (nextPageToken);

  fs.writeFileSync("firebase-auth-users.json", JSON.stringify(users, null, 2));
  console.log(" Firebase Authentication users exported successfully!");
}

exportAuthUsers().catch(console.error);
