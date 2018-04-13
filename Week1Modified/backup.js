'use strict';
const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status < 400) {
                cb(null, xhr.response);
            } else {
                cb(new Error(xhr.statusText));
            }
        }
    };
    xhr.send();
}

function callback(error, data) {
    if (error !== null) {
        // console.error(error);
    } else {
        renderRepository(data);
    }
}
fetchJSON(url, callback);

function renderRepository(repository) {
    const root = document.getElementById('root');
    const listItem = createAndAppend('div', root);
    listItem.id = 'listItem';
    const listItemName = createAndAppend('p', listItem);
    listItemName.innerHTML = 'HYF Repositories';
    const select = createAndAppend('select', listItem);
    const repositoryContainer = createAndAppend('div', root);
    repositoryContainer.id = 'repo-container';
    const contributorContainer = createAndAppend('div', root);
    contributorContainer.id = 'contribs-container';
    select.addEventListener("change", () => repositoryInfo(select.value));
    repository.forEach(repository => {
        const option = createAndAppend('option', select);
        option.innerHTML = repository.name;
        option.setAttribute('value', repository.name);
    });
    repositoryInfo(select.value);
}

function createAndAppend(tageName, parent) {
    const elemement = document.createElement(tageName);
    parent.appendChild(elemement);
    return elemement;
}

function repositoryInfo(repositoryName) {
    const urlContributor = 'https://api.github.com/repos/HackYourFuture/' + repositoryName + '/contributors';
    const repositoryUrl = 'https://api.github.com/repos/HackYourFuture/' + repositoryName;
    fetchJSON(urlContributor, listRenderContributor);
    fetchJSON(repositoryUrl, repositoryInfoData);
}

function listRenderContributor(err, dataContributor) {
    if (err !== null) {
        // console.log(err);
    } else {
        renderContributors(dataContributor);
    }
}
function repositoryInfoData(err, dataContributor) {
    if (err !== null) {
        // console.log(err);
    } else {
        renderRepositoryToHTML(dataContributor);
    }
}

function renderRepositoryToHTML(repositoryInfo) {
    const repositoryContainer = document.getElementById('repo-container');
    repositoryContainer.innerHTML = '';
    const p = createAndAppend('p', repositoryContainer);
    const repositoryName = createAndAppend('p', repositoryContainer);
    const forks = createAndAppend('p', repositoryContainer);
    const updated = createAndAppend('p', repositoryContainer);
    repositoryName.innerHTML = 'Repository: &nbsp;&nbsp;&nbsp;' + repositoryInfo.name;
    forks.innerHTML = 'Forks: &nbsp;&nbsp;&nbsp;' + repositoryInfo.forks_count;
    updated.innerHTML = 'Updated: &nbsp;&nbsp;&nbsp;' + repositoryInfo.updated_at;
    p.innerHTML = 'Description: &nbsp;&nbsp;&nbsp;' + repositoryInfo.description;
}

function renderContributors(contributors) {
    const container = document.getElementById('contribs-container');
    container.innerHTML = '';
    const Contributions = createAndAppend('p', container);
    Contributions.innerHTML = 'Contributions';
    const ul = createAndAppend1('ul', container);
    contributors.forEach(contributor => {
        const li = createAndAppend1('li', ul);
        li.innerHTML = "";
        const img = createAndAppend('img', li);
        li.innerHTML = contributor.login + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + contributor.contributions + "<img src=" + contributor.avatar_url + ">";
        img.setAttribute('src', contributor.avatar_url);
        li.setAttribute('value', contributor.login);
    });
}

function createAndAppend1(tageName, parent) {
    const element = document.createElement(tageName);
    parent.appendChild(element);
    return element;
}
