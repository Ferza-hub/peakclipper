export interface UserPrefs {
  onboardingComplete: boolean;
  role: "creator" | "agency" | null;
  name: string;
  // Creator
  mainPlatform: string;
  contentNiche: string;
  // Agency
  agencyName: string;
  teamSize: string;
  plan: "starter" | "pro" | "scale" | null;
}

const KEY = "peakclipper_prefs";

const defaults: UserPrefs = {
  onboardingComplete: false,
  role: null,
  name: "",
  mainPlatform: "",
  contentNiche: "",
  agencyName: "",
  teamSize: "",
  plan: null,
};

export function getUserPrefs(): UserPrefs {
  if (typeof window === "undefined") return { ...defaults };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

export function setUserPrefs(updates: Partial<UserPrefs>): UserPrefs {
  const current = getUserPrefs();
  const next = { ...current, ...updates };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearUserPrefs(): void {
  localStorage.removeItem(KEY);
}
