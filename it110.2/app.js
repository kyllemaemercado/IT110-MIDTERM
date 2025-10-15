document.addEventListener("DOMContentLoaded", () => {
    const quoteButton = document.getElementById("quote-button");
    const quoteDisplay = document.getElementById("quote-display");
    const quoteAuthor = document.getElementById("quote-author");
    const goToAppButton = document.getElementById('goToAppButton')
  
    // FIX: Using a CORS proxy to prevent "Failed to fetch" errors in sandboxed environments.
    const quoteApiUrl =
        "https://corsproxy.io/?" +
        encodeURIComponent("https://zenquotes.io/api/random");

    // --- QUOTE GENERATOR LOGIC (API Integration and Error Handling) ---

    const exponentialBackoff = (attempt) => {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        return new Promise((resolve) => setTimeout(resolve, delay));
    };

    /**
     * Fetches a random quote from the API with retry logic and displays it.
     */
    const fetchQuote = async () => {
        if (!quoteDisplay || !quoteAuthor) return;
        
        // Initial state before fetching
        quoteDisplay.innerHTML =
            '<i class="fas fa-spinner fa-spin text-2xl mr-2"></i>Loading inspiration...';
        quoteAuthor.textContent = "— ...";
        if (quoteButton) quoteButton.disabled = true;

        const maxRetries = 3;
        const requestTimeoutMs = 5000;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

            try {
                const response = await fetch(quoteApiUrl, {
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`);

                // ZenQuotes returns an array, not an object
                const data = await response.json();
                const quoteObj = Array.isArray(data) ? data[0] : data;
                const quote = quoteObj.q || quoteObj.content;
                const author = quoteObj.a || quoteObj.author;

                if (quote && author) {
                    quoteDisplay.innerHTML = `
                    <i class="fas fa-quote-left text-3xl sm:text-4xl mr-2 opacity-50 block sm:inline"></i>
                    ${quote}
                    <i class="fas fa-quote-right text-3xl sm:text-4xl ml-2 opacity-50 block sm:inline"></i>
                `;
                    quoteAuthor.textContent = `— ${author}`;
                    if (quoteButton) quoteButton.disabled = false;
                    return;
                } else {
                    throw new Error("Missing quote or author in API response.");
                }
            } catch (error) {
                clearTimeout(timeoutId);
                console.error(`Attempt ${attempt + 1}: Failed to fetch quote`, error);

                if (attempt < maxRetries - 1) {
                    await exponentialBackoff(attempt);
                } else {
                    // Final retry failed, display fallback
                    quoteDisplay.innerHTML = `
                    <i class="fas fa-exclamation-triangle text-3xl sm:text-4xl mr-2 text-red-500"></i>
                    API Connection Failed.<br>Displaying a static quote.
                `;
                    quoteAuthor.textContent = "— System Fallback";
                    showMessageBox(
                        "Connection Error",
                        "Could not fetch a live quote after multiple attempts due to a network failure or timeout. Displaying a static fallback quote instead."
                    );
                    if (quoteButton) quoteButton.disabled = false;
                }
            }
        }
    };

    if (quoteButton) {
        quoteButton.addEventListener("click", fetchQuote);
        
        // Initial fetch when the generator section is loaded
        fetchQuote(); 
    }

    // --- Custom Message Box (Utility Function) ---

    const showMessageBox = (title, message) => {
        let messageBox = document.getElementById("custom-message-box");

        if (!messageBox) {
            messageBox = document.createElement("div");
            messageBox.id = "custom-message-box";
            messageBox.className =
                "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-0 pointer-events-none";
            messageBox.innerHTML = `
                            <div class="bg-white p-6 rounded-xl section-shadow max-w-sm w-full text-center transform scale-95 transition-transform duration-300" style="background-color: var(--color-section-light); border-color: var(--color-accent-dark);">
                                <h4 class="pixel-font text-xl mb-4" id="msg-title"></h4>
                                <p class="mb-6" id="msg-content"></p>
                                <button id="msg-close-button" class="text-white pixel-font px-4 py-2 rounded-full hover:opacity-90 transition duration-150" style="background-color: var(--color-accent-dark);">Close</button>
                            </div>
                        `;
            document.body.appendChild(messageBox);

            document
                .getElementById("msg-close-button")
                .addEventListener("click", () => {
                    messageBox.classList.remove("opacity-100", "pointer-events-auto");
                    messageBox.querySelector("div").classList.remove("scale-100");
                    messageBox.querySelector("div").classList.add("scale-95");
                });
        }

        // Set content and show
        document.getElementById("msg-title").textContent = title;
        document.getElementById("msg-content").textContent = message;

        messageBox.classList.add("opacity-100", "pointer-events-auto");
        messageBox.querySelector("div").classList.remove("scale-95");
        messageBox.querySelector("div").classList.add("scale-100");
    };
});
