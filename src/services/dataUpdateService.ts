
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

    // Create batch
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
      if (result.selectedMatch) {
        // Update existing student
        const { error: updateError } = await supabase
          .from('students')
          .update({
            name: result.excelEntry.name,
            class: result.excelEntry.class,
          })
          .eq('_id', result.selectedMatch._id);
        
        if (updateError) throw updateError;

        // Create sync record for existing student
        const { error: syncError } = await supabase
          .from('data_sync_records')
          .insert({
            batch_id: batchData.id,
            student_id: result.selectedMatch._id,
            external_student_id: result.selectedMatch._id,
            status: 'pending'
          });

        if (syncError) throw syncError;
      } else {
        // Create new student with a UUID
        const newStudentId = crypto.randomUUID();
        
        // Insert new student and verify insertion
        const { data: newStudent, error: insertError } = await supabase
          .from('students')
          .insert({
            _id: newStudentId,
            name: result.excelEntry.name,
            class: result.excelEntry.class,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (!newStudent) throw new Error('Failed to create new student');

        // Verify student exists before creating sync record
        const { data: studentCheck, error: checkError } = await supabase
          .from('students')
          .select('_id')
          .eq('_id', newStudentId)
          .single();

        if (checkError) throw checkError;
        if (!studentCheck) throw new Error('Failed to verify student creation');

        // Create sync record for new student
        const { error: syncError } = await supabase
          .from('data_sync_records')
          .insert({
            batch_id: batchData.id,
            student_id: newStudentId,
            external_student_id: null,
            status: 'pending'
          });

        if (syncError) throw syncError;
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
