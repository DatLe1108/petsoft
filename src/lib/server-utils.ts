import "server-only";

import { redirect } from "next/navigation";
import { auth } from "./auth";

export const checkAuth = async () => {
  // authentication check
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
};
