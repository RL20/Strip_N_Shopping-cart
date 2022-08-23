/* script is synced and it is going to block the stack till it's finished therefore I use async inside the script in store.html 
→<script src="store.js" async></script> to load other pages in parallel 
now I have to make sure all stack was actually finished load 
*/
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
function ready() {
  const removeBtn = document.querySelectorAll(".btn-danger");
  for (let i = 0; i < removeBtn.length; i++) {
    let button = removeBtn[i];
    button.addEventListener("click", removeCartItem);
  }
  const quantityInputs = document.querySelectorAll(".cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  const addToCartButtons = document.querySelectorAll(".shop-item-button");
  for (let i = 0; i < addToCartButtons.length; i++) {
    let input = addToCartButtons[i];
    input.addEventListener("click", addToCartClicked);
  }
  document.querySelector(".btn-purchase").addEventListener("click", purchaseClicked);
}

//---------helper function---------------
//--------------------------------------

function addToCartClicked(event) {
  const button = event.target;
  /*
  <div class="shop-item">
          <span class="shop-item-title">Item 4</span>
          <img class="shop-item-image" src="Images/Item 4.jpg" />
          <div class="shop-item-details">
            <span class="shop-item-price">$299.99</span>
            <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
          </div>
        </div>
  */

  const shopItem = button.parentElement.parentElement;
  const title = shopItem.querySelector(".shop-item-title").innerText;
  const imageSrc = shopItem.querySelector(".shop-item-image").getAttribute("src");
  const price = shopItem.querySelector(".shop-item-price").innerText; // remove $ sign;
  // const id = shopItem.querySelector("[data-item-id]");
  const id = shopItem.dataset.itemId;
  addItemToCart(title, price, imageSrc, id);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc, id) {
  const cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  //! cartRow.querySelector("[data-item-id]")=id;
  cartRow.dataset.itemId = id;
  const cartItems = document.querySelector(".cart-items");
  console.log(cartItems);
  //check if item added alredy so the same item won't repeat----
  const cartItemNames = cartItems.querySelectorAll(".cart-item-title");
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }
  //-----------------
  const cartRowContents = `
      <div class="cart-item cart-column">
          <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
          <span class="cart-item-title">${title}</span>
      </div>
      <span class="cart-price cart-column">${price}</span>
      <div class="cart-quantity cart-column">
          <input class="cart-quantity-input" type="number" value="1">
          <button class="btn btn-danger" type="button">REMOVE</button>
      </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow.querySelector(".btn-danger").addEventListener("click", removeCartItem);
  cartRow.querySelector(".cart-quantity-input").addEventListener("change", quantityChanged);
}
function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value < 1) input.value = 1;

  updateCartTotal();
}

function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function updateCartTotal() {
  let cartItemContainer = document.querySelector(".cart-items");
  let cartRows = cartItemContainer.querySelectorAll(".cart-row");
  let total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let priceElement = cartRow.querySelector(".cart-price");
    let quantityElement = cartRow.querySelector(".cart-quantity-input");
    let quantity = quantityElement.value;
    let price = priceElement.innerText.slice(1); // to remoce the $ sign
    // console.log("price", price);
    total += price * quantity;
  }
  let totalElement = document.querySelector(".cart-total-price");
  totalElement.innerText = `$${total.toFixed(2)}`;
}
const stripeHandler = StripeCheckout.configure({
  key: stripePublicKey,
  locale: "en",
  token: function (token) {
    const items = [];
    const cartItemContainer = document.querySelector(".cart-items");
    const cartRows = cartItemContainer.querySelectorAll(".cart-row");
    for (let i = 0; i < cartRows.length; i++) {
      let cartRow = cartRows[i];
      const quantityElement = cartRow.querySelector("cart-quantity-input");
      const quantity = quantityElement.value;
      const id = cartRow.dataset.itemId;
      items.push({
        id: id,
        quantity: quantity,
      });
    }
  },
});
function purchaseClicked() {
  // const total = Number(document.querySelector(".cart-total").lastElementChild.innerText.replace("$", ""));
  // if (total === 0) return;
  // alert("Thank you for your purchase");
  // const cartItems = document.querySelector(".cart-items");
  // while (cartItems.hasChildNodes()) {
  //   cartItems.removeChild(cartItems.firstChild);
  // }
  // updateCartTotal();
  const priceElement = document.querySelector(".cart-total-price");
  const price = parseFloat(priceElement.innerText.replace("$", "")) * 100;
  console.log(price);
  stripeHandler.open({
    amount: price,
  });
}
