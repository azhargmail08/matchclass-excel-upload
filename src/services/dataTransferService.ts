
import { supabase } from "@/integrations/supabase/client";
import { Student, ExcelRow } from "@/types";

export const transferDataToInternal = async (
  selectedRows: { excelRow: ExcelRow, selectedMatch?: Student | undefined }[]
): Promise<{ success: boolean; error?: Error; skippedRecords?: number }> => {
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

    let skippedRecords = 0;

    // Process each selected row
    for (const { excelRow, selectedMatch } of selectedRows) {
      try {
        if (selectedMatch) {
          // First check if the record already exists in internal database
          const { data: existingRecord, error: checkError } = await supabase
            .from('internal_database')
            .select('_id')
            .eq('_id', selectedMatch._id)
            .single();

          if (checkError && checkError.code !== 'PGRST116') throw checkError; // PGRST116 means no rows returned

          if (existingRecord) {
            // If record exists, update it instead of inserting
            const { error: updateError } = await supabase
              .from('internal_database')
              .update({
                Name: selectedMatch.name,
                Class: selectedMatch.class,
                Nickname: selectedMatch.nickname || '-',
                "Special Name": selectedMatch.special_name || '-',
                "Matrix Number": selectedMatch.matrix_number || '-',
                "Date Joined": selectedMatch.date_joined || '-',
                Father: selectedMatch.father_name || '-',
                "Father ID": selectedMatch.father_id || '-',
                "Father Email": selectedMatch.father_email || '-',
                Mother: selectedMatch.mother_name || '-',
                "Mother ID": selectedMatch.mother_id || '-',
                "Mother Email": selectedMatch.mother_email || '-',
                "Contact No": selectedMatch.contact_no || '-'
              })
              .eq('_id', selectedMatch._id);

            if (updateError) throw updateError;
          } else {
            // If record doesn't exist, insert it
            const { error: insertError } = await supabase
              .from('internal_database')
              .insert({
                _id: selectedMatch._id,
                Name: selectedMatch.name,
                Class: selectedMatch.class,
                Nickname: selectedMatch.nickname || '-',
                "Special Name": selectedMatch.special_name || '-',
                "Matrix Number": selectedMatch.matrix_number || '-',
                "Date Joined": selectedMatch.date_joined || '-',
                Father: selectedMatch.father_name || '-',
                "Father ID": selectedMatch.father_id || '-',
                "Father Email": selectedMatch.father_email || '-',
                Mother: selectedMatch.mother_name || '-',
                "Mother ID": selectedMatch.mother_id || '-',
                "Mother Email": selectedMatch.mother_email || '-',
                "Contact No": selectedMatch.contact_no || '-'
              });

            if (insertError) throw insertError;
          }

          // Record the transfer
          const { error: transferError } = await supabase
            .from('data_transfers')
            .insert({
              external_id: selectedMatch._id,
              internal_id: selectedMatch._id,
              user_id: session.session.user.id,
              batch_id: batchData.id,
              status: 'pending'
            });

          if (transferError) throw transferError;
        } else {
          // For new records from Excel
          const newId = crypto.randomUUID();

          const { error: insertError } = await supabase
            .from('internal_database')
            .insert({
              _id: newId,
              Name: excelRow.name || '-',
              Class: excelRow.class || '-',
              Nickname: excelRow.nickname || '-',
              "Special Name": excelRow.special_name || '-',
              "Matrix Number": excelRow.matrix_number || '-',
              "Date Joined": excelRow.date_joined || '-',
              Father: excelRow.father_name || '-',
              "Father ID": excelRow.father_id || '-',
              "Father Email": excelRow.father_email || '-',
              Mother: excelRow.mother_name || '-',
              "Mother ID": excelRow.mother_id || '-',
              "Mother Email": excelRow.mother_email || '-',
              "Contact No": excelRow.contact_no || '-'
            });

          if (insertError) throw insertError;

          // Record the transfer
          const { error: transferError } = await supabase
            .from('data_transfers')
            .insert({
              external_id: 'excel-import',
              internal_id: newId,
              user_id: session.session.user.id,
              batch_id: batchData.id,
              status: 'pending'
            });

          if (transferError) throw transferError;
        }
      } catch (error) {
        console.error('Error processing record:', error);
        skippedRecords++;
      }
    }

    return { 
      success: true,
      skippedRecords 
    };
  } catch (error) {
    console.error('Error in transferDataToInternal:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to transfer data'),
      skippedRecords: 0
    };
  }
};
