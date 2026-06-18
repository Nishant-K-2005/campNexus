"use client";

import { redirect } from "next/navigation";

export default function StudentRedirect() {
  redirect("/dashboard");
}
