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

    populateStates();
});