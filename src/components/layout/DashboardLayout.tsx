
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onClassClick: () => void;
}

export const DashboardLayout = ({ children, onClassClick }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar onClassClick={onClassClick} />
        <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};
