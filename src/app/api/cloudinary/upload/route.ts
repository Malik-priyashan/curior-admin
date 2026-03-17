import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables.
// Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in your .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dataUrl, filename, serviceId, businessName } = body as {
      dataUrl?: string;
      filename?: string;
      serviceId?: string;
      businessName?: string;
    };

    if (!dataUrl) return NextResponse.json({ error: "Missing dataUrl" }, { status: 400 });

    // Save under the top-level `logos` folder. Use businessName for public_id when available.
    const folder = "logos";

    // Build public id from businessName: lowercase, spaces -> underscores, strip invalid chars
    let publicId: string | undefined = undefined;
    if (businessName && businessName.trim()) {
      publicId = businessName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_\-]/g, "");
      if (!publicId) publicId = undefined;
    }

    // Fallback to filename without extension if publicId not derived
    if (!publicId && filename) {
      publicId = filename.replace(/\.[^/.]+$/, "");
    }

    // Ensure we have some public id; if not, use serviceId or timestamp
    if (!publicId) {
      publicId = serviceId ? `service_${serviceId}` : `image_${Date.now()}`;
    }

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder,
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
      format: "png",
    });

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
  } catch (e) {
     
    console.error("Cloudinary upload failed", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
