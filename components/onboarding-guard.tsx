"use client";

import { getUserPrefs } from "@/lib/user-prefs";
import { useRouter } from "next/navigation";
import * as React from "react";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const prefs = getUserPrefs();
    if (!prefs.onboardingComplete) {
      router.replace("/onboarding");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e2e8f0] border-t-[#7c3aed]" />
      </div>
    );
  }

  return <>{children}</>;
}
