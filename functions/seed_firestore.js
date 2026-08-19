const admin = require('firebase-admin');

// Initialize Firebase Admin (You'll need a service account key for local running)
// Or run this in a Cloud Function / Firebase Shell
const db = admin.firestore();

const seedMedia = [
    {
        title: "Deep Sleep Binaural",
        category: "Lonely",
        duration: "10:00",
        type: "binaural",
        youtubeUrl: "https://youtu.be/EXAMPLE1",
        videoId: "EXAMPLE1",
        thumbnail: "https://img.youtube.com/vi/EXAMPLE1/0.jpg"
    },
    {
        title: "Anxiety Relief Grounding",
        category: "Fearful",
        duration: "05:00",
        type: "video",
        youtubeUrl: "https://youtu.be/EXAMPLE2",
        videoId: "EXAMPLE2",
        thumbnail: "https://img.youtube.com/vi/EXAMPLE2/0.jpg"
    },
    {
        title: "Anger Release Meditation",
        category: "Angry",
        duration: "08:00",
        type: "meditation",
        youtubeUrl: "https://youtu.be/EXAMPLE3",
        videoId: "EXAMPLE3",
        thumbnail: "https://img.youtube.com/vi/EXAMPLE3/0.jpg"
    }
];

async function seed() {
    const batch = db.batch();
    seedMedia.forEach((item) => {
        const ref = db.collection('media_content').doc();
        batch.set(ref, { ...item, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
    console.log('Seed successful!');
}

seed();
