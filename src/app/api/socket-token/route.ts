import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ token: accessToken });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get token" },
      { status: 500 }
    );
  }
}

