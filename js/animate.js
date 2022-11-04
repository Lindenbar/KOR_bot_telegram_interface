function pumping(elem) {
    if (elem.classList.contains('anim-pump')) return;
    elem.classList.add('anim-pump');
    elem.onanimationend = () => {
        elem.classList.remove('anim-pump');
    }
}

function pumpAnimation(elements, event) {
    if (!Array.isArray(elements)) elements = [elements];
    elements.forEach(elem => {
        if (event) {
            elem.addEventListener(event, () => {
                pumping(elem);
            })
        } else {
            pumping(elem);
        }
    });
}

function bubbleAnimation(element) {
    if (!element.classList.contains('bubble-open')) {
        element.classList.remove('bubble-closed');
        element.classList.add('bubble-open');
    } else {
        (element.classList.contains('bubble-open'))
        element.classList.remove('bubble-open');
        element.classList.add('bubble-closed');
    }
}

function scaleDownAnimation(element) {
    element.classList.add('anim-scale-down');
}

let navArrows = [...document.querySelectorAll('.header__nav-arrow'), document.getElementById('home')];
pumpAnimation(navArrows, 'click');

let puzzle__trash = document.querySelector('.puzzle__trash');


