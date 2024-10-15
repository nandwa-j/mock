// Fetch produces from the API
async function fetchProduces() {
    try {
        const response = await fetch('/api/produces');  // Assuming an API to fetch produces
        const produces = await response.json();
        displayProduces(produces);
    } catch (error) {
        console.error('Error fetching produces:', error);
    }
}

function displayProduces(produces) {
    const producesGrid = document.querySelector('.js-produces-grid');
    let producesHTML = '';
    produces.forEach(produce => {
        producesHTML += `
            <div class="produce-container">
                <div class="produce-image-container">
                    <img class="produce-image" src="${produce.image}" alt="${produce.name}">
                </div>
                <div class="produce-name limit-text-to-2-lines">${produce.name}</div>
                <div class="produce-rating-container">
                    <img class="produce-rating-stars" src="images/ratings/rating-${produce.rating.stars * 10}.png">
                    <div class="produce-rating-count link-primary">${produce.rating.count}</div>
                </div>
                <div class="produce-price">Kshs.${produce.price}</div>
                <div class="produce-quantity-container">
                    <select class="js-quantity-selector">
                        <option selected value="1">1kg</option>
                        <option value="2">2kg</option>
                        <option value="3">3kg</option>
                        <option value="4">4kg</option>
                        <option value="5">5kg</option>
                        <option value="6">6kg</option>
                        <option value="7">7kg</option>
                        <option value="8">8kg</option>
                        <option value="9">9kg</option>
                        <option value="10">10kg</option>
                    </select>
                </div>
                <div class="added-to-cart" style="display: none;">
                    <img src="images/icons/checkmark.png"> Added
                </div>
                <button class="add-to-cart-button button-primary js-add-to-cart" data-produce-id="${produce.id}">
                    Add to Cart
                </button>
            </div>
        `;
    });
    producesGrid.innerHTML = producesHTML;
    setupAddToCartEventListeners();
}

// Event listeners for adding items to the cart
function setupAddToCartEventListeners() {
    document.querySelectorAll('.js-add-to-cart').forEach(button => {
        button.addEventListener('click', async (event) => {
            const produceId = event.target.dataset.produceId;
            const quantity = event.target.closest('.produce-container').querySelector('.js-quantity-selector').value;
            await addToCart(produceId, quantity);
            refreshCartCount();
            alert('Item added to cart.');
        });
    });
}

// Add to cart API call
async function addToCart(produceId, quantity) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',  // Assuming a POST /api/cart endpoint
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ produceId, quantity })  // Adding selected quantity to the cart
        });
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Refresh cart count display
async function refreshCartCount() {
    try {
        const response = await fetch('/api/cart');
        const cartItems = await response.json();
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.js-cart-quantity').textContent = totalQuantity;
    } catch (error) {
        console.error('Error refreshing cart count:', error);
    }
}

// Initialize page
fetchProduces();
refreshCartCount();


