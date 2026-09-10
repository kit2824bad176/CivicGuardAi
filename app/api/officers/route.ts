import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === "Citizen") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    
    await dbConnect();
    const officers = await User.find({ role: "Police Officer" }).select("_id name").lean();
    return NextResponse.json(officers);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching" }, { status: 500 });
  }
}
