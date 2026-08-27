import { createClient } from "@/lib/supabase/server";

export async function TopBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initials = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="h-16 border-b border-brand-border bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-8">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-brand-muted">{user?.email}</span>
        <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
      </div>
    </header>
  );
}
