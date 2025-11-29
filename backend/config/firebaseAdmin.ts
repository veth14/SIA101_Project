import admin from "firebase-admin";

// --- CREDENTIALS FOR HOTEL-MANAGEMENT-D5827 ---
const serviceAccount = {
  projectId: "hotel-management-d5827",
  clientEmail: "firebase-adminsdk-fbsvc@hotel-management-d5827.iam.gserviceaccount.com",
  // Key pasted exactly as provided
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmUOGTBjLWyUxJ\nvktlBtfgtqen008zYLkXiXLS18zc7/sKWnsw9uHqBbZhHxyHJGx71eYmUUyoSLTh\n4OB41DwCbYf53adsyF/u1lSrzKAcZc399jQddiwW7FIB1diwGXfd9RmASI2O2OnC\n6eQBGuHiwtpsn6r/XytMi+qeVDNZHk+70VnpvYkwqWwDP081WS6TCMAANkfF2ckh\nvExgzp/hYChEE2tyYevSRzQ6DOfF4+/ujIhY2oxfH/zGdrhB3PEYrFnI5mW2WOjs\nqVUaAmQF5Zx7bD+DN5VUhvlrufv4aJxz8DG9xXX2lPTPkxhToztN4AEiB2xlJ2w7\nFHWe2helAgMBAAECggEANgNmfv0wXZkacYifq7vBOHWZlWOHAUSUWBSHefojyk0V\n1pL0Fz7Wt84LIRediDZIFR+ukxssLisOs5z4ycUDiDZSRs+5pBafMU3iSbk29oIJ\nmETxP/A0+WzeZUIyEV70Et2a3pKxhobjxC15ovI8Egz+KvDf8/fQdBespqbp1jL/\n4qpINxHtNW1vjum3uNZUBI2lA9F4K5EtnI+sw1h37TeoryXYLKq+t74JIzKyNbJK\nNSXupTcWoIJslNf5ERMDY1QM5E72Rbjt49BoQkruZdkxKJgYw8qZYVJIjHAQ0IyW\nAux4vGO58dzPGgVQQ36UAKo3OmTa+fL1KKQy/8rIsQKBgQDPqCZhHrGShe1H9bJA\nrT6zsXMqbRW3zDlXm9Tc5vfnUdeuG1gDjiZeBbTMQ2hJYchzoI69m7yEswYpJdyG\nNfk1emVTTwz4r57NM/tXdbLW3HD0O+2zczxzmSYfuKkowXza2JbHIvQA1eP9gD1C\nvyvzNNPoY8BToZxwblLGelao3wKBgQDNCOm47ul25CXgpRYLwjJ6LEf2QsBjXQ51\nsBUHbE3/XDQRMdfAYtOLdbjWH5Z1ArljSyawYk99gGc5fNlXtHhwcLkL3DDDz42P\n2mDFdqm0H2fGfQ/HVjsnXKa7yibYTpMnFFG5BAguGKvzbU25YIUMKQqnlAj392Iy\nK52a400b+wKBgAbhABx5gtJiw2B94CDKXGhheXovUOfcyQ2A6QVEVXQBPw7ScxDz\nFYxJzhpyJTNBHP3PlMrtLMqMj6ivS2Xaxd2ip1aiKMDYOH99uFbGXF1HwiolDhPC\nvn7p1Nx6JohmGHe7cws3ujOI4luUcvMSGCefWWG6ZDWhBeinjvBqPxKrAoGAHJXe\niAL/F61NPpmljjQf93qO+d1qly/VIUFQXT2TTkPbmn4Zd2AP4ESkZW33+w5LLHXA\nyhyauoOZYKFwZ9Loa7y7f9TOE66vLNwkW8Nke5FZVYoAFimGi8FWGZ5gdg3WZD9n\n+WR/g3W7G3AkwvCa/AwIyT5RVcjurtH34i1IhdsCgYEAlBjKP/cKuUxe93DP4jc/\naUpXf2FkEgba+HHBu/oz/b74JCKr3U7+WapLYph3OQaT57hD+R4R90wDG8I+LhbM\ncaPm9qlXe9tjOZjhsWAxBGMvaGNMLuCftP6DJE1Aw73+elaDkuphE7E4dMEtavFJ\nXkLmDCtt3H0NFJ3g19G9I80=\n-----END PRIVATE KEY-----\n"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase initialized for HOTEL-MANAGEMENT");
}

const db = admin.firestore();
const User = db.collection("Users");

export { db, User };