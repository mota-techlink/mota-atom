import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to the console overview page
  redirect("/admin/console");
}