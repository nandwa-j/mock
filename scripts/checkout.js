// Fetch cart contents on page load
async function fetchCart() {
    try {
        const response = await fetch('/api/cart'); // Assuming a GET /api/cart endpoint is available
        const cartItems = await response.json();
        displayCartItems(cartItems);
        calculateTotal(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Display the cart items in the order summary
function displayCartItems(cartItems) {
    const orderSummaryEl = document.querySelector('.js-order-summary');
    let cartHTML = '';
    cartItems.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-produce-id="${item.produceId}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <input class="cart-item-quantity js-quantity-input" type="number" value="${item.quantity}" min="1" />
                    <button class="remove-item-button js-remove-item">Remove</button>
                </div>
                <div class="cart-item-price">Kshs. ${item.price}</div>
            </div>
        `;
    });
    orderSummaryEl.innerHTML = cartHTML;
    setupCartEventListeners(cartItems);
}

// Recalculate the total price
function calculateTotal(cartItems) {
    const totalPriceEl = document.querySelector('.js-total-price');
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceEl.textContent = `Total: Kshs. ${total}`;
}

// Set up event listeners for quantity changes and item removal
function setupCartEventListeners(cartItems) {
    document.querySelectorAll('.js-quantity-input').forEach(input => {
        input.addEventListener('change', async (event) => {
            const produceId = event.target.closest('.cart-item').dataset.produceId;
            const newQuantity = event.target.value;
            await updateCartQuantity(produceId, newQuantity);
            fetchCart();  // Reload cart to reflect updates
        });
    });

    document.querySelectorAll('.js-remove-item').forEach(button => {
        button.addEventListener('click', async (event) => {
            const produceId = event.target.closest('.cart-item').dataset.produceId;
            await removeCartItem(produceId);
            fetchCart();  // Reload cart to reflect updates
        });
    });
}

// Update cart quantity via API
async function updateCartQuantity(produceId, quantity) {
    try {
        const response = await fetch(`/api/cart/${produceId}`, {
            method: 'PUT',  // Assuming there's a PUT /api/cart/:produceId endpoint
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error updating cart quantity:', error);
    }
}

// Remove item from cart via API
async function removeCartItem(produceId) {
    try {
        const response = await fetch(`/api/cart/${produceId}`, {
            method: 'DELETE',  // Assuming there's a DELETE /api/cart/:produceId endpoint
        });
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

// Handle checkout
async function handleCheckout() {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: getCartData() })  // Assuming getCartData fetches current cart state
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error processing checkout:', error);
    }
}

// Initialize page
document.querySelector('.js-checkout-button').addEventListener('click', handleCheckout);
fetchCart();

