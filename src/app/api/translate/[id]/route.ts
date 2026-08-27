import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { data } = await supabase.storage
      .from("videos")
      .createSignedUrl(translation.output_file_path, 3600);
    downloadUrl = data?.signedUrl ?? null;
  }

  return NextResponse.json({ ...translation, download_url: downloadUrl });
}
