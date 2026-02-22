const API_BASE_URL = 'https://z2i3v8cqxj.execute-api.us-east-1.amazonaws.com/prod'; 
const MY_FLUTTERWAVE_KEY = 'FLWPUBK-f8e54b8f40913a71fdc893b0270f5b5d-X'; // Your Flutterwave Public Key

// Product Data
const PRODUCT = {
    id: 1,
    name: "Jay's Tigernut - 500ml",
    price: 2000
};

// WhatsApp Configuration
const WHATSAPP_NUMBER = "2348099448891";

// Cart State
let cart = {
    quantity: 0,
    subtotal: 0,
    total: 0
};

// ─── INIT ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    loadCart();
    updateCartCount();

    // Sticky nav scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
});

// ─── QUANTITY CONTROLS ──────────────────────────
let currentQty = 1;

function increaseQty() {
    currentQty++;
    document.getElementById('quantity').textContent = currentQty;
}

function decreaseQty() {
    if (currentQty > 1) {
        currentQty--;
        document.getElementById('quantity').textContent = currentQty;
    }
}

// ─── ADD TO CART ────────────────────────────────
function addToCart() {
    cart.quantity += currentQty;
    cart.subtotal = PRODUCT.price * cart.quantity;
    cart.total = cart.subtotal;
    saveCart();
    updateCartCount();

    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.classList.add('bump');
    setTimeout(() => cartBtn.classList.remove('bump'), 400);

    showToast(currentQty > 1 ? `${currentQty} bottles added to cart` : `Added to cart`);

    currentQty = 1;
    document.getElementById('quantity').textContent = 1;
}

// ─── CART FUNCTIONS ─────────────────────────────
function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.quantity;
}

function saveCart() {
    localStorage.setItem('jaysTigernutCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('jaysTigernutCart');
    if (saved) cart = JSON.parse(saved);
}

function openCart() {
    document.getElementById('cartContent').innerHTML =
        cart.quantity === 0 ? emptyCartHTML() : '';

    document.getElementById('cartModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    if (cart.quantity > 0) renderCart();
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = '';
}

function updateCartQuantity(newQty) {
    if (newQty < 1) {
        if (confirm('Remove item from cart?')) clearCart();
        return;
    }
    cart.quantity = newQty;
    cart.subtotal = PRODUCT.price * cart.quantity;
    cart.total = cart.subtotal;
    saveCart();
    updateCartCount();
    renderCart();
}

function increaseCartQty() { updateCartQuantity(cart.quantity + 1); }
function decreaseCartQty() { updateCartQuantity(cart.quantity - 1); }

function clearCart() {
    cart = { quantity: 0, subtotal: 0, total: 0 };
    saveCart();
    updateCartCount();
    closeCart();
}

function emptyCartHTML() {
    return `
        <div class="empty-cart">
            <p>Your cart is empty</p>
            <p>Add some Jay's Tigernut to get started!</p>
        </div>
    `;
}

// ─── TOAST ──────────────────────────────────────
function showToast(message = "Added to cart") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// ─── WHATSAPP ───────────────────────────────────
function orderViaWhatsApp() {
    const name    = document.getElementById('customerName')?.value || '';
    const phone   = document.getElementById('customerPhone')?.value || '';
    const address = document.getElementById('deliveryAddress')?.value || '';

    let message = `*New Order — Jay's Tigernut Juice*\n\n`;
    message += `*Order:* ${cart.quantity}x ${PRODUCT.name}\n`;
    message += `*Product Total:* NGN ${cart.subtotal.toLocaleString()}\n\n`;

    if (name)    message += `*Name:* ${name}\n`;
    if (phone)   message += `*Phone:* ${phone}\n`;
    if (address) message += `*Address/Note:* ${address}\n\n`;

    message += `*Delivery:* Please let me know the delivery cost to my location.\n`;

    if (cart.quantity >= 10) {
        message += `\n*Note:* This is a bulk order — are there any discounts available?`;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function contactWhatsApp() {
    const message = `Hi! I have a question about Jay's Tigernut Juice.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ─── RENDER CART ────────────────────────────────
function renderCart() {
    const isBulkOrder = cart.quantity >= 10;

    const content = `
        ${isBulkOrder ? `<div class="bulk-alert">Bulk Order Detected — Message us on WhatsApp for special pricing.</div>` : ''}

        <div class="cart-items">
            <div class="cart-item">
                <div>
                    <strong>${PRODUCT.name}</strong>
                    <div style="display:flex;align-items:center;gap:0;margin-top:0.6rem;background:var(--dark);border:1px solid var(--dark-border);border-radius:8px;overflow:hidden;width:fit-content;">
                        <button onclick="decreaseCartQty()" style="background:transparent;color:var(--yellow);border:none;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:bold;">−</button>
                        <span style="font-weight:bold;min-width:36px;text-align:center;border-left:1px solid var(--dark-border);border-right:1px solid var(--dark-border);height:34px;display:flex;align-items:center;justify-content:center;">${cart.quantity}</span>
                        <button onclick="increaseCartQty()" style="background:transparent;color:var(--yellow);border:none;width:34px;height:34px;cursor:pointer;font-size:1.2rem;font-weight:bold;">+</button>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:700;font-size:1.05rem;">₦${cart.subtotal.toLocaleString()}</div>
                    <div style="font-size:0.8rem;color:var(--gray);">₦${PRODUCT.price.toLocaleString()} each</div>
                </div>
            </div>
        </div>

        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>₦${cart.subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Delivery</span>
                <span style="color:var(--yellow-soft);font-size:0.85rem;">Arranged via WhatsApp</span>
            </div>
            <div class="summary-row total">
                <span>Order Total</span>
                <span>₦${cart.subtotal.toLocaleString()}</span>
            </div>
        </div>

        <div class="cart-delivery-info">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;color:var(--yellow);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Pay for your order online now. Delivery cost is agreed separately via WhatsApp and paid directly to the rider.
        </div>

        <form class="checkout-form" id="checkoutForm">
            <div class="form-group">
                <label for="customerName">Full Name *</label>
                <input type="text" id="customerName" required placeholder="Enter your full name">
            </div>
            <div class="form-group">
                <label for="customerPhone">Phone Number *</label>
                <input type="tel" id="customerPhone" required pattern="[0-9]{11}" placeholder="e.g. 08012345678">
            </div>
            <div class="form-group">
                <label for="customerEmail">Email Address *</label>
                <input type="email" id="customerEmail" required placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label for="deliveryAddress">Address / Pick-up Note</label>
                <textarea id="deliveryAddress" rows="2" placeholder="Your Lagos address, or write 'Pick-up from Surulere'"></textarea>
            </div>

            <p class="payment-label">How would you like to proceed?</p>

            <div class="payment-options">
                <button type="button" class="payment-btn whatsapp" onclick="orderViaWhatsApp()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.121 1.529 5.852L.057 23.997l6.335-1.46A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.028-1.382l-.36-.214-3.742.861.936-3.618-.235-.372A9.808 9.808 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                    <span class="payment-btn-text">Order via WhatsApp</span>
                    <span style="font-size:0.72rem;opacity:0.85;">Arrange delivery & payment</span>
                </button>
                <button type="submit" class="payment-btn flutterwave" id="checkoutBtn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <span class="payment-btn-text">Pay Online</span>
                    <span style="font-size:0.72rem;opacity:0.85;">₦${cart.subtotal.toLocaleString()} via Flutterwave</span>
                </button>
            </div>
        </form>
    `;

    document.getElementById('cartContent').innerHTML = content;
    document.getElementById('checkoutForm').addEventListener('submit', processCheckout);
}

// ─── PROCESS CHECKOUT ───────────────────────────
async function processCheckout(event) {
    event.preventDefault();

    const name    = document.getElementById('customerName').value;
    const phone   = document.getElementById('customerPhone').value;
    const email   = document.getElementById('customerEmail').value;
    const address = document.getElementById('deliveryAddress').value;

    const orderId = "JAYTIG-" + Date.now();

    const orderData = {
        orderId,
        customerName: name,
        phone,
        email,
        deliveryAddress: address || 'To be confirmed via WhatsApp',
        items: [{ name: PRODUCT.name, quantity: parseInt(cart.quantity), price: parseFloat(PRODUCT.price) }],
        totalAmount: parseFloat(cart.subtotal),
        notes: `Lagos order. Delivery arranged separately via WhatsApp.`
    };

    try {
        const saveResponse = await fetch(`${API_BASE_URL}/save-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const saveResult = await saveResponse.json();

        if (!saveResult.success) {
            let errorMsg = 'Failed to create order:\n\n' + (saveResult.message || 'Unknown error');
            if (saveResult.errors?.length) errorMsg += '\n\nDetails:\n' + saveResult.errors.join('\n');
            alert(errorMsg);
            return;
        }

        FlutterwaveCheckout({
            public_key: MY_FLUTTERWAVE_KEY,
            tx_ref: orderId,
            amount: cart.subtotal,
            currency: "NGN",
            payment_options: "card,banktransfer,ussd",
            customer: { email, phone_number: phone, name },
            customizations: {
                title: "Jay's TigerNut Juice",
                description: `${cart.quantity} bottle(s) — Surulere, Lagos`,
                logo: "https://i.ibb.co/Z6sBkPKD/logo.png",
            },
            callback: async function (data) {
                if (data.status === "successful") {
                    try {
                        const verifyResponse = await fetch(`${API_BASE_URL}/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                transactionId: data.transaction_id,
                                orderId,
                                amount: cart.subtotal
                            })
                        });

                        const verifyResult = await verifyResponse.json();

                        if (verifyResult.success) {
                            cart = { quantity: 0, subtotal: 0, total: 0 };
                            saveCart();
                            updateCartCount();
                            closeCart();
                            showToast('Payment confirmed. We will be in touch!');
                            setTimeout(() => {
                                alert(`Payment Successful!\n\nOrder ID: ${orderId}\nTransaction: ${data.transaction_id}\n\nWe will reach out to you on ${phone} to coordinate pick-up or delivery.`);
                            }, 400);
                        } else {
                            alert(`Payment received, confirmation pending.\nOrder ID: ${orderId}\nTransaction: ${data.transaction_id}`);
                        }
                    } catch (err) {
                        alert(`Payment successful!\nOrder ID: ${orderId}\nTransaction: ${data.transaction_id}\n\nPlease save this — we will be in touch to arrange fulfilment.`);
                    }
                }
            },
            onclose: function () {
                console.log('Payment window closed');
            }
        });

    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check your connection and try again.');
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCart();
});
