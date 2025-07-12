"use server";

import { createClient } from "@supabase/supabase-js";
import axios from "axios";

export async function uploadImage(formData: FormData) {
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_ANON_KEY || ""
  );

  const file = formData.get('file') as File;
  
  if (!file) {
    return "";
  }

  const bucket = "dayun";
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${file.name.replace(/[^a-zA-Z ]/g, "")}_${Date.now()}`, file);
  if (error) {
    return "";
  } else if (data) {
    let { path } = data;
    return `${
      process.env.SUPABASE_URL
    }/storage/v1/object/public/${bucket}/${encodeURI(path)}`;
  }
}
