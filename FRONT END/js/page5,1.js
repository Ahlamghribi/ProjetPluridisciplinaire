document.addEventListener("DOMContentLoaded", function() {
    // Sélection des boutons "Suivant" et "Ignorer"
    const suivantBtn = document.querySelector('.svt');
    const ignorerBtn = document.querySelector('.ignorer');

    // Ajout d'un événement au clic sur le bouton "Suivant"
    suivantBtn.addEventListener('click', function() {
        // Redirection vers la page 6
        window.location.href = '../html/page6.html';
    });

    // Ajout d'un événement au clic sur le bouton "Ignorer"
    ignorerBtn.addEventListener('click', function() {
        // Redirection vers la page 8
        window.location.href = '../html/main.html';
    });
});
