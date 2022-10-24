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

