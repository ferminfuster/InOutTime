// Configura tu SupaBase con la URL y API Key de tu proyecto
const supabaseUrl = 'https://tu-url.supabase.co'; // Reemplaza con tu URL de SupaBase
const supabaseKey = 'tu-clave-api';               // Reemplaza con tu API Key
const supabase = createClient(supabaseUrl, supabaseKey);

// Evento de cerrar sesión
document.getElementById('logoutButton').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// Evento para registrar una acción
async function registrarAccion(accion) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        alert('No estás autenticado.');
        return;
    }

    const { error } = await supabase
        .from('registros')
        .insert([
            {
                usuario_id: user.data.user.id,
                accion: accion,
                lugar: 'empresa' // O modifica dinámicamente según tus necesidades
            }
        ]);

    if (error) {
        console.error('Error al registrar:', error.message);
        alert('Error al registrar la acción.');
    } else {
        alert(`Acción de ${accion} registrada con éxito.`);
    }
}

// Asignar eventos a los botones
document.getElementById('entradaButton').addEventListener('click', () => registrarAccion('Entrada'));
document.getElementById('salidaButton').addEventListener('click', () => registrarAccion('Salida'));
document.getElementById('incidenciaButton').addEventListener('click', () => registrarAccion('Incidencia'));

// Evento para cambiar password
document.getElementById('changePasswordButton').addEventListener('click', () => {
    const newPassword = prompt('Introduce tu nueva contraseña:');
    if (newPassword) {
        supabase.auth.updateUser({ password: newPassword })
            .then(({ error }) => {
                if (error) {
                    alert('Error al cambiar la contraseña.');
                } else {
                    alert('Contraseña cambiada con éxito.');
                }
            });
    }
});

// Evento para descargar informe
document.getElementById('downloadReportButton').addEventListener('click', async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        alert('No estás autenticado.');
        return;
    }

    const { data, error } = await supabase
        .from('registros')
        .select('*')
        .eq('usuario_id', user.data.user.id);

    if (error) {
        console.error('Error al obtener registros:', error.message);
        alert('Error al descargar el informe.');
    } else {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Acción,Fecha y Hora,Lugar\n"
            + data.map(row => `${row.id},${row.accion},${row.fecha_hora},${row.lugar}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reporte_registros.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
