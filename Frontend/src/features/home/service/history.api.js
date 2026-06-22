import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
})

export async function recordPlay(songId) {
    const response = await api.post("/api/history/play", { songId })
    return response.data
}

export async function getRecentlyPlayed(limit = 10) {
    const response = await api.get("/api/history/recent?limit=" + limit)
    return response.data
}