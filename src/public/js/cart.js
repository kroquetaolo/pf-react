const purchaseButton = document.getElementById('cart-purchase-button');
if(purchaseButton){ 
    purchaseButton.addEventListener('click', () => {
        const cart_id = purchaseButton.getAttribute('data-cart-id'); 
        fetch(`${protocol}//${url}/api/carts/${cart_id}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Éxito:', data);
            const has_items = data.payload.ticket.amount !== 0
            Swal.fire({
                icon: has_items ? "success" : "question",
                title: has_items ? data.payload.message : "No items available to purchase",
                html:  has_items ?`Ticket: ${data.payload.ticket.code}<br>
                        Price: ${data.payload.ticket.amount}<br>
                        Mail: ${data.payload.ticket.purchaser}` : 'check the stock before purchase'
                        ,
                showCloseButton: true
            }).then(() => {
                if(has_items) location.reload(true);
            }); 
            
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud Fetch:', error);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const removeButtons = document.querySelectorAll('.remove-product-button');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product_id = button.getAttribute('product-to-remove');
            const cart_id = button.getAttribute('cart-to-remove');

            fetch(`${protocol}//${url}/api/carts/${cart_id}/products/${product_id}`, {
                method: 'DELETE',
                headers: { contentType: 'application/json'}
            })
            .then(data => {
                console.log('Respuesta DELETE exitosa:', data);
                window.updateCartNumber()
                location.reload(true);
            })
            .catch(error => {
                console.error('Error al realizar la solicitud DELETE:', error);
            });

        });
    });
});