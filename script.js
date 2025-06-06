"use strict";

//selecting necessary element
const productContainer = document.querySelector(".product-div");
const cartActive = document.querySelector(".cart-active");
const cartInactive = document.querySelector(".cart-inactive");
const cartTotalDiv = document.querySelector(".total-div");
const orderDiv = document.querySelector(".order");
cartTotalDiv.classList.add("hidden");

const cartEl = document.querySelector(".cart");
const cartTotal = document.querySelector(".cart-items-total");
const cartLength = document.getElementById("cart-active-quantity");

let cart = [];
// let count = 0;
let productData;

const formatcur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//functions
//adding product to the cart
const addToCart = function (products, cart) {
  const cartButtons = document.querySelectorAll(".button");
  let count = 0;
  cartButtons.forEach(function (btn, index) {
    btn.addEventListener("click", (e) => {
      const clicked = e.target;
      const cartButton = clicked.closest(".cart-button");
      const btnContainer = cartButton.closest(".cart-button-divs");
      const productDiv = btnContainer.closest('.product');
      const productImage = productDiv.querySelector('img');
      productImage.style.border = '2px solid red';
      const addToCountBtn = btnContainer.querySelector(".cart-button-count");
      const countEl = addToCountBtn.querySelector("#count");
      const product = products[index];
      // console.log(product);
      product.amount = 1;

      if (!clicked) return;

      if (!cartButton.classList.contains("hidden")) {
        cartButton.classList.add("hidden");
        addToCountBtn.classList.remove("hidden");
        countEl.textContent = product.amount;
        // countEl.textContent = 0;
        cart.push(product);
        // console.log(cart);
        displayCart(cart);
        // displayOrder()
        cartInactive.classList.add("hidden");
        cartActive.classList.remove("hidden");
        cartTotalDiv.classList.remove("hidden");
        // console.log(cart);
        // cart[index].amount = count
      }

      // handling increment product quantity
      const increment = addToCountBtn.querySelector(".increment-button");
      // console.log(decrement);
      increment.addEventListener("click", (e) => {
        //stop propagation of the click event
        e.stopPropagation();

        const clicked = e.currentTarget;
        // console.log(clicked);
        if (!clicked) return;

        if (clicked) {
          count = Number(product.amount + 1);
          countEl.textContent = count;
          product.amount = count;
          displayCart(cart);
        }
      });

      // handling decrement product quantity
      const decrement = addToCountBtn.querySelector(".decrement-button");
      // console.log(decrement);
      decrement.addEventListener("click", (e) => {
        //stop propagation of click event
        e.stopPropagation();

        const clicked = e.currentTarget;
        // console.log(clicked);
        if (!clicked) return;

        if (clicked) {
          if (count <= 0) {
            count = 0;
          } else {
            count = Number(product.amount - 1);
            countEl.textContent = count;
            product.amount = count;
            displayCart(cart);
          }
        }
      });
    });
  });
};

//function to display cart
const displayCart = function (cart) {
  // console.log(cart);

  //displaying the cart quantity
  let totalAmount = 0
  cart.forEach(c => {
    return totalAmount += c.amount
  })
  cartLength.textContent = totalAmount;
  let cartHTML = cart.map((c) => {
    let html = `
            <div class="cart-item-details">
              <div class="item">
                <p id="cart-item-name">${c.name}</p>
                <p class="cart-item-price-details">
                  <span class="cart-item-amount">${c.amount}x</span>
                  <span class="cart-item-price">@ ${formatcur(c.price, 'en-US', 'USD')}</span>
                  <span class="cart-item-total-price">${formatcur(Number(
                    c.amount * c.price
                  ), 'en-US', 'USD')}</span>
                </p>
              </div>

              <div>
                <button class="cart-button-remove">
                  <img
                    src="./assets/images/icon-remove-item.svg"
                    alt="remove-item-icon"
                  />
                </button>
              </div>
            </div>`;

    return html;
  });
  cartActive.innerHTML = cartHTML.join("");

  //displaying the total amount for order
  const totalArray = cart.map((c) => {
    return c.amount * c.price;
  });

  let total = 0;
  totalArray.forEach((num) => {
    total += num;
  });

  cartTotal.textContent = `${formatcur(total, 'en-US', 'USD')}`;
  const totalEl = document.querySelector(".order-items-total");
  totalEl.textContent = `${formatcur(total, 'en-US', 'USD')}`;

  //removing from cart functionality
  const btnRemove = document.querySelectorAll(".cart-button-remove");
  console.log(btnRemove);
  btnRemove.forEach((btn, i, b) => {
    btn.addEventListener("click", function () {
      cart.splice(i, 1);
      displayCart(cart);
    });
  });
};

//display function to display order
const displayOrder = function () {
  console.log(cart);
  let orderHTML = cart.map((c) => {
    let html = `
          <div class="item-div">
              <div class="order-item ">
              <div class="item-ordered">
              <img src="${c.image.thumbnail}"/>
              <div class="order-item-text">
              <p id="cart-item-name">${c.name}</p>
                <p class="cart-item-price-details">
                  <span class="cart-item-amount">${c.amount}x</span>
                  <span class="cart-item-price">@ ${formatcur(c.price, 'en-US', 'USD')}</span>  
                </p>
              </div>
                
                </div>              
            <div>
                <p class="order-total">
                  <span class="item-total-price">${formatcur(Number(
                    c.amount * c.price
                  ), 'en-US', 'USD')}</span>
                </p>
              </div>
                </div>
             
          </div
    `;

    return html;
  });

  orderDiv.innerHTML = orderHTML.join("");

  //displaying the total amount for order
  const totalArray = cart.map((c) => {
    return c.amount * c.price;
  });

  let total = 0;
  totalArray.forEach((num) => {
    total += num;
  });

};

//fetching the product list from the data.json
fetch("data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network request was not ok!");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    productData = data;
    displayProducts(productData);
  })
  .catch((error) => {
    console.error("fetch error:", error);
  });
// console.log(cartButtons);

// displaying the products on the product list div
const displayProducts = function (productData) {
  let productHTML = productData.map((d) => {
    let html = `
        <div class="product-divs">
          <div class="product">
            <img
              class="product-img"
              src="${d.image.mobile}"
              alt="waffle with Berries"
            />

            <div class="cart-button-divs">
              <button class="cart-button button">
                <p class="button-text">
                  <img
                    class="cart-img"
                    src="./assets/images/icon-add-to-cart.svg"
                    alt="add to cart icon"
                  />
                  Add to Cart
                </p>
              </button>

              <button class="cart-button hidden cart-button-count">
                <p class="cart-count">
                <span class="count-img">
                <img
                  class="decrement-button btn"
                    src="./assets/images/icon-decrement-quantity.svg"
                    alt=""
                  />
                </span>
                  
                  <span id="count"></span>

                  <span class="count-img">
                  <img
                    class="increment-button btn"
                    src="./assets/images/icon-increment-quantity.svg"
                    alt=""
                  />
                  </span>
                  
                </p>
              </button>
            </div>           
            </div>
            <div class="product-description">
            <p class="product-name">${d.category}</p>
            <p class="product-title">${d.name}</p>
            <p class="product-price">${formatcur(d.price, 'en-US', 'USD')}</p>
          </div>
        </div>  
        `;
    return html;
  });

  productContainer.innerHTML += productHTML.join("");
  addToCart(productData, cart);
};

//functionality for modal order pop up
const btnCompleteOrder = document.querySelector(".button-confirm-order");
const btnNewOrder = document.querySelector(".new-order");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const openModal = function () {
  displayOrder();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function (cart) {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  location.reload();
};

btnCompleteOrder.addEventListener("click", openModal);

btnNewOrder.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
//   console.log(e.key);
