// Local Skill Swap JavaScript
// This script can be expanded for future interactivity,
// such as dynamic content loading, form validation, or animations.

document.addEventListener('DOMContentLoaded', () => {
    console.log('Local Skill Swap website loaded!');

    if (document.body.classList.contains('skills-page')) {
        loadSkills(); // Initial load of all skills
        const searchInput = document.getElementById('skillSearchInput');
        const searchButton = document.getElementById('searchButton');

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();
                loadSkills(searchTerm);
            });
        }

        if (searchInput) {
            // Optional: Live search as user types
            searchInput.addEventListener('keyup', () => {
                const searchTerm = searchInput.value.toLowerCase();
                loadSkills(searchTerm);
            });
            // Also trigger search on clear button in search input
            searchInput.addEventListener('search', () => {
                const searchTerm = searchInput.value.toLowerCase();
                loadSkills(searchTerm);
            });
        }
    }

    if (document.body.classList.contains('add-skill-page')) {
        setupAddSkillForm();
    }
});

// loadSkills now accepts an optional searchTerm
async function loadSkills(searchTerm = '') {
    try {
        const response = await fetch('./database.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let skills = data.skills; // Skills from database.json

        let filteredSkills = skills.filter(skill => {
            const skillValues = `${skill.title} ${skill.description} ${skill.offeredBy} ${skill.lookingFor}`.toLowerCase();
            return skillValues.includes(searchTerm);
        });

        const skillListingsContainer = document.getElementById('skill-listings-container');

        if (skillListingsContainer) {
            skillListingsContainer.innerHTML = ''; // Clear any existing content
            if (filteredSkills.length === 0) {
                skillListingsContainer.innerHTML = '<p>No skills found matching your search criteria. Try a different term!</p>';
                return;
            }
            filteredSkills.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.classList.add('skill-card');
                // Use specific image if provided, otherwise a random one based on ID
                const imageUrl = skill.image || `https://picsum.photos/400/300?random=${skill.id}`;
                skillCard.innerHTML = `
                    <img src="${imageUrl}" alt="${skill.title}" class="skill-image">
                    <div class="skill-content">
                        <h3>${skill.title}</h3>
                        <p class="skill-description">${skill.description}</p>
                        <p><strong>Offered by:</strong> ${skill.offeredBy}</p>
                        <p><strong>Looking for:</strong> ${skill.lookingFor}</p>
                        <button class="btn btn-small">Connect</button>
                    </div>
                `;
                skillListingsContainer.appendChild(skillCard);
            });
        }
    } catch (error) {
        console.error('Could not load skills:', error);
        const skillListingsContainer = document.getElementById('skill-listings-container');
        if (skillListingsContainer) {
            skillListingsContainer.innerHTML = '<p>Failed to load skill listings. Please try again later.</p>';
        }
    }
}

function setupAddSkillForm() {
    const addSkillForm = document.getElementById('add-skill-form');
    const formMessage = document.getElementById('form-message');

    if (addSkillForm) {
        addSkillForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const skillTitle = document.getElementById('skillTitle').value.trim();
            const skillDescription = document.getElementById('skillDescription').value.trim();
            const offeredBy = document.getElementById('offeredBy').value.trim();
            const lookingFor = document.getElementById('lookingFor').value.trim();

            // Simple validation
            if (!skillTitle || !skillDescription || !offeredBy || !lookingFor) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.style.color = 'red';
                return;
            }

            // --- IMPORTANT CHANGE --- Remove localStorage saving.
            // As an AI agent with file write access, if the user requested to add a *specific* skill
            // via this form, the agent would update database.json directly in its response.
            // For this submission, it simply confirms receipt without client-side persistence.
            
            formMessage.textContent = 'Skill submission received! It would be added to the database. (Note: This is a simulated submission as client-side JavaScript cannot directly modify server files.)';
            formMessage.style.color = 'green';
            addSkillForm.reset(); // Clear the form
        });
    }
}