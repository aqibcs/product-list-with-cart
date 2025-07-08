document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".product-list");

    let cart = {};
    let productsData = [];

    fetch("data.json")
        .then((res) => res.json())
        .then((data) => {
            productsData = data;
            renderProducts();
        })
        .catch((err) => console.error("Error loading data.json", err));

    function renderProducts() {
        productList.innerHTML = ""; 

        productsData.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const isInCart = cart[product.name];

        card.innerHTML = `
                    <img src="${product.image.desktop}" alt="${product.name}">

                    ${
                    isInCart
                        ? `
                        <div class="quantity-controls">
                            <button class="quantity-btn decrement-btn" data-product="${
                            product.name
                            }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
                                    <path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
                                </svg>
                            </button>
                            <span class="quantity-display">${
                            cart[product.name].quantity
                            }</span>
                            <button class="quantity-btn increment-btn" data-product="${
                            product.name
                            }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                    <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
                                </svg>
                            </button>
                        </div>
                        `
                        : `
                        <button class="add-to-cart-btn" data-product="${product.name}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
                                <g fill="#C73B0F">
                                    <path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/>
                                    <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/>
                                </g>
                            </svg>
                            Add to Cart
                        </button>
                    `
                    }

                    <div class="product-info">
                        <p class="product-category">${product.category}</p>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                    </div>
                `;

        productList.appendChild(card);
        });
    }

    renderProducts();
});
