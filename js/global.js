const settings = {
    host: 'http://localhost:8080/'
}

let themeDarkColors = {
    '--color-base-text': 'black',
    '--color-primary': '#8774e1',
    '--color-primary-shade': '#877dcc',
    '--color-primary-shade-darker': '#b5a5ff',
    '--color-primary-dark': 'white',
    '--color-primary-dark-transparent': 'rgba(199, 152, 255, 0.35)',
    '--color-light': '#212121',
    '--color-placeholder': '#c0c0c0',
    '--color-placeholder-second': '#4b4b4b',
    '--color-placeholder-light': '#313131',
    '--color-error-lighten': '#2a2a2a',
    '--color-error-light': '#5e3838',
    '--color-error-medium': '#a95656',
    '--color-error': '#e17474',
    '--color-error-dark': '#f54747',
}

let historyIndex = (() => {
    if (window.localStorage.getItem('historyIndex')) {
        return Number(window.localStorage.getItem('historyIndex'));
    } else {
        return 0;
    }
})();

let history = (() => {
    if (window.localStorage.getItem('history')) {
        return window.localStorage.getItem('history').split(',');
    } else {
        return ['data/menus/menu_index.json'];
    }
})();

async function writeHistory(currentPage) {
    if (currentPage !== history[historyIndex] && currentPage !== history[0]) {
        if (!history.includes(currentPage)) {
            history.push(currentPage);
        }
        historyIndex += 1;
    }
    window.localStorage.setItem('historyIndex', historyIndex);
    window.localStorage.setItem('history', history.toString());
}

async function goHistory(direction) {
    switch (direction) {
        case 1:
            if (historyIndex < history.length - 1) {
                historyIndex += 1;
            }
            break;
        case 0:
            historyIndex = 0;
            break;
        case -1:
            if (historyIndex !== 0) {
                historyIndex -= 1;
            }
            break;
    }
}

async function showHideNavItems() {
    if (historyIndex === 0) {
        homeIcon.classList.add('disabled')
        leftArrow.classList.add('disabled');
    } else {
        scaleDownAnimation(homeIcon);
        leftArrow.classList.remove('disabled');
        homeIcon.classList.remove('disabled');
    }
    if (historyIndex === history.length - 1) {
        rightArrow.classList.add('disabled');
    } else {
        rightArrow.classList.remove('disabled');
    }
}

async function getJson(jsonPath) {
    return await fetch(jsonPath)
        .then(resp => resp.json());
}

