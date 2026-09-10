import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Case from "@/models/Case";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    
    const totalCases = await Case.countDocuments();
    const resolvedCases = await Case.countDocuments({ status: "Resolved" });
    const pendingCases = await Case.countDocuments({ status: "Pending Review" });
    
    const categoryDistribution = await Case.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const priorityDistribution = await Case.aggregate([
      { $group: { _id: "$priorityScore", count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      totalCases,
      resolvedCases,
      pendingCases,
      resolutionRate: totalCases > 0 ? ((resolvedCases / totalCases) * 100).toFixed(1) : 0,
      categoryDistribution,
      priorityDistribution
    });
  } catch(e) {
    console.error(e);
    return NextResponse.json({ message: "Error fetch analytics" }, { status: 500 });
  }
}
