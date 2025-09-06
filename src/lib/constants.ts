const ENV = import.meta.env.MODE
const TESTING_API = "http://localhost:80"

export const API_URL = ENV === "production" ? "https://api.gezcez.com" : TESTING_API
export const OAUTH_URL = ENV === "production" ? "https://oauth.gezcez.com" : "http://localhost:8081"