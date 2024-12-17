import { createClient } from '@supabase/supabase-js';

exports.handler = async (event, context) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Utiliza la clave de servicio si necesitas operaciones administrativas.
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Supabase credentials not configured" }),
    };
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
      const { data, error } = await supabase
      .from('tu_tabla_de_registros')
      .select('*')

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};