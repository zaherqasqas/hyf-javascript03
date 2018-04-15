'use strict';
{
    const API = {
        endpoints: {
            laureate: 'http://api.nobelprize.org/v1/laureate.json?',
            prize: 'http://api.nobelprize.org/v1/prize.json?'
        },
        queries: [
            {
                description: 'All female laureates',
                endpoint: 'laureate',
                queryString: 'gender=female'
            }
        ]
    };
    // cb( error, data)
    function renderlaureate(laureates) {
        const root = document.getElementById('root');
        const listContainer = createAndAppend('div', root);
        listContainer.id = 'list-container';
        laureates.forEach(laureate => {
            const listItem = createAndAppend('div', listContainer);
            listItem.setAttribute('class', 'list-item');
            const table = createAndAppend('table', listItem);
            const tbody = createAndAppend('tbody', table);
            const tr = createAndAppend('tr', tbody);
            const td = createAndAppend('td', tr);
            td.textContent = laureate.firstname + ' ' + laureate.surname;
        });
        console.log(laureates);
    }

    function createAndAppend(tageName, parent) {
        const elem = document.createElement(tageName);
        parent.appendChild(elem);
        return elem;
    }

    function fetchJSON(url, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            console.log(xhr.readyState);
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    console.log(xhr.response);
                    cb(null, xhr.response);
                } else {
                    cb(new Error(xhr.statusText));
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.send();
    }
    const url = API.endpoints.laureate + API.queries[0].queryString;
    function callback(error, data) {
        if (error !== null) {
            console.error(error);
        } else {
            renderlaureate(data.laureates);
        }
    }
    fetchJSON(url, callback);
}
