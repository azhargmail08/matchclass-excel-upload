
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
            .from('students')
            .update({
              name: result.excelEntry.name,
              class: result.excelEntry.class,
              nickname: result.excelEntry.nickname,
              special_name: result.excelEntry.special_name,
              matrix_number: result.excelEntry.matrix_number,
              date_joined: result.excelEntry.date_joined,
              father_name: result.excelEntry.father_name,
              father_id: result.excelEntry.father_id,
              father_email: result.excelEntry.father_email,
              mother_name: result.excelEntry.mother_name,
              mother_id: result.excelEntry.mother_id,
              mother_email: result.excelEntry.mother_email,
              contact_no: result.excelEntry.contact_no,
              teacher: result.excelEntry.teacher
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

          // Start transaction
          await supabase.rpc('begin_transaction');
          
          try {
            // Insert new student
            const { error: studentError } = await supabase
              .from('students')
              .insert({
                _id: newStudentId,
                name: result.excelEntry.name,
                class: result.excelEntry.class,
                nickname: result.excelEntry.nickname,
                special_name: result.excelEntry.special_name,
                matrix_number: result.excelEntry.matrix_number,
                date_joined: result.excelEntry.date_joined,
                father_name: result.excelEntry.father_name,
                father_id: result.excelEntry.father_id,
                father_email: result.excelEntry.father_email,
                mother_name: result.excelEntry.mother_name,
                mother_id: result.excelEntry.mother_id,
                mother_email: result.excelEntry.mother_email,
                contact_no: result.excelEntry.contact_no,
                teacher: result.excelEntry.teacher
              });

            if (studentError) throw studentError;

            // Create sync record
            const { error: syncError } = await supabase
              .from('data_sync_records')
              .insert({
                batch_id: batchData.id,
                student_id: newStudentId,
                status: 'pending'
              });

            if (syncError) throw syncError;

            // Commit transaction
            await supabase.rpc('commit_transaction');
          } catch (transactionError) {
            // Rollback on any error
            await supabase.rpc('rollback_transaction');
            throw transactionError;
          }
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
