// Configuración de Supabase
const SUPABASE_URL = 'https://wuclrdkmfhxwguvjflig.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y2xyZGttZmh4d2d1dmpmbGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MjMxOTMsImV4cCI6MjA0OTQ5OTE5M30.iMtQIzRNkbMMvrGJuz-tMP4PBqmJ9BsEoaZv10xb_hA';


// Inicialización de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class RegistroEmpresaManager {
    constructor() {
        this.form = document.getElementById('registro-empresa-form');
        this.nombreEmpresaInput = document.getElementById('nombre-empresa');
        this.direccionEmpresaInput = document.getElementById('direccion-empresa');
        this.emailEmpresaInput = document.getElementById('email-empresa');
        this.telefonoEmpresaInput = document.getElementById('telefono-empresa');
        this.cifInput = document.getElementById('cif');
        this.mensajeRegistro = document.getElementById('mensaje-registro-empresa');

        this.initEventListeners();
    }

    initEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegistroEmpresa();
        });
    }

    // Validaciones
    validateForm() {
        const nombreEmpresa = this.nombreEmpresaInput.value.trim();
        const direccionEmpresa = this.direccionEmpresaInput.value.trim();
        const emailEmpresa = this.emailEmpresaInput.value.trim();
        const telefonoEmpresa = this.telefonoEmpresaInput.value.trim();
        const cif = this.cifInput.value.trim();

        // Validaciones
        if (!this.validateEmail(emailEmpresa)) {
            this.showMensaje('Por favor, introduce un email de empresa válido', 'error');
            return false;
        }

        if (!this.validateTelefono(telefonoEmpresa)) {
            this.showMensaje('Por favor, introduce un teléfono válido', 'error');
            return false;
        }

        if (!this.validateCIF(cif)) {
            this.showMensaje('Por favor, introduce un CIF/NIF válido', 'error');
            return false;
        }

        return true;
    }

    // Validación de email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validación de teléfono
    validateTelefono(telefono) {
        const re = /^[0-9]{9}$/;
        return re.test(telefono);
    }

    // Validación de CIF/NIF
    validateCIF(cif) {
        const validadorCIF = /^[ABCDEFGHJNPQRSUVW]{1}\d{7}[0-9A-J]$/;
        return validadorCIF.test( cif);
    }

    // Método de registro
    async handleRegistroEmpresa() {
        // Validar formulario
        if (!this.validateForm()) return;

        const nombreEmpresa = this.nombreEmpresaInput.value.trim();
        const direccionEmpresa = this.direccionEmpresaInput.value.trim();
        const emailEmpresa = this.emailEmpresaInput.value.trim();
        const telefonoEmpresa = this.telefonoEmpresaInput.value.trim();
        const cif = this.cifInput.value.trim();
        const sector = this.sectorInput.value;
        const numEmpleados = this.numEmpleadosInput.value;
        const fechaFundacion = this.fechaFundacionInput.value;
        const observaciones = this.observacionesInput.value;

        try {
            // 1. Registro en la tabla empresas
            const { data, error } = await supabase
                .from('empresas')
                .insert([
                    {
                        nombre: nombreEmpresa,
                        direccion_empresa: direccionEmpresa,
                        email_empresa: emailEmpresa,
                        telefono_empresa: telefonoEmpresa,
                        cif: cif,
                        sector: sector,
                        num_empleados: numEmpleados,
                        fecha_fundacion: fechaFundacion,
                        observaciones: observaciones
                    }
                ]);

            if (error) {
                throw error;
            }

            // Verificar estado del registro
            if (data) {
                this.showMensaje('Registro de empresa completado con éxito.', 'success');
                
                // Limpiar formulario
                this.form.reset();

                // Redirigir después de un tiempo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }

        } catch (error) {
            console.error('Error de registro de empresa:', error);
            this.showMensaje('Error en el registro de la empresa: ' + error.message, 'error');
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
    new RegistroEmpresaManager();
});