import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        return NextResponse.json({
            session: session,
            userId: (session?.user as any)?.id,
            userEmail: session?.user?.email,
            userName: session?.user?.name,
            env: {
                hasSecret: !!process.env.NEXTAUTH_SECRET,
                hasUrl: !!process.env.NEXTAUTH_URL,
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to get session", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
