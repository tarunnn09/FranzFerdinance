// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const emailInput = document.querySelector('input[type="email"]');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email) {
            errorMessage.textContent = 'Please enter your email address';
            emailInput.parentNode.insertBefore(errorMessage, emailInput.nextSibling);
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address';
            emailInput.parentNode.insertBefore(errorMessage, emailInput.nextSibling);
            emailInput.focus();
            return;
        }
        
        // If validation passes, show success message and redirect
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for signing up!';
        contactForm.appendChild(successMessage);
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = '/'; // Redirects to home page
        }, 2000);
    });
});

// Cart notification system
document.addEventListener('DOMContentLoaded', function() {
    // Create cart sidebar HTML with ₹ symbol
    const cartSidebar = document.createElement('div');
    cartSidebar.className = 'cart-sidebar';
    cartSidebar.innerHTML = `
        <div class="cart-header">
            <h3>Shopping Cart</h3>
            <button class="close-cart">×</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
            <div class="cart-summary">
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span class="subtotal">₹0.00</span>
                </div>
                <div class="summary-line">
                    <span>Tax (10%):</span>
                    <span class="tax">₹0.00</span>
                </div>
                <div class="summary-line total">
                    <span>Total:</span>
                    <span class="final-total">₹0.00</span>
                </div>
            </div>
            <button class="checkout-button">Proceed to Checkout</button>
        </div>
    `;
    document.body.appendChild(cartSidebar);

    // Cart state
    let cartItems = [];
    let cartSubtotal = 0;

    // Add click event listeners to all buy buttons
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = e.target.closest('.shop-item');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('₹', '')),
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(product);
            showCartSidebar();
            updateButtonState(button);
        });
    });

    // Function to add item to cart
    function addToCart(product) {
        const existingItem = cartItems.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push(product);
        }
        
        updateCartDisplay();
    }

    // Function to calculate totals
    function calculateTotals() {
        cartSubtotal = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        const tax = cartSubtotal * 0.10;
        const finalTotal = cartSubtotal + tax;
        
        return {
            subtotal: cartSubtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: finalTotal.toFixed(2)
        };
    }

    // Function to update cart display
    function updateCartDisplay() {
        const cartItemsContainer = cartSidebar.querySelector('.cart-items');
        cartItemsContainer.innerHTML = cartItems.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price-details">
                        <p class="item-price">₹${item.price.toFixed(2)} × ${item.quantity}</p>
                        <p class="item-total">₹${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">×</button>
            </div>
        `).join('');

        // Update totals with ₹ symbol
        const totals = calculateTotals();
        cartSidebar.querySelector('.subtotal').textContent = `₹${totals.subtotal}`;
        cartSidebar.querySelector('.tax').textContent = `₹${totals.tax}`;
        cartSidebar.querySelector('.final-total').textContent = `₹${totals.total}`;

        // Add quantity control listeners
        addQuantityControlListeners();
    }

    // Function to handle quantity controls
    function addQuantityControlListeners() {
        const quantityButtons = cartSidebar.querySelectorAll('.quantity-btn');
        quantityButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.dataset.index);
                if (button.classList.contains('plus')) {
                    cartItems[index].quantity++;
                } else if (button.classList.contains('minus')) {
                    if (cartItems[index].quantity > 1) {
                        cartItems[index].quantity--;
                    } else {
                        removeFromCart(index);
                        return;
                    }
                }
                updateCartDisplay();
            });
        });

        // Add remove functionality
        const removeButtons = cartSidebar.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.dataset.index);
                removeFromCart(index);
            });
        });
    }

    // Function to remove item from cart
    function removeFromCart(index) {
        cartItems.splice(index, 1);
        updateCartDisplay();
    }

    // Function to show cart sidebar
    function showCartSidebar() {
        cartSidebar.classList.add('active');
        document.body.classList.add('cart-open');
    }

    // Function to hide cart sidebar
    function hideCartSidebar() {
        cartSidebar.classList.remove('active');
        document.body.classList.remove('cart-open');
    }

    // Function to update button state
    function updateButtonState(button) {
        button.textContent = 'Added!';
        button.classList.add('added');
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.classList.remove('added');
        }, 2000);
    }

    // Close cart when clicking the close button
    const closeButton = cartSidebar.querySelector('.close-cart');
    closeButton.addEventListener('click', hideCartSidebar);

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.closest('.cart-sidebar') || e.target.closest('.buy-button')) return;
        hideCartSidebar();
    });
}); 