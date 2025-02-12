
import { supabase } from "@/integrations/supabase/client";
import { ExcelRow, Student } from "@/types";

interface UpdateResult {
  success: boolean;
  error?: Error;
}

// Helper function to wait for a specified time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
          
          // Insert new student first
          const { error: insertError } = await supabase
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

          if (insertError) {
            console.error('Error inserting new student:', insertError);
            throw insertError;
          }

          // Add a delay to ensure database consistency
          await delay(1000);

          // Retry verification up to 3 times
          let verifyStudent = null;
          let verifyError = null;
          for (let i = 0; i < 3; i++) {
            const result = await supabase
              .from('students')
              .select()
              .eq('_id', newStudentId)
              .single();
            
            if (!result.error && result.data) {
              verifyStudent = result.data;
              break;
            }
            verifyError = result.error;
            await delay(1000); // Wait before retrying
          }

          if (!verifyStudent) {
            throw new Error(`Failed to verify student creation: ${verifyError?.message}`);
          }

          // Then create sync record after verifying student exists
          const { error: syncError } = await supabase
            .from('data_sync_records')
            .insert({
              batch_id: batchData.id,
              student_id: newStudentId,
              status: 'pending'
            });

          if (syncError) {
            console.error('Error creating sync record:', syncError);
            throw syncError;
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
