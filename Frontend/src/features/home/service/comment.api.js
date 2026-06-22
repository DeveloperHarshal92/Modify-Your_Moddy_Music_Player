import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
})

export async function getComments(songId) {
    const response = await api.get(`/api/comments/${songId}`)
    return response.data
}

export async function postComment(songId, text) {
    const response = await api.post(`/api/comments/${songId}`, { text })
    return response.data
}