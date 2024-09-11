const addToCartButton = document.getElementById('add-to-cart-button');

addToCartButton.addEventListener('click', () => {
    const _id = addToCartButton.getAttribute('data-product-id'); 
    fetch(`http://${url}/api/products/${_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        window.userData().then(user => {
            const cart_id = user.payload.cart._id
            const product_id = data.payload._id

            fetch(`http://${url}/api/carts/${cart_id}/products/${product_id}`, {
                method: 'PUT',
                headers: { contentType: 'application/json'}
            })
            .then(res => res.json())
            .then(data => {
                console.log('Respuesta PUT exitosa:', data);
                window.updateCartNumber()
            })
            .catch(error => {
                console.error('Error al realizar la solicitud PUT:', error);
            });

        })
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud Fetch:', error);
    });
    
});

