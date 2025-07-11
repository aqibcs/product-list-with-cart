document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".product-list");
    const cartCountElement = document.querySelector(".cart-count");
    const emptyCartElement = document.querySelector(".empty-cart");
    const cartItemsElement = document.querySelector(".cart-items");
    const cartSummaryElement = document.querySelector(".cart-summary");
    const totalAmountElement = document.querySelector(".total-amount");
    const confirmOrderBtn = document.querySelector(".confirm-order-btn");
    const modalOverlay = document.querySelector(".modal-overlay");
    const confirmedItemsElement = document.querySelector(".confirmed-items");
    const startNewOrderBtn = document.querySelector(".start-new-order-btn");

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

        const isInCart = cart[product.name] && cart[product.name].quantity > 0;
        if (isInCart) {
            card.classList.add("selected");
        }

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
        
        const addButton = card.querySelector(".add-to-cart-btn");
        const incrementButton = card.querySelector(".increment-btn");
        const decrementButton = card.querySelector(".decrement-btn");

        if (addButton) {
            addButton.addEventListener("click", () => addToCart(product));
        }

        if (incrementButton) {
            incrementButton.addEventListener("click", () => 
            incrementQuantity(product.name));
        }

        if (decrementButton) {
            decrementButton.addEventListener("click", () =>
            decrementQuantity(product.name));
        }

        productList.appendChild(card);
        });
    }

    function addToCart(product) {
        if (!cart[product.name]) {
            cart[product.name] = {...product, quantity: 1 };
        } else {
            cart[product.name].quantity++;
        }
        updateCartUI();
        renderProducts();
    }

    function incrementQuantity(productName) {
        if (cart[productName]) {
            cart[productName].quantity++;
            updateCartUI();
            renderProducts();
        }
    }

    function decrementQuantity(productName) {
        if (cart[productName] && cart[productName].quantity > 0) {
            cart[productName].quantity--;

        if (cart[productName].quantity === 0) {
            delete cart[productName];
        }
        updateCartUI();
        renderProducts();
        }
    }

    function removeFromCart(productName) {
        delete cart[productName];
        updateCartUI();
        renderProducts();
    }

    function updateCartUI() {
        const cartItems = Object.values(cart);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.price, 0
        );

        cartCountElement.textContent = totalItems;

        if (totalItems === 0) {
            // Show empty cart
            emptyCartElement.style.display = "block";
            cartItemsElement.style.display = "none";
            cartSummaryElement.style.display = "none";
        } else {
            // Show cart items
            emptyCartElement.style.display = "none";
            cartItemsElement.style.display = "block";
            cartSummaryElement.style.display = "block";

            // Render cart items
            cartItemsElement.innerHTML = cartItems
                .map(
                (item) => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-details">
                                <span class="cart-item-quantity">${item.quantity}x</span>
                                <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
                                <span class="cart-item-total">$${(
                                item.quantity * item.price
                                ).toFixed(2)}</span>
                            </div>
                        </div>
                        <button class="remove-item" data-product="${
                        item.name
                        }" aria-label="Remove item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                        </svg>
                        </button>
                    </div>
                    `
                )
                .join("");

            // Update total amount
            totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;

            document.querySelectorAll(".remove-item").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const productName = e.currentTarget.getAttribute("data-product");
                    removeFromCart(productName);
                });
            });
        }
    }

    // Confirm order 
    confirmOrderBtn.addEventListener("click", () => {
        showOrderConfirmation();
    });

    function showOrderConfirmation() {
        const cartItems = Object.values(cart);
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.price, 0
        );

        // Render confirmed items
        confirmedItemsElement.innerHTML = `
            ${cartItems
                .map(
                (item) => `
                <div class="confirmed-item">
                    <img src="${item.image.thumbnail}" alt="${item.name}">
                    
                    <div class="confirmed-item-info">
                    <div class="confirmed-item-name">${item.name}</div>
                    <div class="confirmed-item-details">
                        <span class="confirmed-item-quantity">${item.quantity}x</span>
                        <span class="confirmed-item-price">@ $${item.price.toFixed(
                        2
                        )}</span>
                    </div>
                    </div>

                    <div class="confirmed-item-total">
                    $${(item.quantity * item.price).toFixed(2)}
                    </div>
                </div>
                `
                )
                .join("")}
            <div class="confirmed-total">
                <span>Order Total</span>
                <span class="confirmed-total-amount">$${totalAmount.toFixed(2)}</span>
            </div>
            `;


        modalOverlay.style.display = "flex";
    }

    // Start new order
    startNewOrderBtn.addEventListener("click", () => {
        cart = {};
        updateCartUI();
        renderProducts();
        modalOverlay.style.display = "none";
    });

    // Close modal 
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = "none"
        }
    });
});
