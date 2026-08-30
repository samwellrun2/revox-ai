import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canTranslate, type Tier } from "@/lib/tier-limits";
import { FREE_LANGUAGES } from "@/lib/constants/languages";
import { processTranslation } from "@/lib/pipeline/process";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const targetLanguage = formData.get("target_language") as string;
  const file = formData.get("file") as File | null;
  const url = formData.get("url") as string | null;
  const addCaptions = formData.get("add_captions") === "true";
  const removeOriginalSubs = formData.get("remove_original_subs") === "true";

  if (!targetLanguage) {
    return NextResponse.json({ error: "Target language required" }, { status: 400 });
  }

  if (!file && !url) {
    return NextResponse.json({ error: "File or URL required" }, { status: 400 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier")
    .eq("user_id", user.id)
    .single();

  const tier = (subscription?.tier ?? "free") as Tier;

  if (tier === "free" && !FREE_LANGUAGES.includes(targetLanguage)) {
    return NextResponse.json(
      { error: "Upgrade to Pro to access this language" },
      { status: 403 }
    );
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: usage } = await supabase
    .from("usage")
    .select("minutes_used")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .single();

  const minutesUsed = usage?.minutes_used ?? 0;
  const check = canTranslate(tier, minutesUsed, 60);
  if (!check.allowed) {
    return NextResponse.json({ error: check.reason }, { status: 403 });
  }

  let sourceFilePath: string | null = null;
  if (file) {
    const fileKey = `uploads/${user.id}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(fileKey, buffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
    sourceFilePath = fileKey;
  }

  const { data: translation, error: insertError } = await supabase
    .from("translations")
    .insert({
      user_id: user.id,
      source_url: url,
      source_file_path: sourceFilePath,
      target_language: targetLanguage,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !translation) {
    return NextResponse.json({ error: "Failed to create translation" }, { status: 500 });
  }

  processTranslation(translation.id, { addCaptions, removeOriginalSubs }).catch(console.error);

  return NextResponse.json({ id: translation.id });
}
