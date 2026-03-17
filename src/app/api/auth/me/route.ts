import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      console.log("No valid session found in me route");
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findById(session.userId).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
