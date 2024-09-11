document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('body');

    productList.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('deleteButton')) {
            const productId = event.target.getAttribute('data-product-id');

            fetch(`http://localhost:8080/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Product deleted:', data);
                event.target.parentElement.remove();
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    });
});
