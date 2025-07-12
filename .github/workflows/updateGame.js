const admin = require("firebase-admin");

// 🔐 Replace with your service account JSON
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateGame() {
  const gameRef = db.collection("game").doc("current");
  const doc = await gameRef.get();
  let currentPeriod = 100000;
  if (doc.exists) {
    currentPeriod = doc.data().period || 100000;
  }

  const nextPeriod = currentPeriod + 1;
  const number = Math.floor(Math.random() * 10); // 0–9

  let color = "";
  if (number === 0 || number === 5) color = "violet";
  else if (number % 2 === 0) color = "green";
  else color = "red";

  const startTime = admin.firestore.Timestamp.now();

  // ✅ Update game info
  await gameRef.set({
    period: nextPeriod,
    number,
    color,
    startTime
  });

  // ✅ Save result to results collection
  await db.collection("results").doc(String(nextPeriod)).set({
    period: nextPeriod,
    number,
    color,
    startTime
  });

  console.log(✅ Period ${nextPeriod} updated: ${number} (${color}));
}

updateGame().catch(console.error);
