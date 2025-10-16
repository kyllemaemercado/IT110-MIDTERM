document.addEventListener("DOMContentLoaded", () => {
    // --- VIEW SWITCHING LOGIC (SPA Navigation) ---
    const navLinks = document.querySelectorAll("#main-nav a");
    const hubView = document.getElementById("hub-view");
    const appView = document.getElementById("app-view");
    const goToAppButton = document.getElementById("goToAppButton");

    const views = {
        "hub-view": hubView,
        "app-view": appView,
    };

    /**
     * Switches the visibility of the main content views, updates navigation, 
     * and scrolls to a target section if specified.
     */
    const switchView = (targetViewId, targetSectionId) => {
        // 1. Hide all main views
        Object.entries(views).forEach(([id, view]) => {
            if (view) {
                view.classList.add("hidden");
            }
        });

        // 2. Show the target view
        const targetView = views[targetViewId];
        if (targetView) {
            targetView.classList.remove("hidden");
        }

        // 3. Update body class (important for hiding sections via CSS)
        document.body.classList.remove("app-view-active", "hub-view-active");
        document.body.classList.add(
            targetViewId === "app-view" ? "app-view-active" : "hub-view-active"
        );

        // 4. Update active class on navigation links
        navLinks.forEach((link) => {
            link.classList.remove("active-view");
            const linkTargetId = link.getAttribute("data-target-id");

            if (linkTargetId === targetSectionId) {
                link.classList.add("active-view");
            }
        });

        // 5. Scroll to the target section if in hub view
        if (targetSectionId && targetViewId === "hub-view") {
            const section = document.getElementById(targetSectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    // --- Attach event listeners to navigation links ---
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetViewId = e.target.getAttribute("data-view");
            const targetSectionId = e.target.getAttribute("data-target-id");

            if (targetViewId) {
                switchView(targetViewId, targetSectionId);
            }
        });
    });

    // --- Go To App Button ---
    if (goToAppButton) {
        goToAppButton.addEventListener("click", (e) => {
            e.preventDefault();
            const targetViewId = e.currentTarget.getAttribute("data-view");
            const targetSectionId = e.currentTarget.getAttribute("data-target-id");

            if (targetViewId) {
                switchView(targetViewId, targetSectionId);
            }
        });
    }

    // --- Initial view ---
    const initialLink = navLinks[0];
    const initialViewId = initialLink
        ? initialLink.getAttribute("data-view")
        : "hub-view";
    const initialTargetId = initialLink
        ? initialLink.getAttribute("data-target-id")
        : "home";

    switchView(initialViewId, initialTargetId);
});
