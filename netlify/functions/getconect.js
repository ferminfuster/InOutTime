// netlify/functions/getconect.js

const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const SUPABASE_URL = 'https://wuclrdkmfhxwguvjflig.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y2xyZGttZmh4d2d1dmpmbGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjMxOTMsImV4cCI6MjA0OTQ5OTE5M30.iMtQIzRNkbMMvrGJuz-tMP4PBqmJ9BsEoaZv10xb_hA';
 
  // Inicialización de Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Si la solicitud es de tipo POST
  if (event.httpMethod === 'POST') {
    try {
      // Aquí agregas la lógica para manejar la solicitud POST, por ejemplo:
      const { data, error } = await supabase
        .from('tu_tabla')
        .select('*');

      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error al conectar a Supabase', error: error.message })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error interno', error: error.message })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Método no permitido' })
  };
};
