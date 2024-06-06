// Dummy data for demonstration purposes
const dummyResults = [
    { type: 'profile', name: 'John Doe', description: 'Student at XYZ University' },
    { type: 'profile', name: 'Jane Smith', description: 'Professor of Computer Science' },
    { type: 'post', title: 'Interesting Post Title', content: 'This is the content of the post.' },
    { type: 'post', title: 'Another Post Title', content: 'This is some more content of another post.' },
    { type: 'video', title: 'Educational Video', description: 'This is a description of the video.' },
    { type: 'video', title: 'Another Video', description: 'Description of another educational video.' }
];

document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    console.log('Search query:', query); // Log the search query
    performSearch(query);
});

function performSearch(query) {
    // Simulate an API call
    const results = dummyResults.filter(item => {
        return item.name?.toLowerCase().includes(query.toLowerCase()) ||
               item.title?.toLowerCase().includes(query.toLowerCase()) ||
               item.description?.toLowerCase().includes(query.toLowerCase()) ||
               item.content?.toLowerCase().includes(query.toLowerCase());
    });
    
    console.log('Search results:', results); // Log the search results
    displayResults(results);
}

function displayResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        if (result.type === 'profile') {
            resultItem.innerHTML = `<h4>${result.name}</h4><p>${result.description}</p>`;
        } else if (result.type === 'post') {
            resultItem.innerHTML = `<h4>${result.title}</h4><p>${result.content}</p>`;
        } else if (result.type === 'video') {
            resultItem.innerHTML = `<h4>${result.title}</h4><p>${result.description}</p>`;
        }

        searchResultsContainer.appendChild(resultItem);
    });
}
