"use client";

import { redirect } from "next/navigation";

export default function ProfessorRedirect() {
  redirect("/dashboard");
}
