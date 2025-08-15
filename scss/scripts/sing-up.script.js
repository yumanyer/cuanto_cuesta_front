document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.getElementById('signUpForm');
  const fullNameInput = document.getElementById('fullName');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const contentBehind = document.getElementById('contentBehind');
  const loader = document.getElementById('loader');
  const welcomeMessage = document.createElement('div');
  contentBehind.appendChild(welcomeMessage);

  const container = document.querySelector('.container');
  const leftDoor = document.querySelector('.door-left');
  const rightDoor = document.querySelector('.door-right');

  // Elementos para indicador de fortaleza de contraseña
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const passwordStrength = document.getElementById('passwordStrength');

  // Función para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para evaluar fortaleza de contraseña
  function evaluatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('al menos 8 caracteres');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('letras minúsculas');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('letras mayúsculas');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('números');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('símbolos especiales');

    return { score, feedback };
  }

  // Función para actualizar indicador de fortaleza
  function updatePasswordStrength(password) {
    if (!password) {
      passwordStrength.className = 'password-strength';
      strengthText.textContent = 'Ingresa una contraseña';
      return;
    }

    const { score, feedback } = evaluatePasswordStrength(password);
    
    passwordStrength.className = 'password-strength';
    
    if (score <= 2) {
      passwordStrength.classList.add('strength-weak');
      strengthText.textContent = `Débil - Necesita: ${feedback.slice(0, 2).join(', ')}`;
    } else if (score === 3) {
      passwordStrength.classList.add('strength-fair');
      strengthText.textContent = `Regular - Necesita: ${feedback.join(', ')}`;
    } else if (score === 4) {
      passwordStrength.classList.add('strength-good');
      strengthText.textContent = 'Buena - Casi perfecta';
    } else {
      passwordStrength.classList.add('strength-strong');
      strengthText.textContent = 'Excelente - Muy segura';
    }
  }

  // Función para animar campo completado
  function animateFieldComplete(field) {
    field.classList.add('field-complete');
    setTimeout(() => {
      field.classList.remove('field-complete');
    }, 300);
  }

  // Función para generar nombre de usuario sugerido
  function generateUsername(fullName) {
    if (!fullName) return '';
    
    const names = fullName.toLowerCase().split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    
    // Diferentes patrones para generar username
    const patterns = [
      firstName + lastName,
      firstName + lastName.charAt(0),
      firstName.charAt(0) + lastName,
      firstName + '_' + lastName,
      firstName + lastName + Math.floor(Math.random() * 100)
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  // Event listeners para validación en tiempo real
  fullNameInput.addEventListener('blur', () => {
    if (fullNameInput.value.trim()) {
      animateFieldComplete(fullNameInput.parentElement);
      
      // Sugerir username si está vacío
      if (!usernameInput.value.trim()) {
        const suggestedUsername = generateUsername(fullNameInput.value.trim());
        usernameInput.placeholder = `Sugerencia: ${suggestedUsername}`;
      }
    }
  });

  usernameInput.addEventListener('input', () => {
    const username = usernameInput.value.trim();
    if (username.length >= 3) {
      animateFieldComplete(usernameInput.parentElement);
    }
  });

  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (isValidEmail(email)) {
      animateFieldComplete(emailInput.parentElement);
      errorMessage.textContent = '';
    } else if (email) {
      errorMessage.textContent = 'Por favor, ingresa un email válido';
    }
  });

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    updatePasswordStrength(password);
    
    if (password.length >= 8) {
      animateFieldComplete(passwordInput.parentElement);
    }
    
    // Validar confirmación si ya hay algo escrito
    if (confirmPasswordInput.value) {
      validatePasswordMatch();
    }
  });

  function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (password === confirmPassword && password.length > 0) {
      animateFieldComplete(confirmPasswordInput.parentElement);
      errorMessage.textContent = '';
      return true;
    } else if (confirmPassword.length > 0) {
      errorMessage.textContent = 'Las contraseñas no coinciden';
      return false;
    }
    return false;
  }

  confirmPasswordInput.addEventListener('input', validatePasswordMatch);

  // Manejo del formulario
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    errorMessage.textContent = '';
    successMessage.textContent = '';

    // Obtener valores
    const fullName = fullNameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const termsAccepted = termsCheckbox.checked;

    // Validaciones
    const errors = [];

    if (!fullName) errors.push('El nombre completo es requerido');
    if (!username || username.length < 3) errors.push('El nombre de usuario debe tener al menos 3 caracteres');
    if (!email || !isValidEmail(email)) errors.push('Ingresa un email válido');
    
    const { score } = evaluatePasswordStrength(password);
    if (score < 3) errors.push('La contraseña debe ser más segura');
    
    if (password !== confirmPassword) errors.push('Las contraseñas no coinciden');
    if (!termsAccepted) errors.push('Debes aceptar los términos y condiciones');

    if (errors.length > 0) {
      errorMessage.textContent = errors[0]; // Mostrar el primer error
      return;
    }

    // Si todo está bien, proceder con la animación
    successMessage.textContent = '¡Validación exitosa! Creando tu cuenta...';

    // 1. Ocultar formulario con animación
    signUpForm.classList.add('slide-out-top');

    // 2. Abrir puertas después de un pequeño delay
    setTimeout(() => {
      container.classList.add('doors-opening');
      leftDoor.classList.add('door-open-left');
      rightDoor.classList.add('door-open-right');
    }, 400);

    // 3. Mostrar loader y mensaje personalizado
    setTimeout(() => {
      loader.style.display = 'block';
      welcomeMessage.innerHTML = `
        <div style="color: white; text-align:center;">
          <h2 style="margin-bottom: 1rem;">¡Bienvenido/a, ${fullName}!</h2>
          <p style="font-size: 1.2rem; opacity: 0.8; margin-top:10em;">Estamos creando tu cuenta con el usuario: <strong>${username}</strong></p>
          <p style="font-size: 1rem; opacity: 0.6;">Configurando tu perfil y preparando todo para ti...</p>
        </div>
      `;
      contentBehind.classList.add('visible');
    }, 1200);

    // 4. Simular creación de cuenta y redirección
// 4. Simular creación de cuenta y redirección
setTimeout(() => {
  loader.style.display = 'none';
  welcomeMessage.innerHTML = `
    <div style="color: white; text-align: center;">
      <h2 style="color: #28a745; margin-bottom: 1rem;">¡Cuenta creada exitosamente! ✅</h2>
      <p style="font-size: 1.2rem;">¡Hola ${fullName}! Tu cuenta está lista.</p>
      <p style="font-size: 1rem; opacity: 0.8;">Redirigiendo al panel principal...</p>
    </div>
  `;
  
  // Aquí podrías redirigir a otra página
  setTimeout(() => {
    // window.location.href = '/dashboard.html';
    alert('¡Registro completado! (En una aplicación real, aquí se redirigiría al dashboard)');
  }, 2000);

}, 4000); 

  });

  // Funcionalidad del botón "Ya tengo cuenta"
  document.querySelector('.button2').addEventListener('click', () => {
    // En una aplicación real, esto redirigiría al login
    if (confirm('¿Deseas ir a la página de inicio de sesión?')) {
      // window.location.href = 'login.html';
      alert('Redirigiendo al login... (funcionalidad simulada)');
    }
  });

  // Efecto de escritura automática para el placeholder del username
  let placeholderIndex = 0;
  const placeholderTexts = [
    'Nombre de usuario',
    'Ej: juan_perez',
    'Ej: maria2024',
    'Ej: alex_dev'
  ];

  setInterval(() => {
    if (!usernameInput.value && document.activeElement !== usernameInput) {
      usernameInput.placeholder = placeholderTexts[placeholderIndex];
      placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length;
    }
  }, 3000);

  // Efecto de partículas en el fondo (sutil)
  function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 2px;
      height: 2px;
      background: rgba(0, 123, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      left: ${Math.random() * 100}vw;
      top: 100vh;
      animation: float-up 8s linear forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 8000);
  }

  // Agregar estilos para la animación de partículas
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      to {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Crear partículas ocasionalmente
  setInterval(createParticle, 2000);
});
