import { API_BASE_URL } from "@/config/config"
import { paths } from "@/types/openapi"

type User = paths["/users/me/"]["get"]["responses"]["200"]["content"]["application/json"]

export const userService = {
//    // Get current user API call
    getCurrentUser: async (token: string | null): Promise<User> => {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        if (!res.ok) {
            throw new Error (res.status === 401 ? "Token expired" : "Failed to fetch user")
            }
        return res.json()
    }

}