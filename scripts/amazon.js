import { rubrics } from "../data/subsections.js";
import { updateCartQuantity, cart } from "../data/cart.js";

updateCartQuantity();

let rubricHTML = '';

rubrics.forEach(rubric => {
    rubricHTML += `
    <div class="products-subsection">
        <h3>${rubric.title}</h3>
        <a class="image-anchor" href="${rubric.reference}"><img src="${rubric.image}" alt=""></a>
        <a href="${rubric.reference}"><div class="shop-now">Shop now</div></a>
    </div>
    `
});

document.querySelector('.js-rubric-grid').innerHTML = rubricHTML;

document.querySelectorAll('.shop-now').forEach((elem) => {
    elem.addEventListener('click', () => {
        updateCartQuantity();
    });
});