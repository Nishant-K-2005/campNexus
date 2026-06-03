import { supabase } from "../config/supabaseClient.js";

const uploadFile = async (file,postType) => {
    const extension = file.originalname.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
    const filePath = `${postType}/${uniqueFileName}`
    const mime = file.mimetype
    const type = mime.startsWith("image/") ? "Image" : "Doc";

    const { error: uploadError } = await supabase.storage
        .from("campnexus-resources")
        .upload(filePath, file.buffer, { contentType: mime })
    if (uploadError) {
        throw new Error("File upload failed")
    }
    const { data: publicUrlData } = supabase.storage
        .from("campnexus-resources")
        .getPublicUrl(filePath)

    return {
        type: type,
        url: publicUrlData.publicUrl,
        title: file.originalname
    }
}

export default uploadFile