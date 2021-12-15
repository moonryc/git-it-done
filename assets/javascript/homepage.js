let userFormEl = document.querySelector("#user-form")
let nameInputEl = document.querySelector("#username")
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons")

const getUserRepos = (user) => {

    let apiUrl = `https://api.github.com/users/${user}/repos`;

    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                displayRepos(data, user)
            })
        } else {
            alert("error github user not found")
        }

    }).catch((error) => {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });


}

const getFeatureRepos = (language) => {
    let apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;

    fetch(apiUrl).then(response => {
        if (response.ok) {
            response.json().then(data => {
                displayRepos(data.items, language)
            })
        } else {
            alert("Error: github user not found")
        }
    })
}

const displayRepos = (repos, searchTerm) => {

    repoContainerEl.textContent = ""
    repoSearchTerm.textContent = searchTerm

    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories were found"
        return
    }

    for (let i = 0; i < repos.length; i++) {
        //format repo name e.g. moonryc/reponame
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", `./single-repo.html?repo=${repoName}`);

        // create a span element to hold repository name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }

}

const formSubmitHandler = (event) => {
    event.preventDefault()
    let userName = nameInputEl.value.trim()

    if (userName) {
        getUserRepos(userName)
        nameInputEl.value = "";
    } else {
        alert("Please enter a github username")
    }
}

const buttonClickHandler = function(event) {
    let language = event.target.getAttribute("data-language")
    if (language) {
        getFeatureRepos(language)
        console.log(language)
        repoContainerEl.textContent = ""

    }
}

userFormEl.addEventListener("submit", formSubmitHandler)

languageButtonsEl.addEventListener("click", buttonClickHandler)