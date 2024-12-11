import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wuclrdkmfhxwguvjflig.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Referencia al formulario y al mensaje de error
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Función para manejar el login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Intenta autenticar al usuario con Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            // Si hay un error (por ejemplo, credenciales incorrectas), muestra el mensaje de error
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } else {
            // Si la autenticación es exitosa, redirige a otra página (por ejemplo, dashboard)
            window.location.href = 'dashboard.html'; // Cambia la ruta según corresponda
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        errorMessage.textContent = 'Ocurrió un error al intentar iniciar sesión';
        errorMessage.style.display = 'block';
    }
});
