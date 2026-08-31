import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Node.js 18+ has fetch globally, but let's use a safe approach or assume recent Node.
import FormData from 'form-data';

const SONGS_DIR = 'C:/Users/HARSHAL/Music/songs';
const API_URL = 'http://localhost:3000/api/songs'; // Assuming default port 5000, I should check server.js

async function uploadSongs() {
  const moods = ['sad', 'happy', 'surprised'];

  for (const mood of moods) {
    const moodDir = path.join(SONGS_DIR, mood);

    if (!fs.existsSync(moodDir)) {
      console.log(`Folder for mood "${mood}" not found at ${moodDir}. Skipping...`);
      continue;
    }

    const files = fs.readdirSync(moodDir).filter(file => file.endsWith('.mp3'));
    console.log(`Found ${files.length} songs for mood: ${mood}`);

    for (const file of files) {
      const filePath = path.join(moodDir, file);
      const form = new FormData();
      form.append('song', fs.createReadStream(filePath));
      form.append('mood', mood);

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: form,
          headers: form.getHeaders(),
        });

        const result = await response.json();
        if (response.ok) {
          console.log(`✅ Uploaded: ${file} [${mood}]`);
        } else {
          console.error(`❌ Failed to upload ${file}: ${result.message || response.statusText}`);
        }
      } catch (error) {
        console.error(`🚨 Error uploading ${file}:`, error.message);
      }
    }
  }
}

uploadSongs().then(() => console.log('Bulk upload completed.'));
