// Funciones de ejemplo - sustituir con lógica real de Supabase
function registrarEntrada() {
    console.log('Registrando entrada...');
    // Implementar lógica de Supabase
}

function registrarSalida() {
    console.log('Registrando salida...');
    // Implementar lógica de Supabase
}

function cambiarPassword() {
    console.log('Cambiar contraseña');
    // Implementar modal o página de cambio de contraseña
}

function generarInforme() {
    console.log('Generando informe');
    // Implementar generación de informes
}

function LogOut() {
    console.log('Cerrando sesión');
    // Implementar cierre de sesión con Supabase
}

// Función para cargar datos del usuario
async function cargarDatosUsuario() {
    try {
        // Obtener usuario de Supabase
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
            document.getElementById('userName').textContent = user.user_metadata.name || 'Usuario';
            document.getElementById('userEmail').textContent = user.email;
        }
    } catch (error) {
        console.error('Error cargando datos de usuario:', error);
    }
}

// Cargar datos al iniciar ```javascript
document.addEventListener('DOMContentLoaded', cargarDatosUsuario);
