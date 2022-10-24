async function onload() {
    document.body.onload = async () => {
        await buildStyles('data/imports/styles.json');
        await buildMenu(history[historyIndex]);
    }
}

async function button(className, text, actions) {
    let container = document.createElement('div');
    let button = document.createElement('div');

    container.classList.add('node-container');
    button.classList.add(className);
    button.classList.add('unselectable');
    button.innerText = text;
    for (let action in actions) {
        button.addEventListener(action, () => {
            eval(actions[action])
        });
    }
    container.appendChild(button);

    return container;
}

async function inputText(className, placeholder, required, prompt, pattern) {
    let container = document.createElement('div');
    let input = document.createElement('input');
    let innerContainer = document.createElement('div');
    let promptContainer = document.createElement('div');

    container.classList.add('input-node-container');
    container.appendChild(input);
    container.appendChild(innerContainer);
    container.appendChild(promptContainer);
    innerContainer.classList.add('input-inner-container');
    promptContainer.classList.add('input-prompt-container');
    input.classList.add(className);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', placeholder);
    if (required) {
        input.setAttribute('required', '');
        let requiredIcon = document.createElement('div');
        requiredIcon.classList.add('input-required-icon');
        innerContainer.appendChild(requiredIcon);
    } else {
        let requiredIcon = document.createElement('div');
        requiredIcon.classList.add('input-required-icon');
        requiredIcon.classList.add('required-false');
        innerContainer.appendChild(requiredIcon);
    }
    if (prompt) {
        let promptBubble = document.createElement('div');
        promptBubble.classList.add('prompt-bubble');
        innerContainer.appendChild(promptBubble);
        promptContainer.innerText = prompt;
        promptBubble.onclick = () => {
            promptContainer.classList.toggle('open');
        }
    }
    if (pattern) {
        input.setAttribute('pattern', pattern);
    }

    return container;
}

async function toggle(className, text, active, prompt) {
    let container = document.createElement('div');
    let innerContainer = document.createElement('label');
    let toggle = document.createElement('input');
    let textContainer = document.createElement('div');
    let toggleSlider = document.createElement('div');
    let toggleBtn = document.createElement('div');
    let promptContainer = document.createElement('div');
    let promptBubble = document.createElement('div');
    let contentContainer = document.createElement('div');


    contentContainer.appendChild(innerContainer);
    contentContainer.appendChild(promptBubble);
    innerContainer.appendChild(toggle);
    innerContainer.appendChild(toggleSlider);
    innerContainer.appendChild(textContainer);
    toggleSlider.appendChild(toggleBtn);
    container.appendChild(contentContainer);
    container.appendChild(promptContainer);

    promptBubble.classList.add('prompt-bubble');
    toggleBtn.classList.add('toggle-btn');
    container.classList.add('input-node-container');
    promptContainer.innerText = prompt;
    promptContainer.classList.add('input-prompt-container');
    innerContainer.classList.add(className);
    contentContainer.classList.add('tgl-content-container');
    active ? toggle.setAttribute('checked', active) : false;
    toggle.setAttribute('type', 'checkbox');
    toggle.setAttribute('hidden', '');
    textContainer.innerText = text;
    textContainer.classList.add('toggle-text');
    toggleSlider.classList.add('toggle-slider');
    promptBubble.onclick = () => {
        promptContainer.classList.toggle('open');
    }

    return container;
}

async function puzzle(className, text, puzzles, prompt) {
    let container = document.createElement('div');
    let puzzle = document.createElement('div');
    let puzzleHeader = document.createElement('div');
    let puzzleText = document.createElement('div');
    let puzzlePromptBubble = document.createElement('div');
    let puzzleResult = document.createElement('div');
    let puzzleButtons = document.createElement('div');
    let puzzleInputContainer = document.createElement('div');
    let puzzleInput = document.createElement('input');
    let puzzleAddBtn = document.createElement('div');
    let puzzleBucket = document.createElement('div');
    let puzzlePrompt = document.createElement('div');
    let puzzleTrash = document.createElement('div');

    container.appendChild(puzzle);
    container.appendChild(puzzlePrompt);
    puzzle.appendChild(puzzleHeader);
    puzzle.appendChild(puzzleResult);
    puzzle.appendChild(puzzleTrash);
    puzzle.appendChild(puzzleButtons);
    puzzle.appendChild(puzzleInputContainer);
    puzzleHeader.appendChild(puzzleText);
    puzzleHeader.appendChild(puzzlePromptBubble);
    puzzleInputContainer.appendChild(puzzleInput);
    puzzleInputContainer.appendChild(puzzleAddBtn);
    puzzleInputContainer.appendChild(puzzleBucket);
    for (let puzzle in puzzles) {
        let puzzleButton = document.createElement('div');
        puzzleButton.innerText = puzzles[puzzle];
        puzzleButton.classList.add('puzzle__btn');
        puzzleButton.setAttribute('cond', puzzle);
        puzzleButton.onclick = () => {
            let resultPuzzleCond = document.createElement('span');
            resultPuzzleCond.innerText = puzzles[puzzle];
            resultPuzzleCond.classList.add('result__cond');
            puzzleResult.appendChild(resultPuzzleCond);
            puzzleInput.focus();
        }
        puzzleButtons.appendChild(puzzleButton);
        puzzleAddBtn.onclick = () => {
            let inp_value = puzzleInput.value;
            if (inp_value && inp_value.trim() !== '') {
                let resultPuzzleVal = document.createElement('span');
                resultPuzzleVal.innerText = inp_value;
                resultPuzzleVal.classList.add('result__val');
                puzzleResult.appendChild(resultPuzzleVal);
            }
            puzzleInput.focus();
            puzzleInput.value = '';
        }
        puzzlePromptBubble.onclick = () => {
            puzzlePrompt.classList.toggle('open');
        }
    }

    container.classList.add('node-container');
    puzzleInput.classList.add('inp');
    puzzleInput.setAttribute('placeholder', 'Ключ');
    puzzle.classList.add(className);
    puzzleTrash.innerHTML = '<svg class="trash" fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="64px" height="64px"><path d="M 28 6 C 25.791 6 24 7.791 24 10 L 24 12 L 23.599609 12 L 10 14 L 10 17 L 54 17 L 54 14 L 40.400391 12 L 40 12 L 40 10 C 40 7.791 38.209 6 36 6 L 28 6 z M 28 10 L 36 10 L 36 12 L 28 12 L 28 10 z M 12 19 L 14.701172 52.322266 C 14.869172 54.399266 16.605453 56 18.689453 56 L 45.3125 56 C 47.3965 56 49.129828 54.401219 49.298828 52.324219 L 51.923828 20 L 12 19 z M 20 26 C 21.105 26 22 26.895 22 28 L 22 51 L 19 51 L 18 28 C 18 26.895 18.895 26 20 26 z M 32 26 C 33.657 26 35 27.343 35 29 L 35 51 L 29 51 L 29 29 C 29 27.343 30.343 26 32 26 z M 44 26 C 45.105 26 46 26.895 46 28 L 45 51 L 42 51 L 42 28 C 42 26.895 42.895 26 44 26 z"/></svg>';
    puzzleHeader.classList.add('puzzle__header');
    puzzleText.classList.add('puzzle__title');
    puzzleText.innerText = text;
    puzzleTrash.classList.add('puzzle__trash');
    puzzlePromptBubble.classList.add('prompt-bubble');
    puzzleResult.classList.add('puzzle__result');
    puzzleButtons.classList.add('puzzle__buttons');
    puzzleInputContainer.classList.add('puzzle__input');
    puzzleBucket.classList.add('puzzle__bucket');
    puzzleAddBtn.innerText = '+';
    puzzlePrompt.classList.add('input-prompt-container');
    puzzleAddBtn.classList.add('puzzle__add');
    puzzlePrompt.innerText = prompt;

    $(puzzleResult).sortable();
    $(puzzleTrash).droppable({
        drop: (event) => {
            event.srcElement.remove();
        }
    });

    return container;
}

async function buildMenu(menuDataPath, container = document.querySelector('.content')) {
    let menuData = await getJson(menuDataPath);
    let menuContainer = document.createElement('div');
    let menuClassName = menuData['class'];
    let items = menuData['items'];

    menuContainer.classList.add(menuClassName);

    for (let item in items) {
        switch (items[item]['node']) {
            case 'button':
                let btnClassName = items[item]['class'];
                let btnText = items[item]['text'];
                let btnActions = items[item]['actions'];
                await menuContainer.appendChild(await button(btnClassName, btnText, btnActions));
                break;
            case 'input':
                if (items[item]['type'] === 'text') {
                    let inputClassName = items[item]['class'];
                    let inputPlaceholder = items[item]['placeholder'];
                    let inputRequired = items[item]['required'];
                    let inputPrompt = items[item]['prompt'];
                    let inputPattern = items[item]['pattern'];
                    await menuContainer.appendChild(await inputText(inputClassName, inputPlaceholder, inputRequired, inputPrompt, inputPattern));
                } else if (items[item]['type'] === 'checkbox') {
                    let inputClassName = items[item]['class'];
                    let inputText = items[item]['text'];
                    let inputPrompt = items[item]['prompt'];
                    let inputActive = items[item]['active'];
                    await menuContainer.appendChild(await toggle(inputClassName, inputText, inputActive, inputPrompt));

                }
                break;
            case 'puzzle':
                let puzzleClassName = items[item]['class'];
                let puzzleText = items[item]['text'];
                let puzzlePrompt = items[item]['prompt'];
                let puzzlePuzzles = items[item]['puzzles'];
                await menuContainer.appendChild(await puzzle(puzzleClassName, puzzleText, puzzlePuzzles, puzzlePrompt));
                break;
        }
    }

    if (container) {
        container.innerHTML = '';
        container.appendChild(menuContainer);
        await writeHistory(arguments[0])
        await showHideNavItems();
    } else {
        return menuContainer;
    }
}

async function buildStyles(cssStylesPath) {
    let stylesData = await getJson(cssStylesPath);
    for (let style of stylesData) {
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', style);
        document.head.append(link);
    }
}

onload().then();