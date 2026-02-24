const base_url='https://api.escuelajs.co/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    //Identifica a página carregada
    if (document.getElementById('featured-list')) {
        loadFeaturedProducts();
    }

    if (document.getElementById('products-list')) {
        loadCatalog();
        loadCategories();
    }

    if (document.getElementById('product-detail')) {
        loadProductDetails();
    }
});

function initTheme() {
    window.toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };
}

function createProductCard(product) {
    return `
    <article class="card">
      <div class="card-img-wrapper">
        <img src="${product.images[0]}" alt="${product.title}" class="card-img" onerror="this.src='https://placehold.co/600x400?text=Imagem+Indisponível'">
      </div>
      <div class="card-content">
        <span class="card-category">${product.category.name}</span>
        <h3 class="card-title">${product.title}</h3>
        <div class="card-footer">
          <span class="card-price">R$ ${product.price.toFixed(2)}</span>
          <a href="detail.html?id=${product.id}" class="btn-primary btn-small">Ver Detalhes</a>
        </div>
      </div>
    </article>      
    `;
}

async function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-list');
    try {
        const response = await fetch(`${base_url}/products?offset=0&limit=3`)
        const products = await response.json();

        featuredContainer.innerHTML = products.map(product => createProductCard(product)).join('');
    } catch (error) {
        console.error("Erro ao carregar destaques: ", error);
        featuredContainer.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

async function loadCatalog(categoryId = '') {
    const productsContainer = document.getElementById('products-list');
    let url = `${base_url}/products`;

    if (categoryId) {
        url = `${base_url}/products/?categoryId=${categoryId}`;
    }

    try {
        productsContainer.innerHTML = '<div class="loader">Buscando produtos...</div>';
        const response = await fetch(url);
        const products = await response.json();

        productsContainer.innerHTML = products.length > 0
            ? products.map(product => createProductCard(product)).join('')
            : '<p>Nenhum produto encontrado nesta categoria.</p>';
    } catch (error) {
        console.error("Erro ao carregar catalogo: ", error);
    }
}

async function loadCategories() {
    const select = document.getElementById('category-filter');
    try {
        const response = await fetch (`${base_url}/categories`);
        const categories = await response.json();

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias: ", error);
    }
}

window.filterProducts = (id) => {
    loadCatalog(id);
};

async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productid = params.get('id');
    const container = document.getElementById('productdetail');

    if(!productid) {
        window.location.href = 'menu.html';
        return;
    }

    try {
        const response = await fetch (`${base_url}/products/${productId}`);
        if (!response.ok) throw new Error("Produto não encontrado");

        const product = await response.json();

        container.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}" class="detail-img">
            <div class="detail-info">
                <span class="card-category" style="font-size:1rem; margin-bottom:1rem; display:block;">
                    Categoria: ${product.category.name}
                </span>
                <h1>${product.title}</h1>
                <div class="detail-price">R$ ${product.price.toFixed(2)}</div>
                <p class="detail-description">${product.description}</p>
                <button class="btn-primary">Adicionar ao Carrinho</button>
            </div>
        `;
    } catch (error) {
        console.error("Erro ao carregar detalhes: ", error);
        container.innerHTML = "<h2>Produto não encontrado ou erro na API.</h2>"
    }
}