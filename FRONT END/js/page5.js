// Fonction pour afficher un message d'erreur si le code est incorrect
function afficherErreur() {
    alert("Le code est incorrect.");
}

// Ajout d'un événement "submit" au formulaire
document.querySelector("form").addEventListener("submit", function(event) {
    // Empêcher le rechargement de la page
    event.preventDefault();

    // Récupération du code saisi
    var code = document.querySelector("#code").value;

    // Vérification du code
    if (code === "12345678") {
        // Code correct : redirection vers la page 6
        window.location.href = "../html/page5,1.html";
    } else {
        // Code incorrect : affichage d'un message d'erreur
        afficherErreur();
    }
});

// Gestion de l'événement pour le bouton "Annuler"
document.querySelector(".annuler").addEventListener("click", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du bouton
    window.history.back(); // Revenir à la page précédente
});
// Gestion de l'événement pour le bouton "Annuler"
document.querySelector(".annuler").addEventListener("click", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du bouton
    window.location.href = "page4.html"; // Redirection vers la page 4
});
