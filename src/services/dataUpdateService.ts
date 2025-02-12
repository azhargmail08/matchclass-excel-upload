
import { supabase } from "@/integrations/supabase/client";
import { ExcelRow, Student } from "@/types";

interface UpdateResult {
  success: boolean;
  error?: Error;
}

export const updateSelectedRecords = async (
  selectedResults: Array<{
    excelEntry: ExcelRow;
    matches: Array<Student>;
    selectedMatch?: Student;
  }>
): Promise<UpdateResult> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error("Please login to update data");
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

    // Process each result
    for (const result of selectedResults) {
      try {
        if (result.selectedMatch) {
          // Update existing student
          const { error: updateError } = await supabase
            .from('internal_database')
            .update({
              Name: result.excelEntry.name,
              Class: result.excelEntry.class,
              Nickname: result.excelEntry.nickname,
              "Special Name": result.excelEntry.special_name,
              "Matrix Number": result.excelEntry.matrix_number,
              "Date Joined": result.excelEntry.date_joined,
              Father: result.excelEntry.father_name,
              "Father ID": result.excelEntry.father_id,
              "Father Email": result.excelEntry.father_email,
              Mother: result.excelEntry.mother_name,
              "Mother ID": result.excelEntry.mother_id,
              "Mother Email": result.excelEntry.mother_email,
              "Contact No": result.excelEntry.contact_no
            })
            .eq('_id', result.selectedMatch._id);
          
          if (updateError) throw updateError;

          // Create sync record for existing student
          const { error: syncError } = await supabase
            .from('data_sync_records')
            .insert({
              batch_id: batchData.id,
              student_id: result.selectedMatch._id,
              status: 'pending'
            });

          if (syncError) throw syncError;
        } else {
          // Create new student with a UUID
          const newStudentId = crypto.randomUUID();
          
          const { error: insertError } = await supabase
            .from('internal_database')
            .insert({
              _id: newStudentId,
              Name: result.excelEntry.name,
              Class: result.excelEntry.class,
              Nickname: result.excelEntry.nickname,
              "Special Name": result.excelEntry.special_name,
              "Matrix Number": result.excelEntry.matrix_number,
              "Date Joined": result.excelEntry.date_joined,
              Father: result.excelEntry.father_name,
              "Father ID": result.excelEntry.father_id,
              "Father Email": result.excelEntry.father_email,
              Mother: result.excelEntry.mother_name,
              "Mother ID": result.excelEntry.mother_id,
              "Mother Email": result.excelEntry.mother_email,
              "Contact No": result.excelEntry.contact_no
            });

          if (insertError) throw insertError;

          // Create sync record
          const { error: syncError } = await supabase
            .from('data_sync_records')
            .insert({
              batch_id: batchData.id,
              student_id: newStudentId,
              status: 'pending'
            });

          if (syncError) throw syncError;
        }
      } catch (recordError) {
        console.error('Error processing record:', recordError);
        throw recordError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateSelectedRecords:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to update records') 
    };
  }
};
