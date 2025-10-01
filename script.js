document.addEventListener("DOMContentLoaded", function() {
    const content = document.getElementById("content");

    // Theme toggle functionality
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        if (themeIcon) themeIcon.textContent = "☀️";
    } else {
        // Default to dark mode
        if (themeIcon) themeIcon.textContent = "🌙";
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function() {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");

            if (themeIcon) {
                themeIcon.textContent = isLight ? "☀️" : "🌙";
            }

            // Save preference
            localStorage.setItem("theme", isLight ? "light" : "dark");
        });
    }

    function loadPage(href) {
        // Convert URL to actual file path for fetching
        let fetchUrl = href;
        if (href === './' || href === '/') {
            fetchUrl = './index.html';
        } else if (!href.endsWith('.html')) {
            fetchUrl = href.replace(/\/$/, '') + '.html';
        }

        fetch(fetchUrl)
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
