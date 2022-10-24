const rightArrow = document.querySelector('.header__nav_right');
const leftArrow = document.querySelector('.header__nav_left');
const homeIcon = document.getElementById('home');

leftArrow.onclick = async () => {
    await goHistory(-1);
    await buildMenu(history[historyIndex]);
    await console.log(historyIndex);
}
rightArrow.onclick = async () => {
    await goHistory(1);
    await buildMenu(history[historyIndex]);
    await console.log(historyIndex);
}

homeIcon.onclick = async () => {
    await goHistory(0);
    await buildMenu('data/menus/menu_index.json');
}