import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Case from "@/models/Case";
import Evidence from "@/models/Evidence";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, description, category, location, isAnonymous, evidenceUrl, fileType, fileHash } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    let finalCategory = category;
    let finalPriority = "Low";

    try {
      // Call Python Microservice for Classification and Risk Scoring
      const aiRes = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        // Option to override category or keep user-selected. We'll prioritize AI prediction for demo
        if (aiData.category && aiData.category !== "Other") {
            finalCategory = aiData.category;
        }
        finalPriority = aiData.priority;
      }
    } catch (err) {
      console.warn("Python AI Service not running, using default priority");
    }

    await dbConnect();

    const newCase = await Case.create({
      title,
      description,
      category: finalCategory,
      location,
      priorityScore: finalPriority,
      isAnonymous,
      citizenId: isAnonymous || !session?.user ? null : session.user.id,
      status: "Pending Review"
    });

    // If evidence was provided, save it
    if (evidenceUrl) {
      await Evidence.create({
        caseId: newCase._id,
        uploadedById: isAnonymous || !session?.user ? null : session.user.id,
        fileUrl: evidenceUrl,
        fileType: fileType || "unknown",
        fileHash: fileHash || "pending-hash", // Placeholder for Step 15
        location
      });
    }

    return NextResponse.json({ message: "Complaint registered successfully", caseId: newCase._id }, { status: 201 });
  } catch (error) {
    console.error("Failed to register complaint:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    let cases;
    if (session.user.role === "Citizen") {
      cases = await Case.find({ citizenId: session.user.id }).sort({ createdAt: -1 });
    } else {
      cases = await Case.find().sort({ createdAt: -1 });
    }
    
    return NextResponse.json(cases, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
