(() => {
    const observedRoots = new WeakSet();

    function normalizeExistingCover(wrapper) {
        wrapper.style.position = "static";
        wrapper.style.width = "min(900px, max(280px, calc(100vw - 460px)))";
        wrapper.style.maxWidth = "750px";
        wrapper.style.aspectRatio = "auto";
        wrapper.style.margin = "0 0 20px";
        wrapper.style.overflow = "visible";
        wrapper.style.borderRadius = "0";

        let artwork = wrapper.querySelector("[data-api-artwork]");
        if (!artwork) {
            const cover = wrapper.querySelector('img[src$="/api-portada.svg"]');
            const photo = wrapper.querySelector(".docs-cover-photo");
            if (!cover || !photo) {
                return;
            }

            artwork = wrapper.ownerDocument.createElement("div");
            artwork.dataset.apiArtwork = "";
            Object.assign(artwork.style, {
                position: "relative",
                width: "100%",
                aspectRatio: "30 / 7",
                margin: "0 0 14px",
                overflow: "hidden",
                borderRadius: "14px"
            });
            artwork.append(cover, photo);
            wrapper.prepend(artwork);
        }
    }

    function moveCover(root) {
        const existingCover = root.querySelector("[data-api-cover]");
        if (existingCover) {
            normalizeExistingCover(existingCover);
            return;
        }

        const heading = Array.from(root.querySelectorAll("h1, h2, h3")).find((element) =>
            element.textContent.trim() === "API REST de Valeria Segovia"
        );

        const cover = Array.from(root.querySelectorAll("img")).find((image) =>
            image.getAttribute("src")?.endsWith("/api-portada.svg")
        );

        if (!cover || !heading) {
            return;
        }

        const wrapper = cover.ownerDocument.createElement("div");
        wrapper.dataset.apiCover = "";
        Object.assign(wrapper.style, {
            width: "min(900px, max(280px, calc(100vw - 460px)))",
            maxWidth: "750px",
            margin: "0 0 20px"
        });

        const artwork = cover.ownerDocument.createElement("div");
        Object.assign(artwork.style, {
            position: "relative",
            width: "100%",
            aspectRatio: "30 / 7",
            margin: "0 0 14px",
            overflow: "hidden",
            borderRadius: "14px"
        });

        Object.assign(cover.style, {
            display: "block",
            width: "100%",
            maxWidth: "none",
            height: "100%",
            margin: "0",
            objectFit: "fill"
        });

        const photo = cover.ownerDocument.createElement("img");
        photo.src = "/campus-api.png";
        photo.alt = "Alumnos del Tecnológico";
        Object.assign(photo.style, {
            position: "absolute",
            top: "8.57%",
            left: "65.83%",
            width: "30.83%",
            height: "82.86%",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "14px",
            objectFit: "cover",
            objectPosition: "center"
        });

        artwork.append(cover, photo);
        wrapper.append(artwork);
        heading.hidden = true;
        heading.parentNode.insertBefore(wrapper, heading);
    }

    function observeRoot(root) {
        if (observedRoots.has(root)) {
            return;
        }
        observedRoots.add(root);

        const observer = new MutationObserver(() => observeContents(root));
        observer.observe(root, { childList: true, subtree: true });
        observeContents(root);
    }

    function observeContents(root) {
        moveCover(root);
        for (const element of root.querySelectorAll("*")) {
            if (element.shadowRoot) {
                observeRoot(element.shadowRoot);
            }
        }
    }

    observeRoot(document);
})();
