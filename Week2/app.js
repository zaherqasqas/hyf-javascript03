'use strict';
const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(xhr.statusText));
                }
            }
        };
        xhr.send();
    });
}

function renderToolBar() {
    const root = document.getElementById('root');
    const listItem = createAndAppend('div', root);
    listItem.id = 'listItem';
    const listItemName = createAndAppend('p', listItem);
    listItemName.innerHTML = 'HYF Repositories';
    const select = createAndAppend('select', listItem);
    select.id = 'selectElement';
    const errorDiv = createAndAppend('div', root);
    errorDiv.id = 'error-container';
    const repositoryContainer = createAndAppend('div', root);
    repositoryContainer.id = 'repo-container';
    const contributorContainer = createAndAppend('div', root);
    contributorContainer.id = 'contribs-container';
    select.addEventListener("change", () => repositoryInfo(select.value));
}

function renderRepository(repository) {
    const select = document.getElementById('selectElement');
    repository.forEach(repository => {
        const option = createAndAppend('option', select);
        option.innerHTML = repository.name;
        option.setAttribute('value', repository.name);
    });
    repositoryInfo(select.value);
}

function createAndAppend(tageName, parent) {
    const element = document.createElement(tageName);
    parent.appendChild(element);
    return element;
}

function repositoryInfo(repositoryName) {
    const repositoryUrl = 'https://api.github.com/repos/HackYourFuture/' + repositoryName;
    fetchJSON(repositoryUrl)
        .then(repodata => {
            return fetchJSON(repodata.contributors_url)
                .then(contributors => {
                    renderRepositoryToHTML(repodata);
                    renderContributors(contributors);
                });
        })
        .catch(err => {
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = err.message;
        });
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
    const ul = createAndAppend('ul', container);
    contributors.forEach(contributor => {
        const li = createAndAppend('li', ul);
        li.innerHTML = "";
        const img = createAndAppend('img', li);
        li.innerHTML = contributor.login + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + contributor.contributions + "<img src=" + contributor.avatar_url + ">";
        img.setAttribute('src', contributor.avatar_url);
        li.setAttribute('value', contributor.login);
    });
}


function main() {
    renderToolBar();
    fetchJSON(url)
        .then(repos => {
            renderRepository(repos);
        })
        .catch(err => {
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = err.message;
        }); //added
}

window.onload = main;
