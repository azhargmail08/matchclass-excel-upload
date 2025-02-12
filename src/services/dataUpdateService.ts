
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
          
          // Create both student and sync record in the same transaction
          const { data: student, error: insertError } = await supabase.rpc('create_student_with_sync_record', {
            p_student_id: newStudentId,
            p_name: result.excelEntry.name,
            p_class: result.excelEntry.class,
            p_nickname: result.excelEntry.nickname,
            p_special_name: result.excelEntry.special_name,
            p_matrix_number: result.excelEntry.matrix_number,
            p_date_joined: result.excelEntry.date_joined,
            p_father_name: result.excelEntry.father_name,
            p_father_id: result.excelEntry.father_id,
            p_father_email: result.excelEntry.father_email,
            p_mother_name: result.excelEntry.mother_name,
            p_mother_id: result.excelEntry.mother_id,
            p_mother_email: result.excelEntry.mother_email,
            p_contact_no: result.excelEntry.contact_no,
            p_teacher: result.excelEntry.teacher,
            p_batch_id: batchData.id
          });

          if (insertError) {
            console.error('Error creating student with sync record:', insertError);
            throw insertError;
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
