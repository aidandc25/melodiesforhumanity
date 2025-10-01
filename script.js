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

    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuClose = document.getElementById("mobile-menu-close");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    function openMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", openMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener("click", closeMobileMenu);
    }

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener("click", function() {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener("click", function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Close menu on escape key
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("active")) {
            closeMobileMenu();
        }
    });

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

    // Dynamic chapter counter
    function updateChapterCount() {
        fetch('./schools.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const schoolCards = doc.querySelectorAll('.school-card');
                const count = schoolCards.length;

                const chapterCountElement = document.getElementById('chapter-count');
                if (chapterCountElement) {
                    chapterCountElement.textContent = count;
                }
            })
            .catch(error => {
                console.error('Error fetching chapter count:', error);
            });
    }

    // Update chapter count on homepage
    if (document.getElementById('chapter-count')) {
        updateChapterCount();
    }

    // Update chapter count on schools page dynamically
    function updateSchoolsPageCount() {
        const schoolCards = document.querySelectorAll('.school-card');
        const count = schoolCards.length;
        const schoolsCountElement = document.getElementById('schools-chapter-count');
        if (schoolsCountElement) {
            schoolsCountElement.textContent = count;
        }
    }

    if (document.getElementById('schools-chapter-count')) {
        updateSchoolsPageCount();
    }
});
