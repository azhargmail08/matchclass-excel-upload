
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClassList } from "@/components/class/ClassList";
import { useState } from "react";
import { ClassDetails } from "@/pages/Class";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample class data
  const classes: ClassDetails[] = [
    {
      className: "1A Mathematics",
      teacher: "John Smith",
      students: [
        { name: "Alice Johnson", id: "1", class: "1A Mathematics" },
        { name: "Bob Wilson", id: "2", class: "1A Mathematics" },
      ]
    },
    {
      className: "2B Science",
      teacher: "Sarah Davis",
      students: [
        { name: "Charlie Brown", id: "3", class: "2B Science" },
        { name: "Diana Evans", id: "4", class: "2B Science" },
        { name: "Edward Mills", id: "5", class: "2B Science" },
      ]
    },
    {
      className: "3C English",
      teacher: "Michael Lee",
      students: [
        { name: "Frank White", id: "6", class: "3C English" },
        { name: "Grace Taylor", id: "7", class: "3C English" },
      ]
    }
  ];

  return (
    <DashboardLayout onClassClick={() => {}}>
      <ClassList 
        classes={classes} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </DashboardLayout>
  );
}
