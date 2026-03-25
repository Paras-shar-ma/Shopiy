
// // document.addEventListener("DOMContentLoaded", () => {
// //     const productQuantity=document.querySelectorAll("product-price")
// // console.log(productQuantity)
// // });

// if(document.readyState=="loading"){
//     document.addEventListener("DOMContentLoaded",ready);
// }else{
//     ready();
// }

// function ready(){
//     let quantityInputs=document.getElementsByClassName("quantity");
//     for(let i=0;i<quantityInputs.length;i++){
//         let input=quantityInputs[i];
//         input.addEventListener('change',quantityChanged);
//     }
// }

// function quantityChanged(event){
//      let input=event.target;
//     // if(isNaN(input.value)|| input.value<=0){
//     //     input.value=1;
//     // }
//     updatetotal();
// }

// function updatetotal(){
//     let cartContent =document.getElementsByClassName("cart")[0];
//     let cartBoxes=cartContent.getElementsByClassName("cart-box");
//     let total=0;
//     for(let i=0;i<cartBoxes.length;i++){
//         let cartBox =cartBoxes[i];
//         let priceElement=cartBox.getElementsByClassName("product-price")[0];
//         let quantityElement=cartBox.getElementsByClassName('quantity')[0];
//         let price =parseFloat(priceElement.innerText.replace('$',""));
//         let quantity=quantityElement.value;
//         total +=price*quantity;

//     }
//     total=Math.round(total*100)/100;
//     document.getElementsByClassName('total-price')[0].innerText='₹'+total;
//     // localStorage.setItem('cartTotal',total);
// }

document.addEventListener("DOMContentLoaded", () => {
  
  const quantities = document.querySelectorAll(".quantity");
  const itemTotals = document.querySelectorAll(".item-total");
  const subtotalElement = document.querySelector(".subtotal");
  const itemDiscount=document.querySelectorAll(".item-discount")
  const totalElement = document.querySelector(".total");
  const discountElement=document.querySelector(".discount");

  function updateTotals() {
    let subtotal = 0;
    let total=0;

    itemTotals.forEach((item, index) => {
      const qty = quantities[index].value;
      const price = quantities[index].dataset.price;
      const dis=itemDiscount[index].dataset.price;
      const itemTotal = qty * price;
      
      const discountedItem=(itemTotal*dis/100);
      const discountedTotal=itemTotal-discountedItem;

      item.textContent = `₹${itemTotal}`;

      subtotal += itemTotal;
      discountElement.textContent=`₹${discountedItem}`;
      total=total+discountedTotal;
    });
    
    
    subtotalElement.textContent = `₹${subtotal}`;
    totalElement.textContent = `₹${total.toFixed(2)}`; // change if discount exists
  }

  quantities.forEach(qty => {
    qty.addEventListener("input", updateTotals);
    qty.addEventListener("change", updateTotals);
  });

  updateTotals();
});
