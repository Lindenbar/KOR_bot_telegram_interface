let telegram = window.Telegram.WebApp;

telegram.expand();

Telegram.WebApp.onEvent("mainButtonClicked", () => {
    let dataNodes = document.querySelectorAll('input[data-name], div[data-name]');
    let dataToSend = {
        query: undefined,
        settings: {}
    }
    let query = document.querySelector('.menu').getAttribute('query');
    for (let data of dataNodes) {
        let dataName = data.getAttribute('data-name');
        let dataVal = data.getAttribute('data');
        let isRequired = data.hasAttribute('required');

        if (dataName === 'userbot') {
            dataVal = JSON.parse(dataVal);
        }

        if (isRequired && !dataVal) {
            console.log('error');
            return;
        }

        dataToSend['query'] = query
        dataToSend['settings'][dataName] = dataVal;
    }

    dataToSend = JSON.stringify(dataToSend);
    telegram.sendData(dataToSend)
});