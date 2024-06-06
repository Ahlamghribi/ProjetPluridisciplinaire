document.addEventListener('DOMContentLoaded', function() {
    // Sélection du bouton "Search"
    const searchButton = document.querySelector('.svt');

    // Ajout d'un écouteur d'événement sur le clic du bouton "Search"
    searchButton.addEventListener('click', function() {
        // Récupération de la valeur de l'email
        const email = document.querySelector('input[name="code"]').value;

        // Envoi de la requête au backend pour vérifier l'email
        fetch('/verification-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.exists) {
                // Si l'email existe, rediriger vers la page de saisie du mot de passe
                window.location.href = '../html/nvmdp.html';
            } else {
                // Afficher un message d'erreur si l'email n'existe pas
                alert('Email not found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Sélection du bouton "Cancel"
    const cancelButton = document.getElementById('cancelButton');

    // Ajout d'un écouteur d'événement sur le clic du bouton "Cancel"
    cancelButton.addEventListener('click', function() {
        // Redirection vers une autre page lorsque le bouton "Cancel" est cliqué
        window.location.href = '../html/page2.html'; 
    });
});
