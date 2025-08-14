        // Array para almacenar los productos
        let products = []; // Inicialmente vacío, los datos de ejemplo se cargarán desde el JS

        // Función para cargar datos de ejemplo si el array está vacío
        function loadSampleData() {
            if (products.length === 0) {
                products = [
                    { id: 1, name: "Camiseta Básica Algodón", price: 15.50, quantity: 150, unit: "Unidad" },
                    { id: 2, name: "Pantalón Vaquero Slim Fit", price: 45.00, quantity: 80, unit: "Unidad" },
                    { id: 3, name: "Zapatos Deportivos Running", price: 75.99, quantity: 50, unit: "Unidad" },
                    { id: 4, name: "Calcetines Deportivos (Pack 3)", price: 12.75, quantity: 200, unit: "Paquete" },
                    { id: 5, name: "Chaqueta Impermeable Ligera", price: 90.00, quantity: 30, unit: "Unidad" }
                ];
            }
        }

        // Función para agregar un nuevo producto
        function addProduct() {
            const nameInput = document.getElementById('productName');
            const priceInput = document.getElementById('productPrice');
            const quantityInput = document.getElementById('productQuantity');
            const unitInput = document.getElementById('productUnit');

            const name = nameInput.value.trim();
            const price = parseFloat(priceInput.value);
            const quantity = parseInt(quantityInput.value);
            const unit = unitInput.value;

            // Validación simple de campos
            if (!name || isNaN(price) || isNaN(quantity) || !unit) {
                showToast('Por favor, completa todos los campos correctamente.', 'matterraw-toast-warning');
                return; // Detiene la función si hay campos vacíos o inválidos
            }

            // Crea un nuevo ID (simple incremento, idealmente usar UUIDs en producción)
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

            const newProduct = {
                id: newId,
                name: name,
                price: price,
                quantity: quantity,
                unit: unit
            };

            products.push(newProduct);
            updateProductTable();
            updateStats();
            clearForm();
            showToast('Producto agregado con éxito.', 'matterraw-toast-success');
        }

        // Función para limpiar el formulario después de agregar un producto
        function clearForm() {
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productQuantity').value = '';
            document.getElementById('productUnit').value = 'Unidad'; // Reset a la opción por defecto
        }

        // Función para actualizar la tabla de productos
        function updateProductTable() {
            const tbody = document.getElementById('productTableBody');
            tbody.innerHTML = ''; // Limpia el contenido actual de la tabla

            products.forEach((product, index) => {
                const row = document.createElement('tr');
                // Animación de entrada sutil para cada fila
                row.style.animation = `matterrawSlideInUp 0.5s ease forwards`;
                row.style.animationDelay = `${index * 0.1}s`; // Retraso escalonado

                row.innerHTML = `
                    <td><strong>${product.id}</strong></td>
                    <td>${product.name}</td>
                    <td><span class="matterraw-price-badge">$${product.price.toFixed(2)}</span></td>
                    <td><span class="matterraw-quantity-badge">${product.quantity}</span></td>
                    <td><span class="matterraw-unit-badge">${product.unit}</span></td>
                    <td>
                        <div class="matterraw-action-buttons">
                            <button class="matterraw-btn-icon matterraw-btn-edit" onclick="editProduct(${product.id})" title="Editar Producto">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="matterraw-btn-icon matterraw-btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar Producto">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Actualiza el contador de productos en el título de la tabla
            document.getElementById('productCount').textContent = products.length;
        }

        // Función para actualizar las estadísticas
        function updateStats() {
            const totalProducts = products.length;
            // Calcula el valor total del inventario sumando (precio * cantidad)
            const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            // Cuenta los productos con stock bajo (definido como menos de 50 unidades en este ejemplo)
            const lowStock = products.filter(product => product.quantity < 50).length;

            // Actualiza los elementos de las estadísticas con animaciones
            animateNumber('totalProducts', totalProducts);
            animateNumber('totalValue', `$${totalValue.toFixed(2)}`);
            animateNumber('lowStock', lowStock);
        }

        // Función para animar la actualización de números (con un efecto de "conteo")
        function animateNumber(elementId, finalValue) {
            const element = document.getElementById(elementId);
            // Extrae solo la parte numérica del valor actual para la animación
            const startValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0; 
            const duration = 500; // Duración de la animación en milisegundos

            let startTime = null;
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                // Calcula el valor actual interpolando entre startValue y finalValue
                const currentValue = Math.floor(startValue + (finalValue - startValue) * Math.min(progress / duration, 1));

                // Formatea el valor si es necesario (ej: números con decimales)
                if (typeof finalValue === 'string' && finalValue.includes('.')) {
                    const parts = finalValue.split('.');
                    const integerPart = parts[0].replace(/[^0-9]/g, ''); 
                    const decimalPart = parts[1];
                    // Formatea el número para que mantenga el formato original (ej: $0.00)
                    element.textContent = `${integerPart.padStart(startValue.toString().length, '0').slice(0, -decimalPart.length)}${currentValue}.${decimalPart}`;
                } else {
                    element.textContent = currentValue; // Muestra el número entero
                }

                if (progress < duration) {
                    requestAnimationFrame(step); // Continúa la animación si no ha terminado
                } else {
                    element.textContent = finalValue; // Asegura el valor final exacto al completar
                }
            };

            requestAnimationFrame(step); // Inicia la animación
        }

        // Función para editar un producto (carga los datos en el formulario)
        function editProduct(id) {
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex > -1) {
                const product = products[productIndex];
                
                // Carga los datos del producto en los campos del formulario
                document.getElementById('productName').value = product.name;
                document.getElementById('productPrice').value = product.price.toFixed(2);
                document.getElementById('productQuantity').value = product.quantity;
                document.getElementById('productUnit').value = product.unit;
                
                // Elimina el producto actual del array para permitir su reingreso con la versión editada
                products.splice(productIndex, 1);
                
                // Muestra un mensaje informativo
                showToast('Producto listo para editar.', 'matterraw-toast-info');
                
                // Actualiza la tabla y estadísticas inmediatamente después de quitar el producto
                updateProductTable();
                updateStats();
            }
        }

        // Función para eliminar un producto
        function deleteProduct(id) {
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex > -1) {
                // Anima la fila antes de eliminarla visualmente
                const rowToDelete = document.querySelector(`tbody tr:nth-child(${productIndex + 1})`);
                if (rowToDelete) {
                    rowToDelete.style.animation = `matterrawFadeOut 0.5s ease forwards`;
                }

                // Elimina el producto del array después de un breve retraso para dar tiempo a la animación
                setTimeout(() => {
                    products.splice(productIndex, 1);
                    updateProductTable(); // Re-renderiza la tabla
                    updateStats();        // Re-calcula las estadísticas
                    showToast('Producto eliminado correctamente.', 'matterraw-toast-warning');
                }, 500); // El tiempo debe coincidir con la duración de la animación 'fadeOut'
            }
        }

        // Función para mostrar mensajes de notificación (toasts)
        function showToast(message, type) {
            const toast = document.createElement('div');
            toast.className = `matterraw-toast ${type}`; // Combina clases para estilo y tipo
            toast.innerHTML = `<i class="${getIconClass(type)}"></i> ${message}`; // Añade un icono según el tipo
            document.body.appendChild(toast);

            // Aplica la clase 'show' para activar la animación de aparición
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);

            // Programa la desaparición del toast después de unos segundos
            setTimeout(() => {
                toast.classList.remove('show');
                // Elimina el elemento del DOM después de que la animación de salida haya terminado
                toast.addEventListener('transitionend', () => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                });
            }, 4000); // Duración del toast en pantalla
        }

        // Función auxiliar para obtener la clase de icono correcta para cada tipo de toast
        function getIconClass(type) {
            switch(type) {
                case 'matterraw-toast-success': return 'fas fa-check-circle';
                case 'matterraw-toast-error': return 'fas fa-times-circle';
                case 'matterraw-toast-warning': return 'fas fa-exclamation-triangle';
                case 'matterraw-toast-info': return 'fas fa-info-circle';
                default: return 'fas fa-bell'; // Icono por defecto si el tipo no coincide
            }
        }

        // Función para hacer scroll suave hasta la parte superior de la página
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Activa el scroll suave
            });
        }

        // Evento DOMContentLoaded: se ejecuta cuando todo el HTML ha sido cargado y parseado
        document.addEventListener('DOMContentLoaded', function() {
            loadSampleData(); // Carga datos de ejemplo si el array de productos está vacío
            updateProductTable(); // Renderiza la tabla con los productos
            updateStats();        // Actualiza las estadísticas iniciales

            // Aplica animaciones de entrada a las tarjetas principales para un efecto visual al cargar
            const cards = document.querySelectorAll('.matterraw-glass-card');
            cards.forEach((card, index) => {
                card.style.animation = `matterrawSlideInUp 0.6s ease forwards`;
                card.style.animationDelay = `${index * 0.2}s`; // Retraso escalonado para cada tarjeta
            });

            // Muestra un mensaje de bienvenida al usuario después de un breve retraso
            setTimeout(() => {
                showToast('Bienvenido al sistema de gestión de inventario.', 'matterraw-toast-info');
            }, 1500); // Espera 1.5 segundos antes de mostrar el mensaje
        });
