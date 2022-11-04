function sendRequestAddUserBot() {
    let clientsData = [...document.querySelectorAll('input[client_data]')];
    let dataToSend = {}
    let validCount = 0;
    for (let cData of clientsData) {
        if (cData.validity.valid) {
            let dataName = cData.getAttribute('data-name');
            let dataVal = cData.value;

            validCount += 1;

            dataToSend[dataName] = dataVal;
        } else {
            return
        }
    }

    if (validCount === clientsData.length) {
        $.ajax({
            type: 'POST',
            url: settings.host + 'add_userbot',
            data: dataToSend,
        });
    }
}

function buildConfirmFields(clientsData) {
    let extra = document.getElementById(clientsData[1]).parentNode.parentNode.querySelector('.tbl__extra-container');
    clientsData[0].forEach((data, i) => {
        if (data['is_activated'] === '0') {
            console.log('ok')
            let confirmContainer = document.createElement('div');
            let confirmInput = document.createElement('input');
            let confirmBtn = document.createElement('div');

            function changeConfirmationBtn() {
                if (confirmInput.value) {
                    confirmBtn.setAttribute('req', `approve_confirmation_code/${confirmInput.value}`);
                    confirmBtn.innerText = 'Подтвердить';
                } else {
                    confirmBtn.setAttribute('req', 'send_confirmation_code');
                    confirmBtn.innerText = 'Отправить код';
                }
            }

            changeConfirmationBtn();

            confirmContainer.classList.add('confirm-container');
            confirmInput.placeholder = data['phone_number'];
            confirmInput.classList.add('confirm-input');
            confirmBtn.classList.add('confirm-btn');
            confirmBtn.onclick = () => {
                let req = confirmBtn.getAttribute('req');
                let response = $.ajax({
                    type: 'POST',
                    url: settings.host + req,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    async: false
                }).responseText;

                if (response === 'success' && req.startsWith('approve_confirmation_code')) {
                    confirmInput.classList.add('success');
                } else if (req.startsWith('approve_confirmation_code')) {
                    confirmInput.classList.add('error');
                }
            };

            confirmInput.oninput = () => {
                changeConfirmationBtn();
            }

            confirmContainer.appendChild(confirmInput);
            confirmContainer.appendChild(confirmBtn);
            extra.appendChild(confirmContainer);
        }
    });
}

function getTableRowsData(tableID) {
    let table = document.getElementById(tableID);
    let tableRows = [...table.querySelectorAll('.tbl__row')];
    let result = [];

    tableRows.forEach(row => {
        let isChecked = row.querySelector('.tbl__check-container input').checked;

        if (isChecked) {
            let data = {};
            let dataInputs = row.querySelectorAll('input[data]');

            dataInputs.forEach(dataInput => {
                let dataName = dataInput.getAttribute('data-name');
                data[dataName] = dataInput.getAttribute('data');
            });
            result.push(data);
        }
    });
    return [result, tableID];
}