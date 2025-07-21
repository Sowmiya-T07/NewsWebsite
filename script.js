const API_KEY = "0ea2bdb2e0714ed0a010339f866ae4b0";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("Technology"));

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    })
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
})

document.getElementById("newsletter-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = document.getElementById("email-input");
    const msg = document.getElementById("subscription-msg");

    if (emailInput.value) {
        localStorage.setItem("newsletterEmail", emailInput.value);
        msg.textContent = "✅ Thanks for subscribing!";
        emailInput.value = "";
    } else {
        msg.textContent = "⚠️ Please enter a valid email.";
    }
});

///scroll button//
const scrollBtn = document.getElementById("scrollTopBtn");

window.onscroll = function () {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
};

scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

///feedback///
document.getElementById("feedback-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const feedback = document.getElementById("feedback-text").value.trim();
  const msg = document.getElementById("feedback-msg");

  if (feedback === "") {
    msg.style.color = "red";
    msg.textContent = "❗ Please write something before submitting.";
    return;
  }
const existing = JSON.parse(localStorage.getItem("siteFeedback")) || [];
  existing.push({
    text: feedback,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("siteFeedback", JSON.stringify(existing));

  msg.style.color = "green";
  msg.textContent = "✅ Thank you for your feedback!";
  document.getElementById("feedback-form").reset();

  displayFeedbackList();
});



