// DOM
const allSubmissionsDiv = document.getElementById("submissions");
const loadMoreBtn = document.getElementById("load-more-btn");
const hotSubmissions = document.getElementById("hot-submissions");
const newSubmissions = document.getElementById("new-submissions");
const topSubmissions = document.getElementById("top-submissions");
const searchBtn = document.querySelector(".search-icon");
const searchInput = document.getElementById("submission-search");

// Local variables
let currentPage = 1;
let sortBy = "";
let sortBySearch = false;
let searchInputValue = "";

loadMoreBtn.onclick = function () {
  document.getElementById("btn-text").classList.add("hide");
  document.getElementById("spinner").classList.remove("hide");

  currentPage++;

  if (sortBySearch) {
    getSearchSubmissions(searchInputValue, currentPage);
    return;
  }

  let sort = sortBy.length === 0 ? "hot" : sortBy;

  fetch(`https://nosleep-reddit-api.herokuapp.com/${sort}/${currentPage}/`)
    .then((res) => res.json())
    .then((sumbissions) => {
      document.getElementById("btn-text").classList.remove("hide");
      document.getElementById("spinner").classList.add("hide");

      sumbissions.forEach((submission) => createSubmission(submission));
    });
};
hotSubmissions.onclick = function () {
  if (sortBy === "hot" && !sortBySearch) return;
  else if (sortBy === "new") newSubmissions.classList.remove("selected");
  else if (sortBy === "top") topSubmissions.classList.remove("selected");
  else {
  }

  sortBySearch = false;
  searchInputValue = "";

  hotSubmissions.classList.add("selected");
  allSubmissionsDiv.classList.add("submissions-loading");

  sortBy = "hot";
  currentPage = 1;

  URL = `https://nosleep-reddit-api.herokuapp.com/${sortBy}/${currentPage}/`;

  fetch(URL)
    .then((res) => res.json())
    .then((sumbissions) => {
      allSubmissionsDiv.innerHTML = "";
      allSubmissionsDiv.classList.remove("submissions-loading");

      sumbissions.forEach((submission) => createSubmission(submission));

      loadMoreBtn.classList.remove("hide");
    });
};

newSubmissions.onclick = function () {
  if (sortBy === "new" && !sortBySearch) return;
  else if (sortBy === "hot") hotSubmissions.classList.remove("selected");
  else if (sortBy === "top") topSubmissions.classList.remove("selected");
  else {
  }

  sortBySearch = false;
  searchInputValue = "";

  newSubmissions.classList.add("selected");
  allSubmissionsDiv.classList.add("submissions-loading");

  sortBy = "new";
  currentPage = 1;

  URL = `https://nosleep-reddit-api.herokuapp.com/${sortBy}/${currentPage}/`;

  fetch(URL)
    .then((res) => res.json())
    .then((sumbissions) => {
      allSubmissionsDiv.innerHTML = "";
      allSubmissionsDiv.classList.remove("submissions-loading");
      sumbissions.forEach((submission) => createSubmission(submission));
      loadMoreBtn.classList.remove("hide");
    });
};

topSubmissions.onclick = function () {
  if (sortBy === "top" && !sortBySearch) return;
  else if (sortBy === "new") newSubmissions.classList.remove("selected");
  else if (sortBy === "hot") hotSubmissions.classList.remove("selected");
  else {
  }

  sortBySearch = false;
  searchInputValue = "";

  topSubmissions.classList.add("selected");
  allSubmissionsDiv.classList.add("submissions-loading");

  sortBy = "top";
  currentPage = 1;

  URL = `https://nosleep-reddit-api.herokuapp.com/${sortBy}/${currentPage}/`;

  fetch(URL)
    .then((res) => res.json())
    .then((sumbissions) => {
      allSubmissionsDiv.innerHTML = "";
      allSubmissionsDiv.classList.remove("submissions-loading");
      sumbissions.forEach((submission) => createSubmission(submission));
      loadMoreBtn.classList.remove("hide");
    });
};

searchInput.onkeyup = function (e) {
  if (e.keyCode === 13) {
    searchBtn.click();
  }
};

searchBtn.onclick = function () {
  if (searchInput.value === "") return;

  allSubmissionsDiv.classList.add("submissions-loading");

  currentPage = 1;
  getSearchSubmissions(searchInput.value, currentPage);
};

function getSearchSubmissions(search, page) {
  const body = JSON.stringify({ search, page });

  let csrftoken = getCookie("csrftoken");

  fetch(`https://nosleep-reddit-api.herokuapp.com/search/`, {
    method: "POST",
    credentials: "include",
    // mode: "cors",
    // cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    // redirect: "follow",
    // referrerPolicy: "no-referrer",
    body,
  })
    .then((res) => res.json())
    .then((submissions) => {
      sortBySearch = true;
      searchInputValue = searchInput.value;

      if (page === 1) {
        allSubmissionsDiv.innerHTML = "";
        allSubmissionsDiv.classList.remove("submissions-loading");
      }

      if (page > 1) {
        document.getElementById("btn-text").classList.remove("hide");
        document.getElementById("spinner").classList.add("hide");
      }

      if (submissions.length === 0) {
        if (page === 1) {
          allSubmissionsDiv.innerHTML =
            "<h2 style='margin: 20px 0'>No posts found</h2>";
        }
        loadMoreBtn.classList.add("hide");
      } else {
        submissions.forEach((submission) => {
          createSubmission(submission);
        });
      }
    });
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function createSubmission(submission) {
  const submissionEl = document.createElement("a");
  submissionEl.href = `https://nosleep-reddit-api.herokuapp.com/submission/${submission.id}/`;
  submissionEl.classList.add("submission-link");

  submissionEl.innerHTML = `
  <div class="submission">
    <div class="detail">
      <p>
        Posted By: u/${submission.author}&nbsp;&nbsp;&nbsp;
        ${submission.posted_on}
      </p>
    </div>
    <h4 class="submission-title">
      ${
        submission.flair !== null
          ? `<span class="flair">${submission.flair}</span>`
          : ""
      }
        ${submission.title}
    </h4>
    <p class="score">Upvotes: ${submission.score}</p>
  </div>
  `;

  allSubmissionsDiv.appendChild(submissionEl);
}
