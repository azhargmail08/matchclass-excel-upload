
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface StudentTableProps {
  students: Student[];
}

export const StudentTable = ({ students }: StudentTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Students</h2>
        <Button variant="outline" className="gap-2">
          Transfer Selected Student(s)
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search Student"
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="border rounded-lg px-4 py-2">
              <option>Sort A-Z</option>
              <option>Sort Z-A</option>
            </select>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name on Badges
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Matrix No.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students
              .filter(student => 
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((student, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.nickname || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm">
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
