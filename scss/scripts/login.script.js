document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');
  const contentBehind = document.getElementById('contentBehind');
  const loader = document.getElementById('loader');
  const welcomeMessage = document.createElement('div'); // contenedor dinámico para el mensaje
  contentBehind.appendChild(welcomeMessage);

  const container = document.querySelector('.container');
  const leftDoor = document.querySelector('.door-left');
  const rightDoor = document.querySelector('.door-right');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Limpiar mensajes de error anteriores
    errorMessage.textContent = '';
    usernameInput.style.borderColor = '';
    passwordInput.style.borderColor = '';

    if (!username || !password) {
      errorMessage.textContent = 'Por favor, completa ambos campos.';
      if (!username) usernameInput.style.borderColor = '#dc3545';
      if (!password) passwordInput.style.borderColor = '#dc3545';
      return;
    }

    // 1. Ocultar formulario con animación
    loginForm.classList.add('slide-out-top');

    // 2. Abrir puertas después de un pequeño delay
    setTimeout(() => {
      container.classList.add('doors-opening');
      leftDoor.classList.add('door-open-left');
      rightDoor.classList.add('door-open-right');
    }, 400);

    // 3. Mostrar loader y mensaje de validación
    setTimeout(() => {
      loader.style.display = 'block';
      welcomeMessage.innerHTML = `<h2 style="color: white; font-size: smaller; margin-bottom: 15rem;">Estamos validando sus credenciales, ${username}...</h2>`;
      contentBehind.classList.add('visible');
    }, 1200);

     //4. Simular validación de backend
    setTimeout(() => {
      loader.style.display = 'none';
      // Redirigir a matterRaw.html
      window.location.href = '/public/scss/pages/matterRaw.html';
    }, 3200); // 2 segundos de simulación de validación
  });

  document.querySelector('.button3').addEventListener('click', () => {
    alert('Funcionalidad de recuperación de contraseña no implementada.');
  });
});
