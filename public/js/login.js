// js/login.js
// Configuración de Supabase
const supabaseUrl = 'https://wuclrdkmfhxwguvjflig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y2xyZGttZmh4d2d1dmpmbGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjMxOTMsImV4cCI6MjA0OTQ5OTE5M30.iMtQIzRNkbMMvrGJuz-tMP4PBqmJ9BsEoaZv10xb_hA';

// Inicializar Supabase
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función de validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Función de validación de contraseña
function validatePassword(password) {
    return password.length >= 6;
}

// Mapeo de mensajes de error
const errorMessages = {
    'Invalid login credentials': 'Correo o contraseña incorrectos',
    'user_not_found': 'Usuario no encontrado',
    'invalid_email': 'Formato de email inválido',
};

// Función para obtener mensaje de error amigable
function getErrorMessage(error) {
    return errorMessages[error.message] || error.message || 'Error al iniciar sesión';
}

// Evento de carga del DOM
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageEl = document.getElementById('error-message');

    // Ocultar mensaje de error por defecto
    errorMessageEl.style.display = 'none';

    // Manejador de inicio de sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar mensaje de error
        errorMessageEl.textContent = '';
        errorMessageEl.style.display = 'none';

        // Obtener valores
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validaciones
        if (!validateEmail(email)) {
            errorMessageEl.textContent = 'Por favor, introduce un email válido';
            errorMessageEl.style.display = 'block';
            return;
        }

        if (!validatePassword(password)) {
            errorMessageEl.textContent = 'La contraseña debe tener al menos 6 caracteres';
            errorMessageEl.style.display = 'block';
            return;
        }

        try {
            // Intento de inicio de sesión
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            // Inicio de sesión exitoso
            console.log('Usuario autenticado:', data.user);
            
            // Redirigir al dashboard o página principal
            window.location.href = 'dashboard.html';
        } catch (error) {
            // Mostrar mensaje de error
            console.error('Error de inicio de sesión:', error);
            
            errorMessageEl.textContent = getErrorMessage(error);
            errorMessageEl.style.display = 'block';
        }
    });

    // Opcional: Manejo de recuperación de contraseña
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            errorMessageEl.textContent = 'Por favor, introduce un email válido para recuperar la contraseña';
            errorMessageEl.style.display = 'block';
            return;
        }

        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://tudominio.com/reset-password.html'
            });

            if (error) {
                throw error;
            }

            alert('Se ha enviado un enlace de recuperación de contraseña a tu correo');
        } catch (error) {
            console.error('Error al recuperar contraseña:', error);
            errorMessageEl.textContent = getErrorMessage(error);
            errorMessageEl.style.display = 'block';
        }
    });
});