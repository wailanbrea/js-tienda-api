// URL base de la API Fake Store
const API_URL = 'https://fakestoreapi.com/products';

// Función para obtener todos los productos de la API
async function obtenerProductos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`);
        }
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error('Error al obtener productos desde la API:', error);
        return [];
    }
}

// Función para mostrar el carrusel con 3 productos aleatorios
function mostrarCarrusel(productos) {
    const carruselContenedor = document.getElementById('carrusel');
    const inner = document.getElementById('carousel-inner');
    const indicators = document.getElementById('carousel-indicators');
    if (!carruselContenedor || !inner || productos.length === 0) return;

    // Seleccionar 3 productos al azar sin repetir
    const productosAleatorios = [...productos]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    let itemsHTML = '';
    let indicatorsHTML = '';

    productosAleatorios.forEach((producto, index) => {
        const activeClass = index === 0 ? 'active' : '';
        const ariaCurrent = index === 0 ? 'aria-current="true"' : '';

        indicatorsHTML += `
            <button type="button" data-bs-target="#carrusel" data-bs-slide-to="${index}" class="${activeClass}" ${ariaCurrent} aria-label="Slide ${index + 1}"></button>
        `;

        itemsHTML += `
            <div class="carousel-item ${activeClass}">
                <img src="${producto.image}" class="d-block w-100" alt="${producto.title}">
                <div class="carousel-caption d-block">
                    <h5 class="fw-bold">${producto.title}</h5>
                    <p class="mb-2 fs-5 text-warning fw-semibold">$${producto.price.toFixed(2)}</p>
                    <button class="btn btn-primary btn-sm btn-ver-detalles" data-id="${producto.id}">Ver Detalles</button>
                </div>
            </div>
        `;
    });

    if (indicators) indicators.innerHTML = indicatorsHTML;
    inner.innerHTML = itemsHTML;
}

// Función para mostrar las ofertas (1º, 4º y 7º producto -> índices 0, 3, 6)
function mostrarOfertas(productos) {
    const contenedorOfertas = document.getElementById('ofertas');
    if (!contenedorOfertas || productos.length === 0) return;

    const indicesOfertas = [0, 3, 6];
    const productosOferta = indicesOfertas
        .map(indice => productos[indice])
        .filter(producto => Boolean(producto));

    let html = '';
    productosOferta.forEach((producto) => {
        const precioOriginal = (producto.price * 1.25).toFixed(2);
        html += `
            <div class="col">
                <div class="card h-100 shadow-sm position-relative">
                    <span class="badge bg-danger badge-oferta">OFERTA 20% OFF</span>
                    <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-secondary w-auto align-self-start mb-2">${producto.category}</span>
                        <h5 class="card-title text-truncate" title="${producto.title}">${producto.title}</h5>
                        <div class="mt-auto pt-3">
                            <div class="d-flex align-items-baseline gap-2 mb-3">
                                <span class="price-tag text-danger">$${producto.price.toFixed(2)}</span>
                                <span class="text-decoration-line-through text-muted small">$${precioOriginal}</span>
                            </div>
                            <button class="btn btn-outline-danger w-100 btn-ver-detalles" data-id="${producto.id}">
                                Ver Oferta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedorOfertas.innerHTML = html;
}

// Función para mostrar el catálogo completo de productos
function mostrarCatalogo(productos) {
    const contenedorCatalogo = document.getElementById('catalogo');
    if (!contenedorCatalogo || productos.length === 0) return;

    let html = '';
    productos.forEach((producto) => {
        html += `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                    <div class="card-body d-flex flex-column">
                        <small class="text-muted text-uppercase mb-1">${producto.category}</small>
                        <h6 class="card-title text-truncate" title="${producto.title}">${producto.title}</h6>
                        <div class="mt-auto pt-2">
                            <p class="price-tag mb-2">$${producto.price.toFixed(2)}</p>
                            <button class="btn btn-primary btn-sm w-100 btn-ver-detalles" data-id="${producto.id}">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedorCatalogo.innerHTML = html;
}

// Función para mostrar los detalles completos de un producto en el modal
async function mostrarDetalles(idProducto) {
    const modalBody = document.getElementById('modalBody');
    const modalTitulo = document.getElementById('modalDetallesLabel');
    const modalElemento = document.getElementById('modalDetalles');

    try {
        const response = await fetch(`https://fakestoreapi.com/products/${idProducto}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const producto = await response.json();

        if (modalTitulo) modalTitulo.textContent = producto.title;

        const ratingRate = producto.rating ? producto.rating.rate : 'N/A';
        const ratingCount = producto.rating ? producto.rating.count : 0;

        if (modalBody) {
            modalBody.innerHTML = `
                <div class="row g-4 align-items-center">
                    <div class="col-md-5 text-center">
                        <img src="${producto.image}" alt="${producto.title}" class="img-fluid modal-product-img rounded p-2 border">
                    </div>
                    <div class="col-md-7">
                        <span class="badge bg-info text-dark mb-2 text-capitalize">${producto.category}</span>
                        <h4 class="fw-bold mb-3">${producto.title}</h4>
                        <p class="text-muted">${producto.description}</p>
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <span class="fs-3 fw-bold text-primary">$${producto.price.toFixed(2)}</span>
                            <span class="badge bg-warning text-dark">⭐ ${ratingRate} (${ratingCount} reseñas)</span>
                        </div>
                        <button class="btn btn-success btn-lg w-100 mt-2">
                            🛒 Añadir al Carrito
                        </button>
                    </div>
                </div>
            `;
        }

        if (modalElemento && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElemento);
            modalInstance.show();
        }
    } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    No fue posible cargar la información del producto. Por favor, intenta de nuevo más tarde.
                </div>
            `;
        }
    }
}

// Inicialización de la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const productos = await obtenerProductos();
        if (productos && productos.length > 0) {
            mostrarCarrusel(productos);
            mostrarOfertas(productos);
            mostrarCatalogo(productos);
        }
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }

    // Delegación de eventos para todos los botones de "Ver Detalles"
    document.addEventListener('click', (evento) => {
        const botonDetalles = evento.target.closest('.btn-ver-detalles');
        if (botonDetalles) {
            const id = botonDetalles.getAttribute('data-id');
            if (id) {
                mostrarDetalles(id);
            }
        }
    });
});
