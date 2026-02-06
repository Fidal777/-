
document.addEventListener("DOMContentLoaded", () => {
    const sections = [
        { id: "popup-container", file: "sections/popup.html" },
        { id: "navbar-container", file: "sections/navbar.html" },
        { id: "hero-container", file: "sections/hero.html" },
        { id: "elements-container", file: "sections/elements.html" },
        { id: "playground-container", file: "sections/playground.html" },
        { id: "gallery-container", file: "sections/gallery.html" },
        { id: "curriculum-container", file: "sections/curriculum.html" },
        { id: "footer-container", file: "sections/footer.html" }
    ];

    let loadedCount = 0;

    sections.forEach(section => {
        fetch(section.file)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${section.file}`);
                return response.text();
            })
            .then(html => {
                const container = document.getElementById(section.id);
                if (container) {
                    container.innerHTML = html;
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                loadedCount++;
                if (loadedCount === sections.length) {
                    // All sections loaded, initialize app logic
                    if (window.initApp) {
                        window.initApp();
                    }
                }
            });
    });
});
