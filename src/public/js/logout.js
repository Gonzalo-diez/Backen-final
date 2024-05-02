const logout = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log("Token antes de enviarlo al servidor:", token);
    console.log("ID del usuario antes de enviarlo al servidor:", userId);

    try {
        const response = await fetch('http://localhost:8080/api/sessions/logout', {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log('Logout exitoso');
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.replace("/api/sessions/login");
        } else {
            const errorMessage = await response.text();
            console.error('Error en el logout:', errorMessage);
        }
    } catch (error) {
        console.error('Error en el logout:', error);
    }
};

// Función para manejar el evento de clic en el botón de logout
const handleLogoutClick = () => {
    logout();
};

// Agregar un event listener al botón de logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton'); // ID del botón de logout en tu HTML
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogoutClick);
    }
});
