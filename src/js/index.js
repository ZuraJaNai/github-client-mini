import "../index.css";
const findRepos = e => {
  e.preventDefault();
  localStorage.clear();
  const username = document.getElementById("username").value;
  localStorage.setItem("username", username);
  window.location.replace("/search.html");
};

document.getElementById("findRepos").addEventListener("click", findRepos);
