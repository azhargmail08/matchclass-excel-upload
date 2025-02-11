
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onClassClick: () => void;
}

export const DashboardLayout = ({ children, onClassClick }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col sm:flex-row">
        <Sidebar onClassClick={onClassClick} />
        <main className="flex-1 w-full p-4 sm:py-6 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

