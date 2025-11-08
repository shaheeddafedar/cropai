document.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    const form = document.getElementById('recommendation-form');
    let locationsData = []; 

    const recommendationsContainer = document.getElementById('recent-recommendations');
    const fetchBtn = document.getElementById('fetch-farm-details-btn');
    const farmIdInput = document.getElementById('farmId');

    async function loadRecentRecommendations() {
        if (!recommendationsContainer) return;

        if (typeof USER_ID === 'undefined' || !USER_ID) {
            recommendationsContainer.innerHTML = '<p>Could not find user session.</p>';
            return;
        }

        try {
            const recommendations = await getRecentRecommendations(USER_ID);
            
            if (!recommendations || recommendations.length === 0) {
                recommendationsContainer.innerHTML = '<p>You have no recent recommendations.</p>';
                return;
            }

            recommendationsContainer.innerHTML = '';
            
            recommendations.forEach(rec => {
                const card = document.createElement('div');
                card.className = 'recommendation-card'; 
                
                const formattedDate = new Date(rec.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
                
                card.innerHTML = `
                    <strong>${rec.recommendedCrop}</strong>
                    <span>${formattedDate}</span>
                `;
                recommendationsContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Error loading recommendations:', error);
            recommendationsContainer.innerHTML = '<p>Could not load recommendations.</p>';
        }
    }

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

    function populateCities(selectedStateName) {
        citySelect.innerHTML = '<option value="">Select City</option>'; 
        const selectedState = locationsData.find(s => s.state === selectedStateName);
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
    }

    stateSelect.addEventListener('change', () => {
        populateCities(stateSelect.value);
    });

    // --- FEATURE 3: Submit Main Form ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (typeof USER_ID === 'undefined' || !USER_ID) {
            alert('Error: User session not found. Please log in again.');
            return;
        }

        const formData = {
            userId: USER_ID,
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

    // --- FEATURE 4: Fetch Farm ID Button ---
    fetchBtn.addEventListener('click', async () => {
        const farmId = farmIdInput.value.trim().toUpperCase();
        if (!farmId) {
            alert('Please enter a Farm ID.');
            return;
        }

        try {
            fetchBtn.disabled = true;
            fetchBtn.textContent = 'Fetching...';
            
            const response = await fetch(`/api/farm/${farmId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    alert('Farm ID not found. Please check the ID and try again.');
                } else {
                    throw new Error('Failed to fetch farm data.');
                }
                return;
            }

            const farmData = await response.json();
            
            document.getElementById('soilPh').value = farmData.soilPh;
            document.getElementById('moisture').value = farmData.moisture;
            document.getElementById('nitrogen').value = farmData.nitrogen;
            document.getElementById('phosphorus').value = farmData.phosphorus;
            document.getElementById('potassium').value = farmData.potassium;
            document.getElementById('temperature').value = farmData.temperature;
            document.getElementById('rainfall').value = farmData.rainfall;
            document.getElementById('state').value = farmData.state;
            
            populateCities(farmData.state);
            document.getElementById('city').value = farmData.city;

        } catch (error) {
            console.error('Error fetching farm details:', error);
            alert('An error occurred. Please try again.');
        } finally {
            fetchBtn.disabled = false;
            fetchBtn.textContent = 'Fetch';
        }
    });

    populateStates(); 
    loadRecentRecommendations(); 
});