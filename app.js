document.addEventListener("DOMContentLoaded", () => {
    const products = document.querySelector(".products");
    const cart = {};
    const cartContainer = document.querySelector(".cart");
    const cartHeading = cartContainer.querySelector("h3");
    const cartMessage = cartContainer.querySelector("p");

    function renderProducts(products) {
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = ``
        });
    }
});
