import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: translation } = await supabase
    .from("translations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!translation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let downloadUrl: string | null = null;
  if (translation.status === "completed" && translation.output_file_path) {
    // Use service role to generate signed URL (has full storage access)
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await serviceClient.storage
      .from("videos")
      .createSignedUrl(translation.output_file_path, 3600);
    downloadUrl = data?.signedUrl ?? null;
  }

  return NextResponse.json({ ...translation, download_url: downloadUrl });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get translation to find file paths
  const { data: translation } = await supabase
    .from("translations")
    .select("source_file_path, output_file_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!translation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete files from storage
  const filesToDelete = [translation.source_file_path, translation.output_file_path].filter(Boolean) as string[];
  if (filesToDelete.length > 0) {
    await supabase.storage.from("videos").remove(filesToDelete);
  }

  // Delete translation record
  await supabase.from("translations").delete().eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
