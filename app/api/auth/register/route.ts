import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 3, 60000)) {
      return NextResponse.json({ message: "Too many accounts created from this IP recently." }, { status: 429 });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Citizen"
    });

    return NextResponse.json({ 
      message: "User registered successfully", 
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } 
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
