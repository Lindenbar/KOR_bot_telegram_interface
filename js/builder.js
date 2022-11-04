async function onload() {
    document.body.onload = async () => {
        await buildStyles('data/imports/styles.json');
        await buildMenu(history[historyIndex]);

        if (telegram.colorScheme === 'dark') {
            let root = document.querySelector(':root');
            for (let colorName in themeDarkColors) {
                root.style.setProperty(colorName, themeDarkColors[colorName]);
            }
        }
    }
}

async function collapseSplitters() {
    let splitters = document.querySelectorAll('.spl');

    for await (let splitter of splitters) {
        let container = splitter.parentNode;
        let nextElem = container.nextSibling;
        let splitterContainer = container.querySelector('.spl-container');

        while (!nextElem.classList.contains('spl-end')) {
            splitterContainer.appendChild(nextElem);
            nextElem = container.nextSibling;
        }

        let splitterEnd = container.nextSibling;
        splitterEnd.remove();
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

async function inputText(className, placeholder, required, prompt, pattern, dataName, attributes) {
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
    input.setAttribute('data-name', dataName);
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
        promptContainer.innerHTML = prompt;
        promptBubble.onclick = () => {
            promptContainer.classList.toggle('open');
            bubbleAnimation(promptBubble);
        }
    }
    if (pattern) {
        input.setAttribute('pattern', pattern);
    }

    input.oninput = () => {
        if (input.validity.valid) {
            input.setAttribute('data', input.value);
        } else {
            if (input.getAttribute('data')) {
                input.removeAttribute('data');
            }
        }
    }

    if (attributes) {
        for (let attr in attributes) {
            input.setAttribute(attr, attributes[attr]);
        }
    }

    return container;
}

async function toggle(className, text, active, prompt, dataName) {
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
    promptContainer.innerHTML = prompt;
    promptContainer.classList.add('input-prompt-container');
    innerContainer.classList.add(className);
    contentContainer.classList.add('tgl-content-container');
    active ? toggle.setAttribute('checked', active) : false;
    toggle.setAttribute('type', 'checkbox');
    toggle.setAttribute('hidden', '');
    toggle.setAttribute('data-name', dataName);
    toggle.setAttribute('data', String(toggle.checked));
    textContainer.innerHTML = text;
    textContainer.classList.add('toggle-text');
    toggleSlider.classList.add('toggle-slider');
    promptBubble.onclick = () => {
        promptContainer.classList.toggle('open');
        bubbleAnimation(promptBubble);
    }
    toggle.onclick = () => {
        toggle.setAttribute('data', String(toggle.checked));
    }

    return container;
}

async function puzzle(className, text, puzzles, prompt, dataName) {
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
    let observer = new MutationObserver(() => {
        let data = '';
        [...puzzleResult.querySelectorAll('span')].forEach(elem => {
            data += elem.getAttribute('data');
        });
        if (data !== '') {
            puzzleResult.setAttribute('data', data);
        } else {
            puzzleResult.removeAttribute('data');
        }
    });

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
        puzzleButton.innerHTML = puzzles[puzzle];
        puzzleButton.classList.add('puzzle__btn');
        puzzleButton.classList.add('unselectable');
        puzzleButton.setAttribute('cond', puzzle);
        puzzleButton.onclick = () => {
            let resultPuzzleCond = document.createElement('span');
            resultPuzzleCond.innerHTML = puzzles[puzzle];
            resultPuzzleCond.classList.add('result__cond');
            resultPuzzleCond.setAttribute('data', puzzle + '___');
            puzzleResult.appendChild(resultPuzzleCond);
            puzzleInput.focus({preventScroll: true});
        }
        puzzleButtons.appendChild(puzzleButton);
    }

    puzzleAddBtn.onclick = () => {
        let inp_value = puzzleInput.value;
        if (inp_value && inp_value.trim() !== '') {
            let resultPuzzleVal = document.createElement('span');
            resultPuzzleVal.innerHTML = inp_value;
            resultPuzzleVal.classList.add('result__val');
            resultPuzzleVal.setAttribute('data', inp_value + '___');
            puzzleResult.appendChild(resultPuzzleVal);
        }
        puzzleInput.focus({preventScroll: true});
        puzzleInput.value = '';
    }
    puzzlePromptBubble.onclick = () => {
        puzzlePrompt.classList.toggle('open');
        bubbleAnimation(puzzlePromptBubble);
    }

    container.classList.add('node-container');
    puzzleInput.classList.add('inp');
    puzzleInput.setAttribute('placeholder', 'Ключ');
    puzzle.classList.add(className);
    puzzleTrash.innerHTML = '<svg class="trash" fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="64px" height="64px"><path d="M 28 6 C 25.791 6 24 7.791 24 10 L 24 12 L 23.599609 12 L 10 14 L 10 17 L 54 17 L 54 14 L 40.400391 12 L 40 12 L 40 10 C 40 7.791 38.209 6 36 6 L 28 6 z M 28 10 L 36 10 L 36 12 L 28 12 L 28 10 z M 12 19 L 14.701172 52.322266 C 14.869172 54.399266 16.605453 56 18.689453 56 L 45.3125 56 C 47.3965 56 49.129828 54.401219 49.298828 52.324219 L 51.923828 20 L 12 19 z M 20 26 C 21.105 26 22 26.895 22 28 L 22 51 L 19 51 L 18 28 C 18 26.895 18.895 26 20 26 z M 32 26 C 33.657 26 35 27.343 35 29 L 35 51 L 29 51 L 29 29 C 29 27.343 30.343 26 32 26 z M 44 26 C 45.105 26 46 26.895 46 28 L 45 51 L 42 51 L 42 28 C 42 26.895 42.895 26 44 26 z"/></svg>';
    puzzleHeader.classList.add('puzzle__header');
    puzzleText.classList.add('puzzle__title');
    puzzleText.innerHTML = text;
    puzzleTrash.classList.add('puzzle__trash');
    puzzlePromptBubble.classList.add('prompt-bubble');
    puzzleResult.classList.add('puzzle__result');
    puzzleResult.setAttribute('data-name', dataName);
    puzzleResult.setAttribute('type', 'puzzle');
    puzzleButtons.classList.add('puzzle__buttons');
    puzzleInputContainer.classList.add('puzzle__input');
    puzzleBucket.classList.add('puzzle__bucket');
    puzzleAddBtn.innerText = '+';
    puzzlePrompt.classList.add('input-prompt-container');
    puzzleAddBtn.classList.add('puzzle__add');
    puzzleAddBtn.classList.add('unselectable');
    puzzlePrompt.innerHTML = prompt;

    $(puzzleResult).sortable({
        placeholder: 'pointer',
        start: (event) => {
            pumpAnimation(event.srcElement);
        },
        stop: (event) => {
            event.srcElement.classList.remove('anim-pump');
        }
    });
    $(puzzleTrash).droppable({
        drop: (event) => {
            let droppedElem = event.srcElement;
            pumpAnimation(puzzleTrash.querySelector('.trash'));
            droppedElem.remove();
        }
    });

    observer.observe(puzzleResult, {childList: true});

    return container;
}

async function splitter(title) {
    let container = document.createElement('div');
    let splitter = document.createElement('h2');
    let splitterContainer = document.createElement('div');

    container.classList.add('node-container');
    splitter.classList.add('spl');
    splitter.innerHTML = title;
    splitterContainer.classList.add('spl-container');

    // splitter.onclick = () => {
    //     splitterContainer.classList.toggle('open');
    // }

    container.appendChild(splitter);
    container.appendChild(splitterContainer);

    return container;
}

async function splitterEnd() {
    let splitterEnd = document.createElement('div');
    splitterEnd.classList.add('spl-end');
    return splitterEnd;
}

async function select(title, options, dataName, deepData) {
    let container = document.createElement('div');
    let select = document.createElement('div');
    let selectTitle = document.createElement('h2');
    let selectField = document.createElement('div');
    let selectToggle = document.createElement('div');
    let selectOptions = document.createElement('div');
    let selectValue = document.createElement('div');

    container.classList.add('node-container');
    select.classList.add('slt');
    selectTitle.innerText = title;
    selectTitle.classList.add('slt__title');
    selectField.classList.add('slt__field');
    selectField.setAttribute('data', '');
    selectField.setAttribute('data-name', dataName);
    selectField.setAttribute('tabindex', '0');
    selectToggle.classList.add('slt__toggle');
    selectToggle.classList.add('unselectable');
    selectValue.classList.add('slt__value');
    selectOptions.classList.add('slt__options');

    container.appendChild(select);
    select.appendChild(selectTitle);
    select.appendChild(selectField);
    select.appendChild(selectOptions);
    selectField.appendChild(selectValue);
    selectField.appendChild(selectToggle);

    selectField.onblur = () => {
        if (!selectOptions.matches(':hover')) {
            select.classList.remove('open');
        }
    }

    selectField.onclick = () => {
        select.classList.toggle('open');
    }

    // selectOptions.style.width = getComputedStyle(selectTitle).width;
    // window.onresize = () => {
    //     selectOptions.style.width = getComputedStyle(selectTitle).width;
    // }

    if (Array.isArray(options)) {
        if (options.length === 0) {
            selectValue.innerText = 'Данные не обнаружены';
            return;
        }

        let first = true;
        let index = 0;
        for (let item in options) {
            let option = document.createElement('div');
            option.classList.add('slt__option');
            option.setAttribute('id', String(index));
            option.innerText = options[item];
            option.onclick = () => {
                selectField.setAttribute('data', item);
                selectValue.innerText = options[item];
                select.classList.remove('open');
            }
            if (first) {
                selectField.setAttribute('data', item);
                selectValue.innerText = options[item];
                option.setAttribute('selected', '');
                first = false;
            }
            selectOptions.appendChild(option);
            index += 1;
        }
    } else if (options.startsWith('request:')) {
        let request = options.split(':')[1];
        await getJson(settings.host + request)
            .then(json => {

                if (Object.keys(json).length === 0) {
                    selectValue.innerText = 'Данные не обнаружены';
                    return;
                }

                let first = true;
                for (let data in json) {
                    let option = document.createElement('div');
                    let innerText = deepData ? eval(`json[data]${deepData}`): json[data];
                    option.classList.add('slt__option');
                    option.setAttribute('id', data)
                    option.innerText = innerText;
                    option.onclick = () => {
                        selectField.setAttribute('data', JSON.stringify(json[data]));
                        selectValue.innerText = innerText;
                        select.classList.remove('open');
                    }
                    if (first) {
                        selectField.setAttribute('data', JSON.stringify(json[data]));
                        selectValue.innerText = innerText;
                        option.setAttribute('selected', '');
                        first = false;
                    }
                    selectOptions.appendChild(option);
                }
            });

    }

    let opts = [...selectOptions.querySelectorAll('.slt__option')];
    let observer = new MutationObserver(() => {
        opts.forEach(option => {
            if (option.getAttribute('id') === selectField.getAttribute('data')) {
                option.setAttribute('selected', '');
            } else {
                option.removeAttribute('selected');
            }
        })
    });
    observer.observe(selectField, {attributes: true});

    return container;
}

async function selectSwitch(title, options, choices, dataName) {
    let container = document.createElement('div');
    let selectSwitch = document.createElement('div');
    let selectSwitchVal = document.createElement('div');
    let selectSwitchChoice = document.createElement('div');

    container.classList.add('node-container');
    selectSwitch.classList.add('swh');
    selectSwitchVal.classList.add('swh__value');
    selectSwitchChoice.classList.add('swh__choice');

    container.appendChild(selectSwitch);
    selectSwitch.appendChild(selectSwitchVal)
    selectSwitch.appendChild(selectSwitchChoice);

    selectSwitchVal.appendChild(await select(title, options, dataName));

    let selectField = selectSwitchVal.querySelector('.slt__field');
    let observer = new MutationObserver(async () => {
        let data = selectField.getAttribute('data');
        let choiceData = choices[data];
        let choice;
        for (let choiceKey in choiceData) {
            choice = await buildNode(choiceData, choiceKey);
            selectSwitchChoice.innerHTML = '';
            selectSwitchChoice.appendChild(choice);
        }
    });

    observer.observe(selectField, {attributes: true});

    selectField.setAttribute('observer-trigger', '');

    return container;
}

async function buildMenu(menuDataPath, container = document.querySelector('.content')) {
    let menuData = await getJson(menuDataPath);
    let menuContainer = document.createElement('div');
    let menuClassName = menuData['class'];
    let title = menuData['title'];
    let items = menuData['items'];
    let type = menuData['type'];
    let query = menuData['query'];

    type === 'settings' ? telegram.MainButton.show() : telegram.MainButton.hide();

    menuContainer.classList.add(menuClassName);

    if (query) {
        menuContainer.setAttribute('query', String(query))
    }

    if (title) {
        let menuTitle = document.createElement('h1');
        menuTitle.innerHTML = title;
        menuTitle.classList.add('menu-title');
        menuContainer.appendChild(menuTitle);
    }

    for (let item in items) {
        menuContainer.appendChild(await buildNode(items, item));
    }

    if (container) {
        container.innerHTML = '';
        container.appendChild(menuContainer);
        await writeHistory(arguments[0]);
        await showHideNavItems();
        await collapseSplitters();
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

async function table(title, headers, data, actions, checkable, id) {
    let container = document.createElement('div');
    let tableContainer = document.createElement('div');
    let table = document.createElement('table');
    let tableTitle = document.createElement('h3');
    let tableHeaders = document.createElement('tr');
    let tableActionsContainer = document.createElement('div');
    let tableExtraContainer = document.createElement('div');

    container.classList.add('node-container');
    container.appendChild(tableTitle);
    tableExtraContainer.classList.add('tbl__extra-container');
    tableTitle.innerText = title;
    tableTitle.classList.add('tbl__title');
    container.appendChild(tableContainer);
    tableContainer.appendChild(table);
    tableContainer.classList.add('tbl__container');
    table.classList.add('tbl');
    table.setAttribute('id', id);
    tableHeaders.classList.add('tbl__headers');
    table.appendChild(tableHeaders);
    tableActionsContainer.classList.add('tbl__actions-container');

    for (let header in headers) {
        let tableHeader = document.createElement('td');
        tableHeader.innerText = header;
        tableHeaders.appendChild(tableHeader);
    }

    if (checkable) {
        let tableCheck = document.createElement('input');
        let tableCheckableCell = document.createElement('td');
        tableCheckableCell.classList.add('tbl__check-container');
        tableCheck.setAttribute('type', 'checkbox');
        tableCheck.onchange = () => {
            let allCheckboxes = [...document.querySelectorAll('input[type="checkbox"]')];
            allCheckboxes.forEach(checkbox => {
                tableCheck.checked ? checkbox.checked = true : checkbox.checked = false;
            });
        }
        tableCheckableCell.appendChild(tableCheck);
        tableHeaders.appendChild(tableCheckableCell);
    }

    if (data.startsWith('request:')) {
        let request = data.split(':')[1];
        fetch(settings.host + request)
            .then(res => res.json())
            .then(json => {
                for (let data of json) {
                    let i = 0;
                    let tableRow = document.createElement('tr');
                    tableRow.classList.add('tbl__row');
                    table.appendChild(tableRow);
                    for (let key in data) {
                        let headersData = headers[Object.keys(headers)[i]]
                        let colType = headersData['type'];
                        let isEditable = headersData['editable'];
                        let value = data[key];
                        let tableCell = document.createElement('td');
                        let tableInput = document.createElement('input');

                        tableInput.setAttribute('data-name', key);
                        tableInput.setAttribute('data', value);
                        tableInput.setAttribute('type', 'text');
                        if (isEditable) {
                            tableInput.ondblclick = () => {
                                tableInput.classList.add('editable');
                            }
                            tableInput.onblur = () => {
                                tableInput.classList.remove('editable');
                            }
                            tableInput.onchange = () => {
                                tableInput.setAttribute('data', tableInput.value);
                            }
                        } else {
                            tableInput.setAttribute('disabled', '');
                        }

                        if (colType === 'bool') {
                            value = value === 1 ? headersData['true'] : headersData['false'];
                        }

                        tableInput.value = value;
                        tableCell.appendChild(tableInput);
                        tableRow.appendChild(tableCell);
                        i++;
                    }
                    if (checkable) {
                        let tableCheck = document.createElement('input');
                        let tableCheckableCell = document.createElement('td');
                        tableCheckableCell.classList.add('tbl__check-container');
                        tableCheck.setAttribute('type', 'checkbox');
                        tableCheckableCell.appendChild(tableCheck);
                        tableRow.appendChild(tableCheckableCell);
                    }
                }
            })
            .then(() => {
                for (let key in actions) {
                    let actionButton = document.createElement('div');
                    actionButton.classList.add('tbl__action-btn');
                    actionButton.innerText = actions[key]['text'];
                    actionButton.onclick = () => {
                        eval(actions[key]['func']);
                    };
                    tableActionsContainer.appendChild(actionButton);
                }

                container.appendChild(tableActionsContainer);
                container.appendChild(tableExtraContainer);
            });
    }

    return container
}

async function buildNode(nodeData, nodeKey) {
    switch (nodeData[nodeKey]['node']) {
        case 'button':
            let btnClassName = nodeData[nodeKey]['class'];
            let btnText = nodeData[nodeKey]['text'];
            let btnActions = nodeData[nodeKey]['actions'];
            return await button(btnClassName, btnText, btnActions, nodeKey);
        case 'input':
            if (nodeData[nodeKey]['type'] === 'text') {
                let inputClassName = nodeData[nodeKey]['class'];
                let inputPlaceholder = nodeData[nodeKey]['placeholder'];
                let inputRequired = nodeData[nodeKey]['required'];
                let inputPrompt = nodeData[nodeKey]['prompt'];
                let inputPattern = nodeData[nodeKey]['pattern'];
                let attributes = nodeData[nodeKey]['attributes'];
                return await inputText(inputClassName, inputPlaceholder, inputRequired, inputPrompt, inputPattern, nodeKey, attributes);
            } else if (nodeData[nodeKey]['type'] === 'checkbox') {
                let inputClassName = nodeData[nodeKey]['class'];
                let inputText = nodeData[nodeKey]['text'];
                let inputPrompt = nodeData[nodeKey]['prompt'];
                let inputActive = nodeData[nodeKey]['active'];
                return await toggle(inputClassName, inputText, inputActive, inputPrompt, nodeKey);
            }
            break;
        case 'puzzle':
            let puzzleClassName = nodeData[nodeKey]['class'];
            let puzzleText = nodeData[nodeKey]['text'];
            let puzzlePrompt = nodeData[nodeKey]['prompt'];
            let puzzlePuzzles = nodeData[nodeKey]['puzzles'];
            return await puzzle(puzzleClassName, puzzleText, puzzlePuzzles, puzzlePrompt, nodeKey);
        case 'splitter':
            let splitterTitle = nodeData[nodeKey]['title']
            return await splitter(splitterTitle);
        case 'splitter_end':
            return await splitterEnd();
        case 'select':
            let selectTitle = nodeData[nodeKey]['title'];
            let selectOptions = nodeData[nodeKey]['options'];
            let selectDeepData = nodeData[nodeKey]['deep_data'];
            return await select(selectTitle, selectOptions, nodeKey, selectDeepData);
        case 'select_switch':
            let selectSwitchTitle = nodeData[nodeKey]['title'];
            let selectSwitchOptions = nodeData[nodeKey]['options'];
            let selectSwitchChoices = nodeData[nodeKey]['choices'];
            return await selectSwitch(selectSwitchTitle, selectSwitchOptions, selectSwitchChoices, nodeKey);
        case 'table':
            let tableTitle = nodeData[nodeKey]['title'];
            let tableHeaders = nodeData[nodeKey]['headers'];
            let tableData = nodeData[nodeKey]['data'];
            let tableActions = nodeData[nodeKey]['actions'];
            let tableCheckable = nodeData[nodeKey]['checkable'];
            let tableId = nodeData[nodeKey]['id'];
            return await table(tableTitle, tableHeaders, tableData, tableActions, tableCheckable, tableId);
    }
}

onload().then();