import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    await Notification.updateMany({ userId: session.user.id, isRead: false }, { isRead: true });
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
