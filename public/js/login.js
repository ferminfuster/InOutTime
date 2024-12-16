// Configuración de Supabase
const SUPABASE_URL = 'https://wuclrdkmfhxwguvjflig.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y2xyZGttZmh4d2d1dmpmbGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjMxOTMsImV4cCI6MjA0OTQ5OTE5M30.iMtQIzRNkbMMvrGJuz-tMP4PBqmJ9BsEoaZv10xb_hA';

// Configuración de Supabase
//const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
//const SUPABASE_ANON_KEY = 'tu-clave-publica';

// Inicialización de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Clase para manejar Login
class LoginManager {
    constructor() {
        this.form = document.getElementById('login-form');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.errorContainer = document.getElementById('error-container');
        this.forgotPasswordLink = document.getElementById('forgot-password');

        this.initEventListeners();
    }

    initEventListeners() {
        // Listener de envío de formulario
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Listener de recuperación de contraseña
        this.forgotPasswordLink.addEventListener('click', () => this.handlePasswordReset());
    }

    // Método de validación de email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Método de validación de contraseña
    validatePassword(password) {
        return password.length >= 6;
    }

    // Método de login
    async handleLogin() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // Validaciones
        if (!this.validateEmail(email)) {
            this.showError('Por favor, introduce un email válido');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            // Intento de login
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Login exitoso
            this.handleSuccessfulLogin(data.user);

        } catch (error) {
            this.handleLoginError(error);
        }
    }

    // Método de recuperación de contraseña
    async handlePasswordReset() {
        const email = this.emailInput.value.trim();

        if (!this.validateEmail(email)) {
            this.showError('Introduce un email válido para recuperar contraseña');
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html'
            });

            if (error) throw error;

            this.showSuccess('Revisa tu correo para recuperar la contraseña');
        } catch (error) {
            this.handleLoginError(error);
        }
    }

    // Manejo de login exitoso
    handleSuccessfulLogin(user) {
        console.log('Usuario autenticado:', user);
        // Redirigir al dashboard o página principal
        window.location.href = 'dashboard.html';
    }

    // Mostrar errores
    showError(message) {
        this.errorContainer.innerHTML = `
            <div class="error-message">
                <i class="error-icon">⚠️</i>
                ${message}
            </div>
        `;
        this.errorContainer.style.display = 'block';
    }

    // Mostrar mensaje de éxito
    showSuccess(message) {
        this.errorContainer.innerHTML = `
            <div class="success-message">
                <i class="success-icon">✅</i>
                ${message}
            </div>
        `;
        this.errorContainer.style.display = 'block';
    }

    // Manejo de errores de login
    handleLoginError(error) {
        console.error('Error de login:', error);
        
        const errorMap = {
            'Invalid login credentials': 'Correo o contraseña incorrectos',
            'user_not_found': 'Usuario no encontrado',
            'invalid_email': 'Email inválido'
        };

        const errorMessage = errorMap[error.message] || error.message || 'Error de inicio de sesión';
        this.showError(errorMessage);
    }
}

// Inicializar Login Manager cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});