document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.querySelector('body');
    usersList.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('switchUserButton')) {
            const userId = event.target.getAttribute('data-user-id');
            fetch(`http://localhost:8080/api/users/premium/${userId}`, {
                method: 'POST',
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
                const userElement = event.target.closest('div');
                if (userElement) {
                    const rolElement = userElement.querySelector('p:nth-of-type(2)');
                    if (rolElement) {
                        rolElement.textContent === 'Rol: user' ? 
                            rolElement.textContent = `Rol: premium` 
                                :
                            rolElement.textContent = `Rol: user`
                        
                    }
                }
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    });
});
