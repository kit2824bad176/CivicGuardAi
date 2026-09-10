import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Case from "@/models/Case";
import Evidence from "@/models/Evidence";
import Notification from "@/models/Notification";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    await dbConnect();
    const caseData = await Case.findById(resolvedParams.id).lean();
    if (!caseData) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const evidenceList = await Evidence.find({ caseId: resolvedParams.id }).lean();
    return NextResponse.json({ ...caseData, evidence: evidenceList });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role === "Citizen") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const resolvedParams = await params;
    const { status, assignedOfficerId, priorityScore } = await req.json();
    await dbConnect();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedOfficerId) updateData.assignedOfficerId = assignedOfficerId;
    if (priorityScore) updateData.priorityScore = priorityScore;

    const updatedCase = await Case.findByIdAndUpdate(resolvedParams.id, updateData, { new: true });
    
    // Step 12: Notification Trigger logic
    if (status && updatedCase.citizenId) {
      await Notification.create({
        userId: updatedCase.citizenId,
        caseId: updatedCase._id,
        message: `Your case status has been updated to: ${status}`
      });
    }

    return NextResponse.json(updatedCase);
  } catch (error) {
    return NextResponse.json({ message: "Error updating" }, { status: 500 });
  }
}
