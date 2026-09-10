import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import cloudinary from "@/services/cloudinary";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 15: Tamper-Proof Evidence (Generate SHA-256 hash)
    const hashSum = crypto.createHash("sha256");
    hashSum.update(buffer);
    const fileHash = hashSum.digest("hex");

    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "civicguard_evidence", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as any);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      fileType: file.type,
      fileHash
    }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "Failed to upload file" }, { status: 500 });
  }
}
