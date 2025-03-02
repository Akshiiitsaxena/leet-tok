"use client";

import { useSearchParams } from "next/navigation";
import { QuestionFeed } from "@/features/questions/QuestionFeed";
import { FilterType } from "@/types/questions";

export default function FeedPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as FilterType;

  return <QuestionFeed filterType={type} />;
}
