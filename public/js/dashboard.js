document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('You must be logged in to view the dashboard.');
        window.location.href = '/';
        return;
    }

    const userId = localStorage.getItem('userId');
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    const form = document.getElementById('recommendation-form');
    let locationsData = [];

    async function populateStates() {
        try {
            locationsData = await getLocations();
            locationsData.forEach(location => {
                const option = document.createElement('option');
                option.value = location.state;
                option.textContent = location.state;
                stateSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    }

    stateSelect.addEventListener('change', () => {
        citySelect.innerHTML = '<option value="">Select City</option>';
        const selectedState = locationsData.find(s => s.state === stateSelect.value);
        if (selectedState) {
            citySelect.disabled = false;
            selectedState.cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } else {
            citySelect.disabled = true;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            userId: userId,
            soilPh: document.getElementById('soilPh').value,
            moisture: document.getElementById('moisture').value,
            nitrogen: document.getElementById('nitrogen').value,
            phosphorus: document.getElementById('phosphorus').value,
            potassium: document.getElementById('potassium').value,
            temperature: document.getElementById('temperature').value,
            area: document.getElementById('area').value,
            rainfall: document.getElementById('rainfall').value,
            season: document.getElementById('season').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value,
            pastCrop: document.getElementById('pastCrop').value,
        };
        const result = await submitRecommendationRequest(formData);
        if (result) {
            localStorage.setItem('recommendationResult', JSON.stringify(result));
            window.location.href = '/recommend';
        } else {
            alert('Failed to get a recommendation. Please try again.');
        }
    });


     async function displayRecentRecommendations() {
        const recentRecsContainer = document.getElementById('recent-recommendations');
        try {
            const recommendations = await getRecentRecommendations(userId);
            if (recommendations && recommendations.length > 0) {
                recentRecsContainer.innerHTML = ''; 
                recommendations.slice(0, 3).forEach(rec => { 
                    const recElement = document.createElement('div');
                    recElement.className = 'recommendation-item';
                    recElement.innerHTML = `
                        <p><strong>${rec.recommendedCrop}</strong> in ${rec.city}</p>
                        <small>${new Date(rec.createdAt).toLocaleDateString()}</small>
                    `;
                    recentRecsContainer.appendChild(recElement);
                });
            }
        } catch (error) {
            console.error('Error loading recent recommendations:', error);
        }
    }

    const chatWindow = document.querySelector('.chat-window');
    const chatInput = document.getElementById('chat-query');
    const askBtn = document.getElementById('ask-btn');

    const dummyResponses = {
        "hi": "Hello Sir, how can I help you...",
        "hello": "Hi Sir, how can I help you...",
        "fertilizer for wheat": "For wheat, an NPK ratio of 120:60:40 kg/ha is generally recommended.",
        "best time to plant rice": "The ideal time for planting Kharif rice is June-July.",
        "what is soil ph": "Soil pH is a measure of soil acidity or alkalinity. Most crops prefer a pH between 6.0 and 7.5.",                
        "default": "I'm sorry, I can only answer predefined questions. Try asking about 'fertilizer for wheat' or 'best time to plant rice'."
    };

    const handleChat = () => {
        const query = chatInput.value.trim().toLowerCase();
        if (!query) return;

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.textContent = chatInput.value;
        chatWindow.appendChild(userMessage);

        let response = dummyResponses.default;
        for (const key in dummyResponses) {
            if (query.includes(key)) {
                response = dummyResponses[key];
                break;
            }
        }
        
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.textContent = response;
            chatWindow.appendChild(botMessage);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 500);

        chatInput.value = '';
    };

    askBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    populateStates();
    displayRecentRecommendations();
});

//     populateStates();
// });