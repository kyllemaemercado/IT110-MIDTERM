document.addEventListener("DOMContentLoaded", () => {
    // --- VIEW SWITCHING LOGIC (SPA Navigation) ---
    const navLinks = document.querySelectorAll("#main-nav a");
    const hubView = document.getElementById("hub-view");
    const appView = document.getElementById("app-view");
    
    const views = {
        "hub-view": hubView,
        "app-view": appView,
    };
    
    /**
     * Switches the visibility of the main content views, updates navigation, and scrolls to a target section if specified.
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

        // 3. Update active class on navigation links
        navLinks.forEach((link) => {
            link.classList.remove("active-view");
            const linkTargetId = link.getAttribute("data-target-id");

            // Activate link based on the specific target section ID
            if (linkTargetId === targetSectionId) {
                link.classList.add("active-view");
            }
        });

        // 4. Scroll to the target section if specified and we are in the hub view
        if (targetSectionId && targetViewId === "hub-view") {
            const section = document.getElementById(targetSectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    // 5. Attach event listeners to navigation links
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
     if (goToAppButton) {
      goToAppButton.addEventListener('click', (e) => {
          e.preventDefault();
          const targetViewId = e.currentTarget.getAttribute("data-view");
          const targetSectionId = e.currentTarget.getAttribute("data-target-id");

          if (targetViewId) {
              switchView(targetViewId, targetSectionId);
          }
      });
  }
    const initialLink = navLinks[0];
    const initialViewId = initialLink
        ? initialLink.getAttribute("data-view")
        : "hub-view";
    const initialTargetId = initialLink
        ? initialLink.getAttribute("data-target-id")
        : "home";
    switchView(initialViewId, initialTargetId);
});