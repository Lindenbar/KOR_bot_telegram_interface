let telegram = window.Telegram.WebApp;

telegram.expand();

Telegram.WebApp.onEvent("mainButtonClicked", () => {
    let dataNodes = document.querySelectorAll('input[data-name], div[data-name]');
    let sendData = {}
    for (let data of dataNodes) {
        let dataName = data.getAttribute('data-name');
        let dataVal = data.getAttribute('data');
        let nodeType = data.getAttribute('type');

        if (dataVal) {
            sendData[dataName] = {
                type: nodeType,
                value: dataVal
            }
        } else {
            console.log('error');
            return;
        }
    }

    console.log(sendData);
    telegram.sendData(sendData);
});