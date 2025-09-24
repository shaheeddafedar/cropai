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
    "hi": "Hello Sir, how can I help you with your farming today?",
    "hello": "Hi Sir, how can I help you?",
    "how are you": "I am an AI assistant, ready to help you with your questions!",
    "what is your name": "You can call me AgriMind, your smart farming assistant.",
    "thank you": "You're welcome! Is there anything else I can help you with?",
    "thanks": "You're welcome! Do you have any other questions?",
    // --- General Farming Knowledge ---
    "what is npk": "NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K). They are the three most important nutrients for healthy plant growth.",
    "what is crop rotation": "Crop rotation is the practice of planting different crops sequentially on the same plot of land to improve soil health, manage pests, and reduce erosion.",
    "what is kharif season": "The Kharif season is the monsoon sowing season in India, typically starting in June. Rice, maize, and cotton are common Kharif crops.",
    "what is rabi season": "The Rabi season is the winter sowing season in India, usually starting in November. Wheat, barley, and mustard are common Rabi crops.",
    // --- Specific Crop Advice ---
    "fertilizer for wheat": "For wheat, an NPK ratio of 120:60:40 kg/ha is generally recommended.",
    "best time to plant rice": "The ideal time for planting Kharif rice is June-July, with the onset of the monsoon.",
    "water for sugarcane": "Sugarcane is a water-intensive crop, requiring about 1500-2500 mm of water throughout its growing season.",
    "common disease in cotton": "A common disease in cotton is Boll Rot, which can be managed by ensuring good drainage and proper spacing between plants.",
    "fertilizer for cotton crop": "Use 150:60:60 NPK per hectare for cotton, with micronutrients like zinc if needed.",
    "ideal spacing for maize": "Maintain 60 cm between rows and 20 cm between plants for maize.",
    // --- Soil Health Advice ---
    "what is soil ph": "Soil pH is a measure of soil acidity or alkalinity. Most crops prefer a neutral pH between 6.0 and 7.5.",
    "how to increase soil ph": "To increase soil pH (make it less acidic), you can apply materials like lime (calcium carbonate). It's best to get a soil test to know the exact amount needed.",
    "how to decrease soil ph": "To decrease soil pH (make it less alkaline), you can add organic matter like compost or use acidifying fertilizers like ammonium sulfate.",
    // --- Fallback Message ---
    "default": "I'm sorry, I can only answer predefined questions. Try asking about 'fertilizer for wheat' or 'what is crop rotation'."
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

