let telegram = window.Telegram.WebApp;

telegram.expand();

Telegram.WebApp.onEvent("mainButtonClicked", () => {
    let dataNodes = document.querySelectorAll('input[data-name], div[data-name]');
    let dataToSend = {}
    for (let data of dataNodes) {
        let dataName = data.getAttribute('data-name');
        let dataVal = data.getAttribute('data');
        let nodeType = data.getAttribute('type');

        if (dataVal) {
            dataToSend[dataName] = {
                type: nodeType,
                value: dataVal
            }
        } else {
            console.log('error');
            return;
        }
    }

    dataToSend = JSON.stringify(dataToSend);
    telegram.sendData(dataToSend);
});