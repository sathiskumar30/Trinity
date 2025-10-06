import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})
