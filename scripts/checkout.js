import { cart, checkCart, removeFromCart, updateCartQuantity, updateCartItemQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency, calculateTax, calculateShippingCost } from "./utils/money.js";

updateCartQuantity();


let checkoutHTML = '';
let paymantSummaryHTML = '';
let shippingCost = 0;

function getFormattedDate(daysFromNow) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysFromNow);

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();

    const formattedDate = `${dayOfWeek} ${month} ${day}`;

    return formattedDate;
}

const date1 = getFormattedDate(1);
const date2 = getFormattedDate(2);
const date3 = getFormattedDate(3);


function calculateTotal(shipping) {
    let total = 0;
    let itemsCount = 0;
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        let matchingItem;

        products.forEach((product) => {
            if (product.id == productId) {
                matchingItem = product;
            } 
        });

        total += cartItem.quantity * matchingItem.priceCents;
        itemsCount += cartItem.quantity
        
    });
    const totalAndShipping = total + shipping;
    return [formatCurrency(total), itemsCount, formatCurrency(totalAndShipping)];
}



cart.forEach((cartItem) => {

    const productId = cartItem.productId;


    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });


    checkoutHTML += `
    <div class="cart-items-container js-cart-items-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date:
            <span class="js-delivery-date">
                ${date3}
            </span>
        </div>                        
        <div class="cart-items-details-grid">
            <img src="${matchingProduct.image}" alt="" class="product-img">
            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                <div class="js-quantity-container-${matchingProduct.id} product-quantity" data-testid="${matchingProduct.id}">
                     Quantity:  
                    <span class="js-quantity-label quantity-label"> ${cartItem.quantity} </span>
                    <input type="number" min="1" max="100" class="new-quantity-input is-hidden" value="${cartItem.quantity}" ">
                    <span class="update-quantity-link js-update-quantity-link link-primary" data-testid="${matchingProduct.id}"> Update </span>
                    <span class="save-quantity-link js-save-quantity-link link-primary is-hidden" data-testid="${matchingProduct.id}"> Save </span>
                    <span class="delete-quantity-link js-delete-quantity-link link-primary" data-testid="${matchingProduct.id}"> Delete </span>
                </div>
            </div>
            <div class="delivery-options-${matchingProduct.id}">
                <div class="delivery-options-title"> Choose a delivery option: </div>
                <div class="delivery-option js-delivery-option" data-delivery-option-id=""  data-testid="">
                    <input type="radio" class="delivery-option-input js-delivery-option-input" id="free" name="delivery-option-${matchingProduct.id}" data-testid="${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${date3}
                        </div>
                        <div class="delivery-option-price">
                            FREE Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option js-delivery-option" data-delivery-option-id="">
                    <input type="radio" class="delivery-option-input js-delivery-option-input" id="five" name="delivery-option-${matchingProduct.id}" data-testid="${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${date2}
                        </div>
                        <div class="delivery-option-price">
                            $4.99 - Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option js-delivery-option" data-delivery-option-id="">
                    <input type="radio" class="delivery-input js-delivery-option-input" id="ten" name="delivery-option-${matchingProduct.id}" data-testid="${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${date1}
                        </div>
                        <div class="delivery-option-price">
                            $9.99 - Shipping
                        </div>
                    </div>
                </div>
                </div>
            </div>
            
        </div>    
    </div>
    `;
});



function updateCartSummary() {
    const totalBeforeTax = calculateTotal(parseFloat(shippingCost));
    const tax = calculateTax(parseFloat(totalBeforeTax[0]), parseFloat(formatCurrency(shippingCost)));
    
    const totalAfterTax = (parseFloat(totalBeforeTax) + parseFloat(tax)).toFixed(2);

    if (checkCart() === 1) {
        paymantSummaryHTML = `
        <div class="js-payment-info">
            <div class="payment-summary-title">
                Order Summary
            </div>
    
            <div class="payment-summary-row">
                <div>Items (0):</div>
                <div class="payment-summary-money" data-testid="product-cost">
                    $0.00
                </div>
            </div>
    
            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money" data-testid="shipping-cost">
                    $0.00
                </div>
            </div>
    
            <div class="payment-summary-row subtotal-row">
                <div style="padding-top: 11px;">Total before tax:</div>
                <div style="border-top: 2px solid lightgray; padding-top: 10px;" class="payment-summary-money" data-testid="sub-total">
                    $0.00
                </div>
            </div>
    
            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money" data-testid="tax-cost">
                    $0.00
                </div>
            </div>
    
            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money" data-testid="total-cost">
                    $0.00
                </div>
            </div>
        </div>
        <div class="paypal-toggle">
            Use PayPal
            <input type="checkbox" class="js-paypal-toggle" false>
        </div>
        <div class="js-payment-buttons-container false" data-testid="payment-buttons-container">
            <button class="js-place-order-button checkout-order-button" data-testid="place-order-button">
                Place your order
            </button>
        </div>`;
    };

    checkCart();

        cart.forEach((cartItem) => {
        
            const productId = cartItem.productId;
        
            let matchingItem;
        
            products.forEach((product) => {
                if (product.id == productId) {
                    matchingItem = product;
                } 
            });
        
            
        
            paymantSummaryHTML = `
                <div class="js-payment-info">
                    <div class="payment-summary-title">
                        Order Summary
                    </div>
        
                    <div class="payment-summary-row">
                        <div>Items (${totalBeforeTax[1]}):</div>
                        <div class="payment-summary-money" data-testid="product-cost">
                            $${totalBeforeTax[0]}
                        </div>
                    </div>
        
                    <div class="payment-summary-row">
                        <div>Shipping &amp; handling:</div>
                        <div class="payment-summary-money js-shipping-cost" data-testid="shipping-cost">
                            $${formatCurrency(shippingCost)}
                        </div>
                    </div>
        
                    <div class="payment-summary-row subtotal-row">
                        <div style="padding-top: 11px;">Total before tax:</div>
                        <div style="border-top: 2px solid lightgray; padding-top: 10px;" class="payment-summary-money" data-testid="sub-total">
                        $${totalBeforeTax[2]}
                        </div>
                    </div>
        
                    <div class="payment-summary-row">
                        <div>Estimated tax (10%):</div>
                        <div class="payment-summary-money" data-testid="tax-cost">
                            $${tax}
                        </div>
                    </div>
        
                    <div class="payment-summary-row total-row">
                        <div>Order total:</div>
                        <div class="payment-summary-money" data-testid="total-cost">
                            $${totalAfterTax}
                        </div>
                    </div>
                </div>
                <div class="paypal-toggle">
                    Use PayPal
                    <input type="checkbox" class="js-paypal-toggle" false>
                </div>
                <div class="js-payment-buttons-container false" data-testid="payment-buttons-container">
                    <button class="js-place-order-button checkout-order-button" data-testid="place-order-button">
                        Place your order
                    </button>
                </div>`;
    });
    
    
    document.querySelector('.js-payment-summary').innerHTML = paymantSummaryHTML; 
};




document.querySelector('.js-cart-summary').innerHTML = checkoutHTML;


updateCartSummary();


document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.testid;
        removeFromCart(productId);
        document.querySelector(`.js-cart-items-container-${productId}`).remove();
        updateCartQuantity();
        updateCartSummary();
        checkCart();
    });
});


document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.testid;
        const container = document.querySelector(`.js-quantity-container-${productId}`);
        container.querySelector('.js-save-quantity-link').classList.remove('is-hidden');
        container.querySelector('.new-quantity-input').classList.remove('is-hidden');
        container.querySelector('.js-quantity-label').classList.add('is-hidden');
        container.querySelector('.js-update-quantity-link').classList.add('is-hidden');


    });
});

document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.testid;
        const container = document.querySelector(`.js-quantity-container-${productId}`);
        let newValue = container.querySelector('.new-quantity-input').value;
        container.querySelector('.js-update-quantity-link').classList.remove('is-hidden');
        container.querySelector('.js-quantity-label').classList.remove('is-hidden');
        container.querySelector('.new-quantity-input').classList.add('is-hidden');
        updateCartItemQuantity(productId, newValue)
        container.querySelector('.js-save-quantity-link').classList.add('is-hidden');
        updateCartQuantity();
        container.querySelector('.js-quantity-label').innerHTML = newValue;
        updateCartSummary();
    });
});

document.querySelectorAll('.js-delivery-option-input').forEach((radioButton) => {
    radioButton.addEventListener('change', () => {
        const productId = radioButton.dataset.testid;
        const container = document.querySelector(`.delivery-options-${productId}`);
        const dateContainer = document.querySelector(`.js-cart-items-container-${productId}`)
        const optionFreeShipping = container.querySelector(`#free`);
        const optionFiveDolarShipping = container.querySelector('#five');
        const optionTenDolarShipping = container.querySelector('#ten');
        

        if (optionFreeShipping.checked) {
            shippingCost = calculateShippingCost(optionFreeShipping.id);
            dateContainer.querySelector('.js-delivery-date').innerHTML = date3;
        } else if (optionFiveDolarShipping.checked) {
            shippingCost = calculateShippingCost(optionFiveDolarShipping.id);
            dateContainer.querySelector('.js-delivery-date').innerHTML = date2;
        } else if (optionTenDolarShipping.checked) {
            shippingCost = calculateShippingCost(optionTenDolarShipping.id);
            dateContainer.querySelector('.js-delivery-date').innerHTML = date1;
        }
   
        updateCartSummary();
    });
});

