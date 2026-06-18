import AdminDashboardView from "@/components/app/AdminDashboardView";

export const metadata = {
  title: "Admin Dashboard – CampNexus",
  description: "Manage users, review flagged content, and monitor platform analytics.",
};

export default function AdminPage() {
  return <AdminDashboardView />;
}
