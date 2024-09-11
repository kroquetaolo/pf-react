const url = window.location.host;

const user_menu_button = document.querySelector('#user-menu-button')
const menu_button = document.querySelector('[aria-controls="mobile-menu"]')

user_menu_button.addEventListener('click', () => {
    const drowpdown = document.querySelector('[role="menu"]')
    drowpdown.classList.toggle('hidden')
})


menu_button.addEventListener('click', () => {
    const menu_toggle = document.querySelector('#mobile-menu')
    const is_open = menu_toggle.classList.toggle('hidden')
    menu_button.setAttribute('aria-expanded', is_open)
})

const modal_buttons = document.querySelectorAll('[data-modal-target]')

modal_buttons.forEach(button => {
    button.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal-target')
        const modal = document.getElementById(modalId)
        if (modal) {
            modal.classList.toggle('hidden')
        }
    })
})

const close_modal_buttons = document.querySelectorAll('[data-modal-hide]')

close_modal_buttons.forEach(button => {
    button.addEventListener('click', function() {
        const modal_id = this.getAttribute('data-modal-hide')
        const modal = document.getElementById(modal_id)
        if (modal) {
            modal.classList.add('hidden')
        }
        
    })
})

//NUMERO DE CARTS
const userData = async () => {
    try {
        const response = await fetch(`http://${url}/api/sessions/current`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        return { payload: null };  // o alguna estructura de datos de respaldo
    }
};

let cartNumberElement = document.getElementById('cart-number');
const updateCartNumber = async () => {
    const data = await userData();
    let cart_length = 0;
    if (data.payload) {
        const products = data.payload.cart.products;
        products.forEach(p => {
            cart_length += p.quantity;
        });
        cartNumberElement.textContent = `${cart_length}`;
    }
};

if(window.user) updateCartNumber()

window.userData = userData
window.updateCartNumber = updateCartNumber

//IMAGEN Y BOTTON PARA DETALLE

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('#products-img');
    const buttons = document.querySelectorAll('#products-button');

    images.forEach(img => {
        img.addEventListener('click', () => {
            const url = img.getAttribute('data-url');
            window.location.href = url;
        });
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            window.location.href = url;
        });
    });
});