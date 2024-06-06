document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById('profile-image');
    const profileImageURL = localStorage.getItem('profileImage');

    if (profileImageURL) {
        profileImage.src = profileImageURL;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('photo');
    const profileImage = document.getElementById('profile-image');

    const photoForm = document.getElementById('photo-form');

    document.querySelector('.modifier').addEventListener('click', function(event) {
        event.preventDefault();
        photoInput.click();
    });

    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            profileImage.src = reader.result;
            localStorage.setItem('profileImage', reader.result);
        };

        reader.readAsDataURL(file);
    });

    photoForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });
});

document.getElementById("redirectionButton").addEventListener("click", function() {
    window.location.href = "../html/page8.html";
});
document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById('profile-image');
    const profileImageURL = localStorage.getItem('profileImagePath');

    if (profileImageURL) {
        profileImage.src = profileImageURL; // Affiche l'image sélectionnée sur la page 7
    }
});

document.getElementById("redirectionButton").addEventListener("click", function() {
    // Redirection vers une autre page
    window.location.href = "../html/page8.html";
});
