// Variables para los elementos del formulario
const registroForm = document.getElementById('registro-empresa-form');
const nombreEmpresaInput = document.getElementById('nombre-empresa');
const direccionEmpresaInput = document.getElementById('direccion-empresa');
const emailEmpresaInput = document.getElementById('email-empresa');
const telefonoEmpresaInput = document.getElementById('telefono-empresa');
const cifInput = document.getElementById('cif');
const mensajeRegistroEmpresa = document.getElementById('mensaje-registro-empresa');

// Función para mostrar mensajes al usuario
function showMensaje(mensaje, tipo) {
    mensajeRegistroEmpresa.textContent = mensaje;
    if (tipo === 'error') {
        mensajeRegistroEmpresa.style.color = 'red';
    } else {
        mensajeRegistroEmpresa.style.color = 'green';
    }
}

// Función para validar un campo con un regex
function validateField(value, regex, errorMessage) {
    if (!regex.test(value)) {
        showMensaje(errorMessage, 'error');
        return false;
    }
    return true;
}

// Validación del formulario
function validateForm() {
    const nombreEmpresa = nombreEmpresaInput.value.trim();
    const direccionEmpresa = direccionEmpresaInput.value.trim();
    const emailEmpresa = emailEmpresaInput.value.trim();
    const telefonoEmpresa = telefonoEmpresaInput.value.trim();
    const cif = cifInput.value.trim();

    // Validación de email
    if (!validateField(emailEmpresa, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, introduce un email de empresa válido')) return false;
    
    // Validación de teléfono (9 dígitos)
    if (!validateField(telefonoEmpresa, /^[0-9]{9}$/, 'Por favor, introduce un teléfono válido')) return false;
    
    // Validación de CIF/NIF (Formato típico español)
    if (!validateField(cif, /^[ABCDEFGHJNPQRSUVW]{1}\d{7}[0-9A-J]$/, 'Por favor, introduce un CIF/NIF válido')) return false;
    
    return true;
}

// Función para manejar el registro de la empresa
async function handleRegistroEmpresa(event) {
    event.preventDefault();

    // Validamos el formulario antes de continuar
    if (!validateForm()) {
        return;
    }

    // Obtenemos los valores del formulario
    const nombreEmpresa = nombreEmpresaInput.value.trim();
    const direccionEmpresa = direccionEmpresaInput.value.trim();
    const emailEmpresa = emailEmpresaInput.value.trim();
    const telefonoEmpresa = telefonoEmpresaInput.value.trim();
    const cif = cifInput.value.trim();

    // Conexión con Supabase para insertar los datos de la empresa
// Configuración de Supabase
const SUPABASE_URL = 'https://wuclrdkmfhxwguvjflig.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y2xyZGttZmh4d2d1dmpmbGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjMxOTMsImV4cCI6MjA0OTQ5OTE5M30.iMtQIzRNkbMMvrGJuz-tMP4PBqmJ9BsEoaZv10xb_hA';

const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('empresas') // Nombre de la tabla en Supabase
        .insert([
            {
                nombre_empresa: nombreEmpresa,
                direccion_empresa: direccionEmpresa,
                email_empresa: emailEmpresa,
                telefono_empresa: telefonoEmpresa,
                cif: cif
            }
        ]);

    if (error) {
        if (error.code === '23505') { // Código para conflicto de datos (por ejemplo, empresa ya existe)
            showMensaje('Esta empresa ya está registrada.', 'error');
        } else {
            showMensaje('Error al registrar la empresa: ' + error.message, 'error');
        }
    } else {
        showMensaje('La empresa se ha registrado exitosamente.', 'success');
        // Limpiar el formulario después del registro
        registroForm.reset();
    }
}

// Asignar el evento de submit al formulario
registroForm.addEventListener('submit', handleRegistroEmpresa);
