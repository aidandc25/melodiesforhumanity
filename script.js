document.addEventListener("DOMContentLoaded", function() {
    const content = document.getElementById("content");

    function loadPage(href) {
        fetch(href)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.getElementById("content").innerHTML;

                content.style.opacity = 0;

                setTimeout(() => {
                    content.innerHTML = newContent;
                    content.style.opacity = 1;
                    window.history.pushState({ path: href }, '', href);
                    attachLinkEventListeners();
                }, 500);
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }

    function attachLinkEventListeners() {
        const links = document.querySelectorAll(".nav-link");
        links.forEach(link => {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                const href = this.getAttribute("href");
                loadPage(href);
            });
        });
    }

    attachLinkEventListeners();
});
