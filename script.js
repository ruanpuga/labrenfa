let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

    // Listagem das prods
productJson.map((item, index)=>{
    let prodItem = c('.models .prod-item').cloneNode(true);
    prodItem.setAttribute('data-key', index);
    prodItem.querySelector('.prod-item--img img').src = item.img;
    prodItem.querySelector('.prod-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.',',')}`;
    prodItem.querySelector('.prod-item--name').innerHTML = item.name;
    prodItem.querySelector('.prod-item--desc').innerHTML = item.description;
    // Evento de click p/ abrir o Modal
    prodItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.prod-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        c('.prodBig img').src = productJson[key].img;
        c('.prodInfo h1').innerHTML = productJson[key].name;
        c('.prodInfo--desc').innerHTML = productJson[key].description;
        c('.prodInfo--actualPrice').innerHTML = `R$ ${productJson[key].price.toFixed(2).replace('.',',')}`;
        
        
        cs('.prodInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = productJson[key].sizes[sizeIndex];
        });

        c('.prodInfo--qt').innerHTML = modalQt

        c('.prodWindowArea').style.opacity = 0;
        c('.prodWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.prodWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.prod-area').append( prodItem );
});
    // Eventos do Modal
function closeModal() { 
    c('.prodWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.prodWindowArea').style.display = 'none';
        c('.prodInfo--size.selected').classList.remove('selected');
    }, 500);
}
cs('.prodInfo--cancelButton, .prodInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.prodInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.prodInfo--qt').innerHTML = modalQt;
    }
});
c('.prodInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        c('.prodInfo--qt').innerHTML = modalQt;
});
cs('.prodInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.prodInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('.prodInfo--addButton').addEventListener('click', ()=>{
    let size = c('.prodInfo--size.selected').getAttribute('data-key');
    let identifier = productJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);
    
    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:productJson[modalKey].id,
            size,
            qt:modalQt
    });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.left = 0;
    } else {
        c('aside').style.left = '100vw';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});


function updateCart() {

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        c('.menu-openner span').innerHTML = cart.length;
        

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let prodItem = productJson.find((item)=>item.id == cart[i].id);
            subtotal += prodItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let prodSizeName;
            cart[i].size == 0 ? prodSizeName = 'M' : '';
            cart[i].size == 1 ? prodSizeName = 'G' : '';
            cart[i].size == 2 ? prodSizeName = 'GG' : '';

            let prodName = `${prodItem.name} (${prodSizeName})`;
            cartItem.querySelector('img').src = prodItem.img;

            cartItem.querySelector('.cart--item-nome').innerHTML = prodName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1)
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        
        }   

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.', ',')}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`;

    } else {
        c('.menu-openner span').innerHTML = cart.length;
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}