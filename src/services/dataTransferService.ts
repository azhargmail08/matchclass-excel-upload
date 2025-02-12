
import { supabase } from "@/integrations/supabase/client";
import { Student, ExcelRow } from "@/types";

export const transferDataToInternal = async (
  externalStudents: Student[],
  excelData?: ExcelRow[], // Add optional Excel data parameter
): Promise<{ success: boolean; error?: Error }> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error("Please login to transfer data");
    }

    // Create batch first
    const { data: batchData, error: batchError } = await supabase
      .from('data_sync_batches')
      .insert({
        user_id: session.session.user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (batchError) throw batchError;

    // Process each student
    for (const student of externalStudents) {
      // Convert string IDs to numbers where needed
      const fatherId = student.father_id ? parseInt(student.father_id) : null;
      const motherId = student.mother_id ? parseInt(student.mother_id) : null;
      const contactNo = student.contact_no ? parseInt(student.contact_no) : null;

      if (student.name === '-' || !student.name) {
        // If no name in external database, use Excel data
        const excelMatch = excelData?.find(row => row._id === student._id);
        if (excelMatch) {
          // Insert Excel data into internal_database
          const { error: insertError } = await supabase
            .from('internal_database')
            .insert({
              _id: student._id,
              Name: excelMatch.name || '-',
              Class: excelMatch.class || '-',
              Nickname: excelMatch.nickname || '-',
              "Special Name": excelMatch.special_name || '-',
              "Matrix Number": excelMatch.matrix_number || '-',
              "Date Joined": excelMatch.date_joined || '-',
              Father: excelMatch.father_name || '-',
              "Father ID": excelMatch.father_id ? parseInt(excelMatch.father_id) : null,
              "Father Email": excelMatch.father_email || '-',
              Mother: excelMatch.mother_name || '-',
              "Mother ID": excelMatch.mother_id ? parseInt(excelMatch.mother_id) : null,
              "Mother Email": excelMatch.mother_email || '-',
              "Contact No": excelMatch.contact_no ? parseInt(excelMatch.contact_no) : null
            });

          if (insertError) throw insertError;
        }
      } else {
        // Use external database data as before
        const { error: insertError } = await supabase
          .from('internal_database')
          .insert({
            _id: student._id,
            Name: student.name,
            Class: student.class,
            Nickname: student.nickname || '-',
            "Special Name": student.special_name || '-',
            "Matrix Number": student.matrix_number || '-',
            "Date Joined": student.date_joined || '-',
            Father: student.father_name || '-',
            "Father ID": fatherId,
            "Father Email": student.father_email || '-',
            Mother: student.mother_name || '-',
            "Mother ID": motherId,
            "Mother Email": student.mother_email || '-',
            "Contact No": contactNo
          });

        if (insertError) throw insertError;
      }

      // Record the transfer
      const { error: transferError } = await supabase
        .from('data_transfers')
        .insert({
          external_id: student._id,
          internal_id: student._id,
          user_id: session.session.user.id,
          batch_id: batchData.id,
          status: 'pending'
        });

      if (transferError) throw transferError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in transferDataToInternal:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to transfer data') 
    };
  }
};
