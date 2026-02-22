import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;


console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);


let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.error(" Variables de entorno de Supabase NO cargadas");
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
