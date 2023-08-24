import { cart, addToCart, updateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

updateCartQuantity();

let productsHTML = '';

let newProducts = products.filter((product) => product.id.charAt(0) === 't')

newProducts.forEach((product) => {
    productsHTML += `
    <div class="product-container js-product-container-${product.id}">
        <div class="product-img-container">
            <img src="${product.image}" alt="">
        </div>
        <div class="product-name-container">
            ${product.name}
        </div>
        <div class="product-rating-container">
            <img src="ratings/rating-${product.rating.stars * 10}.png" alt="">
            <div class="product-rating-stars"> ${product.rating.count} </div>
        </div>
        <div class="product-price">
            $${formatCurrency(product.priceCents)}
        </div>
        <div class="product-quantity-container">
            <select class="js-quantity-selector" data-testid="quantity-selector">
                <option selected="" value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        </div>
        <div class="product-spacer"></div>
        <div class="added-to-cart-message js-added-to-cart-message">
            <img src="icons/checkmark.png" alt="">
            " Added "
        </div>
        <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
            Add to cart
        </button>
        
    </div>  
    `
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;


function showHideAddedMessage(button) {
    const previousSibling = button.previousElementSibling;
    function  hideElement() {
        previousSibling.classList.remove('is-not-hidden');
    };
    const delay = 5000;
    previousSibling.classList.add('is-not-hidden');
    setTimeout(hideElement, delay);
};

document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const container = document.querySelector(`.js-product-container-${productId}`);
        const quantity = container.querySelector('.js-quantity-selector').value;
        addToCart(productId, quantity);
        updateCartQuantity();
        showHideAddedMessage(button);
     
    });
 });
