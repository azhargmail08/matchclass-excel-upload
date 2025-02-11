
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";

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
        <div className="overflow-x-auto w-full">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Name on Badges
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Matrix No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Date Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Contact No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Father's Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Father's ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Father's Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Mother's Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Mother's ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Mother's Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students
                    .filter(student => 
                      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (student.matrix_number && student.matrix_number.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.special_name || student.nickname || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.matrix_number || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.date_joined ? format(new Date(student.date_joined), 'dd/MM/yyyy') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.contact_no || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.father_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.father_id || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.father_email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.mother_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.mother_id || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.mother_email || '-'}
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
        </div>
      </div>
    </div>
  );
};
