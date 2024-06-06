document.addEventListener('DOMContentLoaded', function() {
    // Sélection du bouton "OK"
    const okButton = document.querySelector('.svt');

    // Ajout d'un écouteur d'événement sur le clic du bouton "OK"
    okButton.addEventListener('click', function() {
        // Récupération de la valeur du code et du nouveau mot de passe
        const code = document.querySelector('input[name="email"]').value;
        const newPassword = document.querySelector('input[name="username"]').value;

        // Vérification si le code est le même que celui envoyé précédemment
        const previousCode = sessionStorage.getItem('verificationCode'); // Récupération du code précédent de sessionStorage
        if (code !== previousCode) {
            alert('Wrong code. Please enter the correct code.'); // Message d'erreur si le code est incorrect
            return; // Arrête l'exécution du code restant
        }

        // Vérification de la longueur du mot de passe
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long.'); // Message d'erreur si le mot de passe est trop court
            return; // Arrête l'exécution du code restant
        }

        // Vous pouvez ajouter ici la logique pour changer le mot de passe dans la base de données ou effectuer d'autres actions nécessaires

        // Redirection vers la page de confirmation si tout est réussi
        window.location.href = '../html/main.html'; // Remplacez 'page_confirmation.html' par le chemin 
    });

    // Sélection du bouton "Cancel"
    const cancelButton = document.querySelector('.ignorer');

    // Ajout d'un écouteur d'événement sur le clic du bouton "Cancel"
    cancelButton.addEventListener('click', function() {
        // Redirection vers une autre page lorsque le bouton "Cancel" est cliqué
        window.location.href = '../html/page2.html'; 
    });

    // Ajout d'un écouteur d'événement sur le clic du bouton pour afficher/masquer le mot de passe
    const passwordToggle = document.getElementById('togglePassword');
    passwordToggle.addEventListener('click', function() {
        const passwordInput = document.getElementById('mot_de_passe');
        const toggleIcon = document.getElementById('toggleIcon');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'password') {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    });
});
