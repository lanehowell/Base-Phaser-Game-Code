export function fadeTransition() {
    const fadeElement = document.getElementById('fade-transition')
    fadeElement.style.opacity = '1'
    setTimeout(() => {
        fadeElement.style.opacity = '0'
    }, 1500)
}