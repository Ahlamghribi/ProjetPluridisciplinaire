// Sélection du bouton "Sign-up"
const signupButton = document.getElementById('signupButton');
const passwordInput = document.getElementById('mot_de_passe');
const confirmPasswordInput = document.getElementById('confirm_mot_de_passe'); // Correction ici
const passwordToggle = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon'); // Nouvelle ligne pour sélectionner l'icône

// Ajout d'un écouteur d'événement sur le clic du bouton
signupButton.addEventListener('click', function(event) {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();

    // Récupération de la valeur du mot de passe
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Vérification si le mot de passe a une longueur minimale de 6 caractères
    if (password.length < 6) {
        // Affichage du message d'erreur
        passwordError.style.display = 'block';
    } else if (password !== confirmPassword) {
        // Vérification si les mots de passe correspondent
        passwordError.style.display = 'block';
        passwordError.textContent = "Passwords don't match.";
    } else {
        // Masquage du message d'erreur s'il y en avait un précédemment
        passwordError.style.display = 'none';

        // Récupération des autres valeurs des champs pour la redirection
        const nom = document.querySelector('input[name="nom"]').value;
        const prenom = document.querySelector('input[name="prenom"]').value;
        const dateNaissance = document.getElementById('date-naissance').value;
        const genre = document.querySelector('input[name="genre"]:checked');
        const role = document.querySelector('input[name="role"]:checked');
        const email = document.querySelector('input[name="email"]').value;
        const username = document.querySelector('input[name="username"]').value;

        // Vérification si tous les champs sont remplis
        if (nom !== '' && prenom !== '' && dateNaissance !== '' && genre !== null && role !== null && email !== '' && username !== '') {
            // Redirection vers la page 5 si tous les champs sont remplis
            window.location.href = '../html/page5.html'; // Remplacez 'page5.html' par le chemin de votre page 5
        } else {
            // Affichage d'un message d'erreur si tous les champs ne sont pas remplis
            alert('Veuillez remplir tous les champs.');
        }
    }
});

// Ajout d'un écouteur d'événement sur le clic du bouton de bascule de mot de passe
passwordToggle.addEventListener('click', function() {
    // Bascule entre les types "password" et "text" pour afficher ou masquer le mot de passe
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    confirmPasswordInput.setAttribute('type', type); // Correction ici

    // Met à jour l'icône en fonction de si le mot de passe est visible ou masqué
    if (type === 'password') {
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
});
