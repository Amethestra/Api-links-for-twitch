import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { refreshTwitchAccessToken } from "@/lib/twitch/refresh";

export async function GET() {
    const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
    const oldRefreshToken = cookieStore.get("twitch_refresh_token")?.value;

    if (!oldRefreshToken) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const tokenData = await refreshTwitchAccessToken(oldRefreshToken);

        const response = new Response(JSON.stringify(tokenData), {
            status: 200,
            headers: { "Content=Type": "application/json" },
        });

        response.headers.append(
            "Set-Cookie",
            `twitch_access_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; Max-Age=${tokenData.expires_in}; SameSite=Lax`
        );
        
        response.headers.append(
            "Set-Cookie", 
            `twitch_refresh_token=${tokenData.refresh_token}; Path=/; HttpOnly; Secure; Max-Age=2592000; SameSite=Lax`
        );

        return response;

    } catch {
        return new Response("Failed to refresh Twitch access token", {
            status: 500,
        });
    }
}