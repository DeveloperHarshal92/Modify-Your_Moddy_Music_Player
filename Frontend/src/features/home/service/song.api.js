import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
})

export async function getSong({mood}){
    const response = await api.get("/api/songs?mood=" + mood)
    return response.data
}

export async function getSongById(id) {
    const response = await api.get(`/api/songs/${id}`)
    return response.data
}

export async function searchSongs(query) {
    const response = await api.get("/api/songs/search?q=" + encodeURIComponent(query))
    return response.data
}

export async function getSimilarSongs(songId, limit = 8) {
    const response = await api.get(`/api/songs/${songId}/similar?limit=${limit}`)
    return response.data
}

export async function uploadSong({ file, mood }) {
    const formData = new FormData();
    formData.append("song", file);
    formData.append("mood", mood);

    const response = await api.post("/api/songs", formData);
    return response.data
}