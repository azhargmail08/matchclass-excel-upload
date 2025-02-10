
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to StudentQR</h1>
          <p className="mt-2 text-gray-600">Manage your classes and students efficiently.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
