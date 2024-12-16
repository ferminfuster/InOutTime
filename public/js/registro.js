// Configuración de Supabase
const SUPABASE_URL = 'https://wuclrdkmfhxwguvjflig.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y2xyZGttZmh4d2d1dmpmbGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjMxOTMsImV4cCI6MjA0OTQ5OTE5M30.iMtQIzRNkbMMvrGJuz-tMP4PBqmJ9BsEoaZv10xb_hA';

// Inicialización de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class RegistroManager {
    constructor() {
        this.form = document.getElementById('registro-form');
        this.nombreInput = document.getElementById('nombre');
        this.apellidosInput = document.getElementById('apellidos');
        this.empresaInput = document.getElementById('empresa');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirm-password');
        this.mensajeRegistro = document.getElementById('mensaje-registro');

        this.initEventListeners();
    }

    initEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegistro();
        });
    }

    // Validaciones
    validateForm() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const nombre = this.nombreInput.value.trim();
        const apellidos = this.apellidosInput.value.trim();
        const empresa = this.empresaInput.value.trim();

        // Validaciones
        if (!this.validateEmail(email)) {
            this.showMensaje('Por favor, introduce un email válido', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.showMensaje('Las contraseñas no coinciden', 'error');
            return false;
        }

        if (!nombre || !apellidos || !empresa) {
            this.showMensaje('Todos los campos son obligatorios', 'error');
            return false;
        }

        return true;
    }

    // Validación de email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Método de registro
    async handleRegistro() {
        // Validar formulario
        if (!this.validateForm()) return;

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const nombre = this.nombreInput.value.trim();
        const apellidos = this.apellidosInput.value.trim();
        const empresa = this.empresaInput.value.trim();

        try {
            // 1. Registro en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Datos adicionales del perfil
                    data: {
                        nombre,
                        apellidos,
                        empresa
                    }
                }
            });

            if (authError) {
                throw authError;
            }

            // Verificar estado del registro
            if (authData.user) {
                this.showMensaje('Registro completado. Por favor, verifica tu correo.', 'success');
                
                // Limpiar formulario
                this.form.reset();

                // Redirigir después de un tiempo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }

        } catch (error) {
            console.error('Error de registro:', error);
            
            // Mapeo de errores comunes
            const errorMap = {
                'user_already_exists': 'El usuario ya existe',
                'invalid_email': 'Email inválido',
                'weak_password': 'Contraseña demasiado débil'
            };

            const errorMessage = errorMap[error.message] || error.message || 'Error en el registro';
            this.showMensaje(errorMessage, 'error');
        }
    }

    // Mostrar mensajes
    showMensaje(mensaje, tipo = 'error') {
        this.mensajeRegistro.innerHTML = `
            <div class="${tipo}-mensaje">
                ${mensaje}
            </div>
        `;
        this.mensajeRegistro.style.display = 'block';
    }
}

// Inicial ```javascript
// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new RegistroManager();
});