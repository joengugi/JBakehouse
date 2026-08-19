import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import AdminDashboard from "@/components/Adminpage";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/Admin/dashboard/page");
  }

  if (session.user.role !== "admin") {
    redirect("/Admin/login/page");
  }

  return <AdminDashboard />;
}