class FormAction {
    getFormData(form) {
        if (typeof form === 'string') {
            form = document.querySelector(form);
        }
        let data = {},
            inputNodeList;
        inputNodeList = form.querySelectorAll('[name]');
        inputNodeList.forEach(item => {
            switch (item.nodeName) {
                case 'INPUT':
                    switch (item.type) {
                        case 'number':
                            data[item.name] = parseFloat(item.value);
                            break;
                        case 'search':
                            data[item.name] = item.value.trim();
                            break;
                        case 'password':
                        case 'text':
                            data[item.name] = item.value;
                            break;
                        case 'hidden':
                            data[item.name] = parseInt(item.value)
                            break;
                        case 'radio':
                        case 'checkbox':
                            data[item.name] = item.checked;
                            break;
                    }
                    break;
                case 'TEXTAREA':
                    data[item.name] = item.value;
                    break;
            }
        });
        return data;
    }
    setFormData(form, data) {
        if (typeof form === 'string') {
            form = document.querySelector(form);
        }
        for (let key in data) {
            let value = data[key];
            let inputName = form.querySelector(`[name=${key}]`);
            if (!inputName)
                continue;
            switch (typeof value) {
                case 'boolean':
                    inputName.checked = value;
                    break;
                case 'string':
                case 'number':
                    inputName.value = value;
                    break;
            }
        }
    }
    clearFrom(form) {
        if (typeof form === 'string') {
            form = document.querySelector(form);
        }
        let inputNodeList = form.querySelectorAll('[name]');
        inputNodeList.forEach(item => {
            if (inputNodeList.type == 'radio' || inputNodeList.type == 'checkbox')
                inputNodeList.checked = false
            else
                inputNodeList.value = '';
        })
    }
}