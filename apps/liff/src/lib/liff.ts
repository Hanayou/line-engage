import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";

const LIFF_ID = import.meta.env.VITE_LIFF_ID || "dummy-liff-id";
const USE_MOCK = import.meta.env.VITE_LIFF_MOCK === "true";

export async function initializeLiff() {
  if (USE_MOCK) {
    liff.use(new LiffMockPlugin());
  }

  await liff.init({ liffId: LIFF_ID, mock: USE_MOCK } as Parameters<typeof liff.init>[0]);

  if (!liff.isLoggedIn() && !USE_MOCK) {
    liff.login();
  }

  return liff;
}

export async function getProfile() {
  return liff.getProfile();
}

export { liff };
