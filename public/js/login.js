import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wuclrdkmfhxwguvjflig.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Obtener el formulario y agregar el evento de envío
const form = document.getElementById('registro-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener los valores del formulario
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const empresaId = document.getElementById('empresa').value;

  if (!empresaId) {
    alert('Por favor, selecciona una empresa.');
    return;
  }

  // Crear el usuario en Supabase Auth
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert('Error: ' + error.message);
    return;
  }

  // Si la creación fue exitosa, insertamos los datos en la tabla 'usuarios' junto con el id de la empresa
  const { data, errorInsert } = await supabase
    .from('usuarios')
    .insert([
      {
        id: user.id, // ID del usuario creado en Supabase Auth
        nombre,
        email,
        empresa_id: empresaId, // Asociamos la empresa seleccionada
        created_at: new Date(),
      },
    ]);

  if (errorInsert) {
    alert('Error al insertar datos: ' + errorInsert.message);
  } else {
    alert('¡Usuario creado con éxito!');
    // Aquí puedes redirigir al usuario a otra página, como la página de login
    window.location.href = 'login.html'; // Por ejemplo, redirigir al login
  }
});

// Cargar las empresas en el formulario
async function cargarEmpresas() {
  const { data: empresas, error } = await supabase
    .from('empresas') // Supone que tienes una tabla 'empresas'
    .select('id, nombre');

  if (error) {
    console.error('Error al cargar empresas:', error.message);
    return;
  }

  const selectEmpresa = document.getElementById('empresa');
  empresas.forEach((empresa) => {
    const option = document.createElement('option');
    option.value = empresa.id;
    option.textContent = empresa.nombre;
    selectEmpresa.appendChild(option);
  });
}

// Llamar a la función para cargar las empresas cuando la página cargue
cargarEmpresas();
