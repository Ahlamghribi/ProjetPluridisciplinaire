document.addEventListener("DOMContentLoaded", function() {
  // Récupérez le bouton de la caméra par son identifiant
  const btnCamera = document.querySelector('.camera');

  // Ajoutez un écouteur d'événements de clic au bouton de la caméra
  btnCamera.addEventListener('click', function() {
      // Redirigez vers la page video.html
      window.location.href = '../html/video.html';
  });

  // Récupérez le bouton du microphone
  const micButton = document.querySelector('.mic');

  // Ajoutez un écouteur d'événements de clic au bouton de micro
  micButton.addEventListener('click', function() {
    console.log("Microphone button clicked!"); // Vérifiez si le clic est détecté
    // Toggle entre les icônes micro et micro muet
    micButton.classList.toggle('muted');
  });
});
