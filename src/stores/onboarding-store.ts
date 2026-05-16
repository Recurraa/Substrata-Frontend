import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OnboardingStep = "connect" | "profile" | "plan" | "done";

interface OnboardingStore {
  step: OnboardingStep;
  merchantName: string;
  webhookUrl: string;
  setStep: (step: OnboardingStep) => void;
  setProfile: (name: string, webhookUrl: string) => void;
  complete: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      step: "connect",
      merchantName: "",
      webhookUrl: "",
      setStep: (step) => set({ step }),
      setProfile: (merchantName, webhookUrl) => set({ merchantName, webhookUrl }),
      complete: () => set({ step: "done" }),
      reset: () => set({ step: "connect", merchantName: "", webhookUrl: "" }),
    }),
    { name: "substrata-onboarding" }
  )
);
