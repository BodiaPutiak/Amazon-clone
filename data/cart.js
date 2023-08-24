
export let cart = JSON.parse(localStorage.getItem('cart'));


export function checkCart() {
    if (cart.length === 0) {
        document.querySelector('.your-cart-is-empty').innerHTML = 'Your cart is empty.';
        document.querySelector('.js-place-order-button').classList.add('is');
        document.querySelector('.js-place-order-button').classList.remove('button-primary');
        return 1;
    } else {
        document.querySelector('.js-place-order-button').classList.add('button-primary');
        return 0;
    }
}




export function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((item) => {
    cartQuantity += item.quantity;
   });

   document.querySelector('.js-cart-counter').innerHTML = cartQuantity;
};

export function updateCartItemQuantity(productId, newValue) {
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItem.quantity = Number(newValue);
            saveToLocalStorage();
        } 
    }); 
};


function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));  
};

export function addToCart(productId, quantity) {
    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += Number(quantity);
    } else {
        cart.push({
            productId: productId,
            quantity: Number(quantity)
        });
    }
    saveToLocalStorage();
};

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToLocalStorage()
};

