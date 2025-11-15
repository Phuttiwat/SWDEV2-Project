import getUserProfile from "./getUserProfile";

/**
 * Get user role from token
 * @param token - User token string
 * @returns User role ('admin', 'staff', etc.) or null if not available
 */
export default async function getUserRole(token: string | undefined | null): Promise<string | null> {
    if (!token) {
        return null;
    }
    
    try {
        const userProfile = await getUserProfile(token);
        return userProfile?.data?.role || null;
    } catch (error) {
        console.error("Failed to get user role:", error);
        return null;
    }
}

