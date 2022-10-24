function pumpAnimation(elements, event) {
    if (!Array.isArray(elements)) elements = [elements];
    elements.forEach(elem => {
        elem.addEventListener(event, () => {
            if (elem.classList.contains('anim-pump')) return;
            elem.classList.add('anim-pump');
            elem.onanimationend = () => {
                elem.classList.remove('anim-pump');
            }
        })
    });
}

function scaleDownAnimation(element) {
    element.classList.add('anim-scale-down');
}

let navArrows = [...document.querySelectorAll('.header__nav-arrow'), document.getElementById('home')];
pumpAnimation(navArrows, 'click');

let puzzle__trash = document.querySelector('.puzzle__trash');


