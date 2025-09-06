import { API_URL } from "@/lib/constants"
import { fetchJSON } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

export interface LoginRequest {
	email: string
	password: string
}

export interface SignupRequest {
	email: string
	password: string
	username: string
	tos: boolean
}

export interface AuthorizeRequest {
	app_key: string
}

export async function loginUser(data: LoginRequest) {
	const [response, request] = await fetchJSON(`${API_URL}/oauth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})

	return { data: response, status: request.status }
}

export async function signupUser(data: SignupRequest) {
	const [response, request] = await fetchJSON(
		`${API_URL}/oauth/account/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}
	)

	return { data: response, status: request.status }
}

export async function authorizeApp(data: AuthorizeRequest) {
	const { refresh_token } = useAuthStore.getState()

	if (!refresh_token) {
		throw new Error("No refresh token available")
	}

	const [response, request] = await fetchJSON(
		`${API_URL}/oauth/account/authorize`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${refresh_token}`
			},
			body: JSON.stringify(data)
		}
	)

	return { data: response, status: request.status }
}

export async function getApps() {
	const [response, request] = await fetchJSON(
		`${API_URL}/oauth/account/get-apps`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}
	)

	return { data: response, status: request.status }
}

export async function logoutUser() {
	const { refresh_token } = useAuthStore.getState()

	if (!refresh_token) {
		throw new Error("No refresh token available")
	}

	const [response, request] = await fetchJSON(`${API_URL}/oauth/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${refresh_token}`
		}
	})

	return { data: response, status: request.status }
}
