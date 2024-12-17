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
            // 1. Hacer solicitud a la función de Netlify para registrar al usuario
            const response = await fetch('/.netlify/functions/getconect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    nombre,
                    apellidos,
                    empresa,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                this.showMensaje(result.message, 'success');
                // Limpiar formulario
                this.form.reset();

                // Redirigir después de un tiempo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                this.showMensaje(result.error, 'error');
            }
        } catch (error) {
            console.error('Error de registro:', error);
            this.showMensaje('Hubo un error al procesar tu solicitud', 'error');
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

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new RegistroManager();
});
