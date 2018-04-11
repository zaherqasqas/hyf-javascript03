'use strict';
const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        // console.log(xhr.readyState);
        if (xhr.readyState === 4) {
            if (xhr.status < 400) {
                // console.log(xhr.response);
                cb(null, xhr.response);
            } else {
                cb(new Error(xhr.statusText));
                // console.error(xhr.statusText);
            }
        }
    };
    xhr.send();
}

function callback(error, data) {
    if (error !== null) {
        // console.error(error);
    } else {
        renderRepos(data);
    }
}
fetchJSON(url, callback);

function renderRepos(repos) {
    const root = document.getElementById('root');
    const select = createAndAppend('select', root);
    const repoContainer = createAndAppend('div', root);
    repoContainer.id = 'repo-container';
    const contrContainer = createAndAppend('div', root);
    contrContainer.id = 'contribs-container';
    select.addEventListener("change", () => reposInfo(select.value));
    repos.forEach(repo => {
        const option = createAndAppend('option', select);
        option.innerHTML = repo.name;
        option.setAttribute('value', repo.name);
    });
    reposInfo(select.value); // added
}

function createAndAppend(tageName, parent) {
    const elem = document.createElement(tageName);
    parent.appendChild(elem);
    return elem;
}

function reposInfo(repoName) {
    const urlCon = 'https://api.github.com/repos/HackYourFuture/' + repoName + '/contributors';
    const repoUrl = 'https://api.github.com/repos/HackYourFuture/' + repoName;
    fetchJSON(urlCon, listRenderCon);
    fetchJSON(repoUrl, reopInfo);
}

function listRenderCon(err, dataCon) {
    if (err !== null) {
        // console.log(err);
    } else {
        // console.log(data_con);
        renderContributors(dataCon);
    }
}
function reopInfo(err, dataCon) {
    if (err !== null) {
        // console.log(err);
    } else {
        // console.log(data_con);
        renderReopInfoToHTML(dataCon);
    }
}
function renderReopInfoToHTML(repoInfo) {
    const repoContainer = document.getElementById('repo-container');
    repoContainer.innerHTML = '';
    const p = createAndAppend('p', repoContainer);
    const repoName = createAndAppend('p', repoContainer);
    const forks = createAndAppend('p', repoContainer);
    const updated = createAndAppend('p', repoContainer);
    repoName.innerHTML = 'Repository &nbsp;&nbsp;&nbsp;' + repoInfo.name;
    forks.innerHTML = repoInfo.forks_count;
    updated.innerHTML = repoInfo.updated_at;
    p.innerHTML = repoInfo.description;

}

function renderContributors(contributors) {
    const container = document.getElementById('contribs-container');
    container.innerHTML = '';
    const ul = createAndAppend1('ul', container);

    // ul.addEventListener("change", reposInfo);
    // ul.innerHTML = "";
    contributors.forEach(contri => {

        const li = createAndAppend1('li', ul);
        li.innerHTML = "";
        const img = createAndAppend('img', li);
        li.innerHTML = contri.login + " " + contri.contributions + "<img src=" + contri.avatar_url + ">";
        // img.innerHTML = contri.avatar_url;
        img.setAttribute('src', contri.avatar_url);
        li.setAttribute('value', contri.login);
    });
}
function createAndAppend1(tageName, parent) {
    const elem = document.createElement(tageName);
    parent.appendChild(elem);
    return elem;
}
