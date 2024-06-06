const markRead = document.querySelector("h2");
const names = document.querySelectorAll(".name");
const postText = document.querySelectorAll(".post-text");
const groups = document.querySelectorAll(".group");
const pm = document.querySelectorAll(".pm");
const notification = document.querySelectorAll(".notification");
let number = document.querySelector("#number")

// Link mouseover events
markRead.onmouseover = () => {
    markRead.style.color = "hsl(219, 85%, 26%)";
    document.body.style.cursor = "pointer";
}
markRead.onmouseout = () => {
    markRead.style.color = "hsl(219, 12%, 42%)";
    document.body.style.cursor = "default";
}

names.forEach(names => names.onmouseover = () => names.style.color = "hsl(219, 85%, 26%)");
names.forEach(names => names.onmouseout = () => names.style.color = "hsl(224, 21%, 14%)");

postText.forEach(postText => postText.onmouseover = () => postText.style.color = "hsl(219, 85%, 26%)");
postText.forEach(postText => postText.onmouseout = () => postText.style.color = "hsl(219, 12%, 42%)");

groups.forEach(groups => groups.onmouseover = () => groups.style.color = "hsl(219, 85%, 26%)");
groups.forEach(groups => groups.onmouseout = () => groups.style.color = "hsl(219, 12%, 42%)");

pm.forEach(pm => pm.onmouseover = () => pm.style.background = "hsl(211, 68%, 94%)");
pm.forEach(pm => pm.addEventListener("mouseout", function () {
    let pmNotif = pm.closest("div.notification");
    pm.style.background = pmNotif.style.background
}))

// Notifications - Individually Clicked
notification.forEach(notification => notification.addEventListener("click", function () {
    notification.style.background = "hsl(0, 0%, 100%)";
    const redDot = notification.querySelector("i");
    redDot.style.display = "none";
    number.innerHTML = `${number.innerHTML - 1}`;
}))

// Notifications - Mark All Read button
markRead.onclick = () => {
    notification.forEach(notification => {
        notification.style.background = "hsl(0, 0%, 100%)";
        const redDot = notification.querySelector("i");
        redDot.style.display = "none";
        number.innerHTML = 0;
    })
}






