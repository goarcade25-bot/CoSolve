import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://btobmeqsczsggekfkhaz.supabase.co'
const supabaseKey = 'sb_publishable_E1PdW4Wd-wh4jW86O4R0uQ_FbrFfp8R'
export const supabase = createClient(supabaseUrl, supabaseKey)