document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function(e) {

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        fetch('/login/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "/home";
            } else {
                console.error('Erro no login');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});