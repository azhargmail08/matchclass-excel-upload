
import { supabase } from "@/integrations/supabase/client";
import { Student, ExcelRow } from "@/types";

export const transferDataToInternal = async (
  selectedRows: { excelRow: ExcelRow, selectedMatch?: Student | undefined }[]
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

    // Process each selected row
    for (const { excelRow, selectedMatch } of selectedRows) {
      if (selectedMatch) {
        // If there's a selected match from SSDM, use that data
        const fatherId = selectedMatch.father_id ? parseInt(selectedMatch.father_id) : null;
        const motherId = selectedMatch.mother_id ? parseInt(selectedMatch.mother_id) : null;
        const contactNo = selectedMatch.contact_no ? parseInt(selectedMatch.contact_no) : null;

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
            "Father ID": fatherId,
            "Father Email": selectedMatch.father_email || '-',
            Mother: selectedMatch.mother_name || '-',
            "Mother ID": motherId,
            "Mother Email": selectedMatch.mother_email || '-',
            "Contact No": contactNo
          });

        if (insertError) throw insertError;

        // Record the transfer with SSDM ID
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
        // If no match selected, use Excel data directly
        const newId = crypto.randomUUID(); // Generate a single UUID for both tables

        const { error: insertError } = await supabase
          .from('internal_database')
          .insert({
            _id: newId, // Use the same newId
            Name: excelRow.name || '-',
            Class: excelRow.class || '-',
            Nickname: excelRow.nickname || '-',
            "Special Name": excelRow.special_name || '-',
            "Matrix Number": excelRow.matrix_number || '-',
            "Date Joined": excelRow.date_joined || '-',
            Father: excelRow.father_name || '-',
            "Father ID": excelRow.father_id ? parseInt(excelRow.father_id) : null,
            "Father Email": excelRow.father_email || '-',
            Mother: excelRow.mother_name || '-',
            "Mother ID": excelRow.mother_id ? parseInt(excelRow.mother_id) : null,
            "Mother Email": excelRow.mother_email || '-',
            "Contact No": excelRow.contact_no ? parseInt(excelRow.contact_no) : null
          });

        if (insertError) throw insertError;

        // Record the transfer with the same generated ID
        const { error: transferError } = await supabase
          .from('data_transfers')
          .insert({
            external_id: 'excel-import',
            internal_id: newId, // Use the same newId
            user_id: session.session.user.id,
            batch_id: batchData.id,
            status: 'pending'
          });

        if (transferError) throw transferError;
      }
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
