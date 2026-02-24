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