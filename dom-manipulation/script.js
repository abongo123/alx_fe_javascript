alert('Hello World');

const quotes = [
    { text: "When a leaf falls down, it doesn't mean that it has become useless but instead it has changed from manufacturing to being the nutrients", category: "Motivation" },
    { text: "Planning is the first step towards achieving", category: "Encouragement" },
    { text: "You have a problem? Can you do something about it? Then why worry?", category: "Comforting" },
];

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (!quoteDisplay) return;

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `<p>"${quote.text}" - <strong>${quote.category}</strong></p>`;
}

function createAddQuoteForm() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (text && category) {
        quotes.push({ text, category });
        alert("Quote added successfully!");
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        populateCategories(); // Update dropdown with new category
    } else {
        window.alert("Please enter both quote text and category.");
    }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

document.addEventListener("DOMContentLoaded", () => {
    // Load last viewed quote from session storage
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<p>"${lastViewedQuote.text}" - <strong>${lastViewedQuote.category}</strong></p>`;
    } else {
        showRandomQuote();
    }

    populateCategories(); // Initialize categories on page load
    filterQuotes(); // Display filtered quote based on selected category
});

// Function to export quotes to a JSON file
document.getElementById('exportButton').addEventListener('click', function() {
  const json = JSON.stringify(quotes, null, 2); // Convert quotes array to a formatted JSON string
  const blob = new Blob([json], { type: 'application/json' }); // Create a Blob from the JSON data
  const url = URL.createObjectURL(blob); // Create an object URL for the Blob
  const a = document.createElement('a'); // Create a temporary anchor element
  a.href = url; // Set the href to the object URL
  a.download = 'quotes.json'; // Set the download filename
  document.body.appendChild(a); // Append the anchor to the document
  a.click(); // Trigger the download
  document.body.removeChild(a); // Remove the anchor element
  URL.revokeObjectURL(url); // Revoke the object URL to release resources
});

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories(); // Update dropdown with imported categories
    };
    fileReader.readAsText(event.target.files[0]);
}

// Step 2: Populate Categories Dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    
    // Ensure only valid quotes are used
    const validQuotes = quotes.filter(q => q && q.category);

    const categories = [...new Set(validQuotes.map(q => q.category))]; // Get unique categories

    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Load last selected filter from localStorage
    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

// Step 2: Filter Quotes Based on Selected Category
function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `<p>"${quote.text}" - <strong>${quote.category}</strong></p>`;
}

// Step 3: Store Last Selected Category in Local Storage
const categoryFilter = document.getElementById("categoryFilter");
categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    filterQuotes();
});

// Step 3: Update Categories in Dropdown Dynamically when Adding Quote
function addQuote(newQuote) {
    quotes.push(newQuote); // Add new quote to array
    populateCategories(); // Update the dropdown with new category if not present
}

// Initialize
populateCategories();
filterQuotes();


const apiUrl = 'https://jsonplaceholder.typicode.com/posts';  // Mock API URL

// Simulate periodic data fetching
function fetchServerData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched from server:', data);
            syncData(data); // Sync the fetched data with local storage
        })
        .catch(error => {
            console.error('Error fetching data from server:', error);
        });
}

// Simulate periodic fetching every 10 seconds
setInterval(fetchServerData, 10000);  // Adjust the interval as needed

let localQuotes = [
    { text: "When a leaf falls down, it doesn't mean that it has become useless but instead it has changed from manufacturing to being the nutrients", category: "Motivation" },
    { text: "Planning is the first step towards achieving", category: "Encouragement" },
    { text: "You have a problem? Can you do something about it? Then why worry?", category: "Comforting" },
];

// Sync server data with local data
function syncData(serverData) {
    const syncedQuotes = [...localQuotes];

    serverData.forEach(serverQuote => {
        const existingIndex = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.title);
        
        if (existingIndex === -1) {
            // Add new quote from server
            localQuotes.push({
                text: serverQuote.title,
                category: serverQuote.body, // Assuming body is the category in this case
            });
            console.log(`New quote added: ${serverQuote.title}`);
        } else {
            // Conflict: server data will take precedence
            localQuotes[existingIndex] = {
                text: serverQuote.title,
                category: serverQuote.body, 
            };
            console.log(`Quote updated from server: ${serverQuote.title}`);
        }
    });

    // Update UI or local storage with new merged data
    saveToLocalStorage();
}

// Save updated quotes to local storage
function saveToLocalStorage() {
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
}

// Display notification for data sync
function displaySyncNotification() {
    const notificationElement = document.getElementById('notification');
    notificationElement.style.display = 'block';

    // Event listener for manual conflict resolution
    document.getElementById('resolveConflictButton').addEventListener('click', () => {
        alert('Manual conflict resolution not implemented.');
    });
}

// Modify syncData function to trigger notification after syncing
function syncData(serverData) {
    const syncedQuotes = [...localQuotes];

    serverData.forEach(serverQuote => {
        const existingIndex = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.title);
        
        if (existingIndex === -1) {
            // Add new quote from server
            localQuotes.push({
                text: serverQuote.title,
                category: serverQuote.body, 
            });
            console.log(`New quote added: ${serverQuote.title}`);
        } else {
            // Conflict: server data will take precedence
            localQuotes[existingIndex] = {
                text: serverQuote.title,
                category: serverQuote.body, 
            };
            console.log(`Quote updated from server: ${serverQuote.title}`);
        }
    });

    saveToLocalStorage();
    displaySyncNotification();  // Show notification after syncing data
}

