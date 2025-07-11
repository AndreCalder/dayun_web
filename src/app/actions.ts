import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function uploadImage(file: File) {
    
    const { data, error } = await supabase.storage
        .from("dayun")
        .upload(`${file.name.replace(/[^a-zA-Z ]/g, "")}_${Date.now()}`, file);
    if (error) {
        // Handle error
    } else if (data) {
        let { path } = data;
        return `https://oupaswmsirlkbgllmlqo.supabase.co/storage/v1/object/public/dayun/${encodeURI(
            path
        )}`;
    }
}
