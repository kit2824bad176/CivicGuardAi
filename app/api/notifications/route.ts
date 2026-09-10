import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const notifs = await Notification.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json(notifs);
  } catch(e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
