
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types";

export const transferDataToInternal = async (
  externalStudents: Student[],
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
      // Generate a new UUID for the student
      const newInternalId = crypto.randomUUID();
      
      // Convert string IDs to numbers where needed
      const fatherId = student.father_id ? parseInt(student.father_id) : null;
      const motherId = student.mother_id ? parseInt(student.mother_id) : null;
      const contactNo = student.contact_no ? parseInt(student.contact_no) : null;

      // Insert into internal_database
      const { error: insertError } = await supabase
        .from('internal_database')
        .insert({
          _id: newInternalId,
          Name: student.name,
          Class: student.class,
          Nickname: student.nickname,
          "Special Name": student.special_name,
          "Matrix Number": student.matrix_number,
          "Date Joined": student.date_joined,
          Father: student.father_name,
          "Father ID": fatherId,
          "Father Email": student.father_email,
          Mother: student.mother_name,
          "Mother ID": motherId,
          "Mother Email": student.mother_email,
          "Contact No": contactNo
        });

      if (insertError) throw insertError;

      // Record the transfer
      const { error: transferError } = await supabase
        .from('data_transfers')
        .insert({
          external_id: student._id,
          internal_id: newInternalId,
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
