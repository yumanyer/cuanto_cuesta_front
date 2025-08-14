    document.addEventListener('DOMContentLoaded', () => {
      const loginForm = document.getElementById('loginForm');
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const errorMessage = document.getElementById('errorMessage');
      const contentBehind = document.getElementById('contentBehind');
      const container = document.querySelector('.container');
      const leftDoor = document.querySelector('.door-left');
      const rightDoor = document.querySelector('.door-right');

      // Simulación de credenciales correctas
      const CORRECT_USERNAME = 'admin';
      const CORRECT_PASSWORD = '123';

      loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Previene el envío del formulario por defecto

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Limpiar mensajes de error anteriores
        errorMessage.textContent = '';
        usernameInput.style.borderColor = ''; // Reset border color
        passwordInput.style.borderColor = ''; // Reset border color

        if (!username || !password) {
          errorMessage.textContent = 'Por favor, completa ambos campos.';
          if (!username) usernameInput.style.borderColor = '#dc3545'; // Color de error
          if (!password) passwordInput.style.borderColor = '#dc3545'; // Color de error
          return; // Detiene la ejecución si faltan campos
        }

        // Simulación de validación de credenciales
        if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
          // 1. Ocultar el formulario con la animación slide-out-top
          loginForm.classList.add('slide-out-top'); // Añade la clase de animación

          // 2. Iniciar la apertura de las puertas
          // Se añade un pequeño retraso para que la animación del formulario se vea primero
          setTimeout(() => {
            container.classList.add('doors-opening'); // Clase para activar la transición de las puertas
            leftDoor.classList.add('door-open-left');
            rightDoor.classList.add('door-open-right');
          }, 400); // El retraso (400ms) debe ser menor que la duración de la animación del formulario (500ms)

          // 3. Mostrar el contenido detrás de las puertas
          // Este setTimeout debe ser un poco más largo que la animación de las puertas
          setTimeout(() => {
            contentBehind.classList.add('visible');
          }, 1200); // Aproximadamente el tiempo total de la animación de las puertas + un poco más

        } else {
          errorMessage.textContent = 'Nombre de usuario o contraseña incorrectos.';
          usernameInput.style.borderColor = '#dc3545';
          passwordInput.style.borderColor = '#dc3545';
          passwordInput.value = ''; // Limpia la contraseña
        }
      });

      // Opcional: Añadir funcionalidad a los otros botones
      document.querySelector('.button2').addEventListener('click', () => {
        alert('Funcionalidad de registro no implementada.');
      });

      document.querySelector('.button3').addEventListener('click', () => {
        alert('Funcionalidad de recuperación de contraseña no implementada.');
      });
    });
