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

