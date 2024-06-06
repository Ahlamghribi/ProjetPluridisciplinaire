document.addEventListener("DOMContentLoaded", function() {
    var profileImagePath = localStorage.getItem('profileImagePath');
    var profileImageElement = document.getElementById("profile-image");
    if (profileImageElement && profileImagePath) {
        profileImageElement.src = profileImagePath;
    }

    var nomUtilisateur = localStorage.getItem('nom_utilisateur');
    var nomUtilisateurElement = document.querySelector(".nom-utilisateur");
    if (nomUtilisateurElement && nomUtilisateur) {
        nomUtilisateurElement.textContent = nomUtilisateur;
    }

 
        // Sélection du formulaire
        var form = document.querySelector('form');
        if (form) {
            // Ajout d'un écouteur d'événement sur la soumission du formulaire
            form.addEventListener('submit', function(event) {
                // Empêcher le comportement par défaut du formulaire
                event.preventDefault();
    
                // Récupération du bouton cliqué
                var clickedButton = event.submitter;
    
                // Vérification du nom du bouton
                if (clickedButton && clickedButton.classList.contains('enregistrer')) {
                    // Bouton "Enregistrer" cliqué
                    enregistrerAction();
                } else if (clickedButton && clickedButton.classList.contains('ignore')) {
                    // Bouton "Ignorer" cliqué
                    ignorerAction();
                }
            });
        }
    
        // Fonction pour l'action "Enregistrer"
        function enregistrerAction() {
            // Récupération de la valeur saisie dans le champ de la biographie
            var boiValue = document.getElementById('boi').value;
    
            // Vérification si la valeur de la biographie n'est pas vide
            if (boiValue.trim() !== '') {
                // Stockage de la biographie dans le stockage local pour affichage ultérieur
                localStorage.setItem('biographie', boiValue);
            }
    
            // Redirection vers la page index.html
            window.location.href = '../html/main.html';
        }
    
        // Fonction pour l'action "Ignorer"
        function ignorerAction() {
            // Redirection vers la page index.html
            window.location.href = '../html/main.html';
        }
    ;
    
});
