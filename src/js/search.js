import axios from "axios";
import "../index.css";

const getRepos = () => {
  const username = localStorage.getItem("username");
  return axios
    .get(`https://api.github.com/users/${username}/repos`)
    .then(res => {
      return res.data;
    })
    .catch(err => console.log(err));
};

const createEl = (tag, text, options) => {
  let el = document.createElement(tag, options);
  el.innerText = text;
  return el;
};

const createCard = repo => {
  let el = document.createElement("div");
  el.setAttribute("class", "repo");
  el.appendChild(createEl("h3", repo.name));
  if (repo.description) {
    el.appendChild(createEl("p", `Description: ${repo.description}`));
  }
  el.appendChild(createEl("p", `Is a fork: ${repo.fork}`));
  el.appendChild(createEl("p", `Stars: ${repo.stargazers_count}`));
  el.appendChild(createEl("p", `Last update: ${repo.updated_at}`));
  el.appendChild(createEl("p", `Languages: ${repo.language}`));
  document.getElementById("repos").appendChild(el);
};

const addRepos = (from, to) => {
  const len = sessionStorage.getItem("length");
  for (let i = from; i < to; i++) {
    if (i < len - 1) {
      let repo = JSON.parse(sessionStorage.getItem(i));
      createCard(repo);
    }
  }
};

const loadRepos = () => {
  const lastRepoIndex = parseInt(sessionStorage.getItem("lastRepoIndex"));
  const difference = parseInt(sessionStorage.getItem("difference"));
  const nextRepoIndex = lastRepoIndex + difference;
  sessionStorage.setItem("lastRepoIndex", nextRepoIndex);
  addRepos(lastRepoIndex, nextRepoIndex);
};

const loadMoreRepos = event => {
  if (
    document.documentElement.scrollHeight - 20 <=
    document.documentElement.scrollTop + window.innerHeight
  ) {
    loadRepos();
  }
};

const sortByKey = (key, ascending) => {
  const less = ascending ? -1 : 1;
  const greater = ascending ? 1 : -1;
  return (a, b) => {
    if (a[key] < b[key]) return less;
    if (a[key] > b[key]) return greater;
    return 0;
  };
};

const sortRepos = repos => {
  const type = localStorage.getItem("orderType");
  const ascending =
    localStorage.getItem("order") === "ascending" ? true : false;
  return repos.sort(sortByKey(type, ascending));
};

const filterRepos = repos => {
  const starredCount = localStorage.getItem("starredCount");
  if (starredCount !== "" && starredCount !== null) {
    const count = parseInt(starredCount);
    repos = repos.filter(repo => repo["stargazers_count"] >= count);
  }
  const type = localStorage.getItem("type");
  if (type === "forks") {
    repos = repos.filter(repo => repo["fork"]);
  }
  if (type === "sources") {
    repos = repos.filter(repo => !repo["fork"]);
  }

  return repos;
};

const initializeRepos = async () => {
  sessionStorage.clear();

  document.getElementById("repos").innerHTML = "";
  let repos = await getRepos();
  repos = filterRepos(sortRepos(repos));
  const len = repos.length;
  sessionStorage.setItem("length", len);
  for (let i = 0; i < len; i++) {
    sessionStorage.setItem(i, JSON.stringify(repos[i]));
  }
  sessionStorage.setItem("lastRepoIndex", 0);
  sessionStorage.setItem("difference", 10);
  loadRepos();
};

const saveSelect = (name, id) => {
  const element = document.getElementById(id);
  const value = element.options[element.selectedIndex].value;
  localStorage.setItem(name, value);
};
const saveInput = (name, id) => {
  const element = document.getElementById(id);
  console.log(element.value);
  localStorage.setItem(name, element.value);
};

const applyParams = e => {
  e.preventDefault();
  initializeRepos();
};

document.getElementById("search-params").addEventListener("click", applyParams);
document.addEventListener("scroll", loadMoreRepos);
document
  .getElementById("type-select")
  .addEventListener("change", () => saveSelect("type", "type-select"));
document
  .getElementById("order-type-select")
  .addEventListener("change", () =>
    saveSelect("orderType", "order-type-select")
  );
document
  .getElementById("order-select")
  .addEventListener("change", () => saveSelect("order", "order-select"));
document
  .getElementById("starred-count")
  .addEventListener("input", () => saveInput("starredCount", "starred-count"));

saveSelect("type", "type-select");
saveSelect("orderType", "order-type-select");
saveSelect("order", "order-select");
saveInput("type", "type-select");
initializeRepos();
