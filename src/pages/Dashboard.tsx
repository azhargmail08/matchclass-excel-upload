
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClassList } from "@/components/class/ClassList";
import { useState } from "react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout onClassClick={() => {}}>
      <ClassList 
        classes={[]} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </DashboardLayout>
  );
}
