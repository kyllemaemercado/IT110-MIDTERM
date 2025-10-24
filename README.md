# Random Quote Generator - IT110 Midterm Project

## Project Information
**Course & Section:** IT110-FP1 <br>
**Group Number:** 4  

**Team Members**
| Name | Role | Responsibilities |
|------|------|------------------|
| **Kylle Mae Mercado** | CSS Styling & Layout | Designed the entire system with pixelated theme, UI/UX design, visual elements |
| **Airah Nichole Montillano** | JavaScript & API Integration | Quality assurance, bug testing, functionality verification |
| **Maria Nikka Polintan** | HTML Structure | Testing, bug reporting, user experience testing |
| **Ramela Chama Pelayo** | Project Management & Documentation | Testing, error handling verification, documentation support |

## Project Overview
The **Random Quote Generator** is a web-based application that displays inspirational, motivational, and thought-provoking quotes to users. The project combines a portfolio-style landing page with a functional quote generation app, showcasing both frontend design skills and API integration capabilities.

### Key Features

- **Portfolio Integration**: Professional landing page introducing the development team
- **Random Quote Generation**: Fetches inspirational quotes from an external API
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Pixelated Theme**: Unique retro-inspired design aesthetic
- **Single Page Application (SPA)**: Smooth navigation without page reloads
- **Error Handling**: Robust retry logic and fallback mechanisms
- **Interactive UI**: Animated elements and hover effects

## Technologies Used

### Frontend Technologies
- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with CSS variables and animations
- **JavaScript (ES6+)**: Modern JavaScript for interactivity and API calls
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### External Resources
- **Font Awesome 6.0**: Icon library for social media and UI icons
- **Google Fonts**: 
  - Inter (400, 700) - Main body text
  - Press Start 2P - Pixelated retro headings
- **CORS Proxy**: `corsproxy.io` - Proxy service to bypass CORS restrictions
- **ZenQuotes API**: Source of inspirational quotes

### API Integration
**Primary API:** ZenQuotes API  
**Endpoint:** `https://zenquotes.io/api/random`  
**Proxy URL:** `https://corsproxy.io/?https://zenquotes.io/api/random`

**Why CORS Proxy?**  
The CORS proxy is used to prevent "Failed to fetch" errors in sandboxed environments where direct API calls may be blocked due to Cross-Origin Resource Sharing (CORS) policies.

## 📁 Project Structure
```
IT110-MIDTERM/
│
├── index.html          # Main HTML structure
├── style.css           # Custom CSS styles and animations
├── app.js              # Quote generator logic and API integration
├── script.js           # Navigation and view switching logic
├── images/             # Team member photos
│   ├── montillano.jpg
│   ├── polintan.jpg
│   ├── Pelayo.jpg
│   └── mercado.png
└── README.md           # Project documentation
```

## Core Functionality
### 1. Quote Generation System

The quote generator implements several advanced features:

#### Exponential Backoff Retry Logic
```javascript
- Maximum retries: 3 attempts
- Timeout per request: 5 seconds
- Delay between retries: Exponential (1s, 2s, 4s)
- Maximum delay: 30 seconds
```

#### Error Handling
- Network timeout detection
- HTTP error status handling
- Missing data validation
- Graceful fallback display
- User notification via custom message box

#### Loading States
- Spinner animation during fetch
- Disabled button during API call
- Dynamic text updates

### 2. Single Page Application (SPA) Navigation

The project implements custom SPA navigation without using frameworks:

- **View Switching**: Toggle between Hub View (portfolio) and App View (generator)
- **Smooth Scrolling**: Auto-scroll to target sections
- **Active State Management**: Visual feedback for current page
- **URL Hash Support**: Support for navigation via URL fragments

### 3. Responsive Design

The application is fully responsive across devices:

- **Mobile First**: Optimized for small screens (320px+)
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Flexible Layouts**: Grid and flexbox for adaptive layouts
- **Touch-Friendly**: Adequate touch targets for mobile users

## Design System

### Color Palette
```css
--color-bg-light: #FDF3F5        /* Light pink background */
--color-section-light: #FADDE1   /* Section background */
--color-accent-dark: #A02040     /* Primary accent color */
--color-heart: #ff4d6e           /* Heart decoration color */
```

### Typography
- **Headings**: Press Start 2P (Pixelated retro font)
- **Body Text**: Inter (Modern, readable sans-serif)
- **Font Sizes**: Responsive scaling with Tailwind utilities

### Visual Effects
- **Pixelated Hearts**: Animated background decorations
- **Shadow Effects**: Bold retro-style box shadows
- **Hover Animations**: Card expansion and button feedback
- **Pulse Animations**: Breathing effect on decorative elements

## User Instructions

### Getting Started

1. **Launch the Application**
   - Open `index.html` in a modern web browser
   - The home page will load automatically

2. **Navigate the Portfolio**
   - **HOME**: Introduction to the development team
   - **CONTACT US**: Meet the team members with their social links
   - **FEATURE**: Learn about the project features
   - **APP**: Access the quote generator

3. **Using the Quote Generator**
   - Click "APP" in the navigation menu
   - Click "GET NEW QUOTE" button to fetch a random quote
   - Wait for the quote to load (displays loading spinner)
   - Read the inspirational quote and author
   - Click the button again for a new quote

4. **Explore Team Information**
   - Navigate to "CONTACT US" section
   - Hover over team member cards to see details
   - Click social media icons to visit profiles

### Troubleshooting

**Quote not loading?**
- Check the internet connection
- The app will retry automatically (up to 3 times)
- If all retries fail, a fallback message is displayed

**Page not responsive?**
- Ensure JavaScript is enabled in your browser
- Try refreshing the page
- Use a modern browser (Chrome, Firefox, Safari, Edge)

##Technical Implementation Details

### API Request Flow

1. User clicks "GET NEW QUOTE" button
2. Button is disabled to prevent duplicate requests
3. Loading state is displayed with spinner
4. Fetch request sent to CORS proxy with timeout
5. API response parsed and validated
6. Quote and author extracted from response
7. UI updated with quote content
8. Button re-enabled for next request

### Error Recovery Strategy

```
Attempt 1 → Fail → Wait 1s
Attempt 2 → Fail → Wait 2s
Attempt 3 → Fail → Wait 4s
Final Fail → Show fallback message
```

### Data Validation

The app validates API responses to ensure:
- Response is valid JSON
- Data structure matches expected format
- Quote text exists and is not empty
- Author information is present
- Handles both array and object response formats

## Learning Outcomes

This project demonstrates proficiency in:

1. **Frontend Development**
   - Semantic HTML structure
   - Advanced CSS techniques (animations, transitions, flexbox, grid)
   - Responsive web design principles

2. **JavaScript Programming**
   - Asynchronous programming (async/await, Promises)
   - Error handling and recovery
   - DOM manipulation
   - Event handling
   - API integration

3. **Software Engineering Practices**
   - Code organization and modularity
   - User experience design
   - Error handling and edge cases
   - Documentation

4. **Teamwork and Collaboration**
   - Role distribution and specialization
   - Collaborative development
   - Code integration
   - Quality assurance

## Technical Goals Achieved

✅ **API Integration**: Successfully integrated external API with error handling  
✅ **Responsive Design**: Works seamlessly across all device sizes  
✅ **User Experience**: Intuitive navigation and interaction  
✅ **Error Handling**: Robust retry logic and user feedback  
✅ **Modern JavaScript**: ES6+ features and best practices  
✅ **Code Quality**: Clean, readable, and well-commented code  
✅ **Design Consistency**: Cohesive visual theme throughout  
✅ **Performance**: Fast loading and smooth interactions  

