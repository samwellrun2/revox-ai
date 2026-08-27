import { TranslationProgress } from "@/components/dashboard/translation-progress";

export default async function TranslationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TranslationProgress id={id} />;
}
