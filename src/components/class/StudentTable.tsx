
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

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
      
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-center mb-4">
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

        <div className="grid gap-4">
          {students
            .filter(student => 
              student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (student.nickname && student.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (student.matrix_number && student.matrix_number.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((student) => (
              <Card key={student._id} className="w-full">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">{student.name}</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Name on Badges:</span>
                          <p>{student.special_name || student.nickname || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Matrix No.:</span>
                          <p>{student.matrix_number || '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Date Joined:</span>
                          <p>{student.date_joined ? format(new Date(student.date_joined), 'dd/MM/yyyy') : '-'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Contact No.:</span>
                          <p>{student.contact_no || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium mb-2">Father's Information</h4>
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p>{student.father_name || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">ID:</span>
                        <p>{student.father_id || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="break-all">{student.father_email || '-'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium mb-2">Mother's Information</h4>
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p>{student.mother_name || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">ID:</span>
                        <p>{student.mother_id || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="break-all">{student.mother_email || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm">
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};
