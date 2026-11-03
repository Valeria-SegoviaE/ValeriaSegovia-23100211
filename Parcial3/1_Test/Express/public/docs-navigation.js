(() => {
    function createCover() {
        const cover = document.createElement("div");
        cover.className = "docs-cover";
        cover.setAttribute("role", "img");
        cover.setAttribute("aria-label", "Portada de la API REST de Valeria Segovia");

        const artwork = document.createElement("img");
        artwork.src = "/api-portada.svg";
        artwork.alt = "";
        artwork.setAttribute("aria-hidden", "true");
        cover.append(artwork);

        const photo = document.createElement("img");
        photo.src = "/campus-api.png";
        photo.alt = "";
        photo.setAttribute("aria-hidden", "true");
        photo.className = "docs-cover-photo";
        cover.append(photo);

        return cover;
    }

    function addNavigation() {
        const toolbar = document.querySelector(".swagger-ui .topbar-wrapper");
        if (!toolbar || toolbar.querySelector(".docs-nav")) {
            return;
        }

        const nav = document.createElement("nav");
        nav.className = "docs-nav docs-nav--swagger";
        nav.setAttribute("aria-label", "Vistas de documentación");

        const currentPath = window.location.pathname;
        const links = [
            { href: "/api-docs", label: "Swagger", matches: ["/api-docs", "/api-docs/"] },
            { href: "/json", label: "JSON", matches: ["/json"] },
            { href: "/docs", label: "Stoplight", matches: ["/docs"] }
        ];

        for (const link of links) {
            const anchor = document.createElement("a");
            anchor.href = link.href;
            anchor.textContent = link.label;
            if (link.matches.includes(currentPath)) {
                anchor.setAttribute("aria-current", "page");
            }
            nav.append(anchor);
        }

        toolbar.append(nav);
    }

    function addCover() {
        const description = document.querySelector(".swagger-ui .info .description");
        if (!description || description.previousElementSibling?.classList.contains("docs-cover")) {
            return;
        }

        description.parentNode.insertBefore(createCover(), description);
    }

    const swaggerUi = document.getElementById("swagger-ui");

    const observer = new MutationObserver(() => {
        addNavigation();
        addCover();
    });
    observer.observe(swaggerUi, { childList: true, subtree: true });
    addNavigation();
    addCover();
})();
