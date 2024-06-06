document.addEventListener('DOMContentLoaded', () => {
    // Effacer toutes les données stockées localement lors du chargement de la page
    localStorage.clear();

    const profileImage = document.getElementById('profile-image');
    const ajouterBtn = document.querySelector('.ajouter');
    const photoInput = document.getElementById('photo');
    const photoForm = document.getElementById('photo-form');

    const profileImageURL = localStorage.getItem('profileImagePath');

    if (profileImageURL) {
        profileImage.src = profileImageURL;
    }

    ajouterBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            localStorage.setItem('profileImagePath', reader.result);
            window.location.href = '../html/page7.html';
        };

        reader.readAsDataURL(file);
    });

    // Ajoutez un écouteur d'événements de soumission au formulaire
    photoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement
        window.location.href = '../html/page8.html'; // Redirige vers la page 8
    });
});
