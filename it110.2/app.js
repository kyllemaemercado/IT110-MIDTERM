
        document.addEventListener('DOMContentLoaded', () => {
            const quoteButton = document.getElementById('quote-button');
            const quoteDisplay = document.getElementById('quote-display');
            const quoteAuthor = document.getElementById('quote-author');
            // FIX: Using a CORS proxy to prevent "Failed to fetch" errors in sandboxed environments.
            const quoteApiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://api.quotable.io/random');

            // --- VIEW SWITCHING LOGIC (SPA Navigation) ---
            const navLinks = document.querySelectorAll('#main-nav a');
            const hubView = document.getElementById('hub-view');
            const appView = document.getElementById('app-view');

            const views = {
                'hub-view': hubView,
                'app-view': appView
            };

            /**
             * Switches the visibility of the main content views, updates navigation, and scrolls to a target section if specified.
             */
            const switchView = (targetViewId, targetSectionId) => {
                Object.entries(views).forEach(([id, view]) => {
                    if (view) {
                        view.classList.add('hidden');
                    }
                });

                const targetView = views[targetViewId];
                if (targetView) {
                    targetView.classList.remove('hidden');
                }

                // Update active class on navigation links
                navLinks.forEach(link => {
                    link.classList.remove('active-view');
                    const linkTargetId = link.getAttribute('data-target-id');
                    
                    // Activate link based on the specific target section ID
                    if (linkTargetId === targetSectionId) {
                         link.classList.add('active-view');
                    }
                });
                
                // Scroll to the target section if specified and we are in the hub view
                if (targetSectionId && targetViewId === 'hub-view') {
                    const section = document.getElementById(targetSectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            };

            // Attach event listeners to navigation links
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetViewId = e.target.getAttribute('data-view');
                    const targetSectionId = e.target.getAttribute('data-target-id');
                    
                    if (targetViewId) {
                        switchView(targetViewId, targetSectionId);
                    }
                });
            });

            // Initial view load: Default to showing the Hub view and scrolling to Home
            const initialLink = navLinks[0];
            const initialViewId = initialLink ? initialLink.getAttribute('data-view') : 'hub-view';
            const initialTargetId = initialLink ? initialLink.getAttribute('data-target-id') : 'home';
            switchView(initialViewId, initialTargetId);


            // --- QUOTE GENERATOR LOGIC (API Integration and Error Handling) ---

        
            const exponentialBackoff = (attempt) => {
                const delay = Math.min(1000 * Math.pow(2, attempt), 30000); 
                return new Promise(resolve => setTimeout(resolve, delay));
            };

            /**
             * Fetches a random quote from the API with retry logic and displays it.
             */
            const fetchQuote = async () => {
                quoteDisplay.innerHTML = '<i class="fas fa-spinner fa-spin text-2xl mr-2"></i>Loading inspiration...';
                quoteAuthor.textContent = '— ...';
                const maxRetries = 3;
                const requestTimeoutMs = 5000; 

                for (let attempt = 0; attempt < maxRetries; attempt++) {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);
                    
                    try {
                        // Pass the signal to the fetch call
                        const response = await fetch(quoteApiUrl, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data = await response.json();
                        
                        if (data.content && data.author) {
                            // Display the quote with quote icons for style
                            quoteDisplay.innerHTML = `
                                <i class="fas fa-quote-left text-3xl sm:text-4xl mr-2 opacity-50 block sm:inline"></i>
                                ${data.content}
                                <i class="fas fa-quote-right text-3xl sm:text-4xl ml-2 opacity-50 block sm:inline"></i>
                            `;
                            quoteAuthor.textContent = `— ${data.author}`;
                            return; 
                        } else {
                            throw new Error("Missing 'content' or 'author' field in API response.");
                        }

                    } catch (error) {
                        clearTimeout(timeoutId); 
                        
                        const isAbortError = error.name === 'AbortError';
                        console.error(`Attempt ${attempt + 1}: Failed to fetch quote: `, isAbortError ? 'Request timed out' : error);

                        if (attempt < maxRetries - 1) {
                            await exponentialBackoff(attempt);
                        } else {
                            quoteDisplay.innerHTML = `
                                <i class="fas fa-exclamation-triangle text-3xl sm:text-4xl mr-2 text-red-500"></i>
                                API Connection Failed.<br>Displaying a static quote.
                            `;
                            quoteAuthor.textContent = '— System Fallback';
                            
                            // Show a custom message box instead of alert()
                            showMessageBox('Connection Error', 'Could not fetch a live quote after multiple attempts due to a network failure or timeout. Displaying a static fallback quote instead.');
                        }
                    }
                }
            };

            if (quoteButton) {
                quoteButton.addEventListener('click', fetchQuote);
                fetchQuote();
            }

            // --- Custom Message Box (Replacing alert() / confirm()) ---
            
            const showMessageBox = (title, message) => {
                let messageBox = document.getElementById('custom-message-box');
                
                if (!messageBox) {
                    messageBox = document.createElement('div');
                    messageBox.id = 'custom-message-box';
                    messageBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-0 pointer-events-none';
                    messageBox.innerHTML = `
                        <div class="bg-white p-6 rounded-xl section-shadow max-w-sm w-full text-center transform scale-95 transition-transform duration-300" style="background-color: var(--color-section-light); border-color: var(--color-accent-dark);">
                            <h4 class="pixel-font text-xl mb-4" id="msg-title"></h4>
                            <p class="mb-6" id="msg-content"></p>
                            <button id="msg-close-button" class="text-white pixel-font px-4 py-2 rounded-full hover:opacity-90 transition duration-150" style="background-color: var(--color-accent-dark);">Close</button>
                        </div>
                    `;
                    document.body.appendChild(messageBox);

                    document.getElementById('msg-close-button').addEventListener('click', () => {
                        messageBox.classList.remove('opacity-100', 'pointer-events-auto');
                        messageBox.querySelector('div').classList.remove('scale-100');
                        messageBox.querySelector('div').classList.add('scale-95');
                    });
                }
                
                // Set content and show
                document.getElementById('msg-title').textContent = title;
                document.getElementById('msg-content').textContent = message;
                
                messageBox.classList.add('opacity-100', 'pointer-events-auto');
                messageBox.querySelector('div').classList.remove('scale-95');
                messageBox.querySelector('div').classList.add('scale-100');
            };
        });

