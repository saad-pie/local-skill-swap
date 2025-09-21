// Local Skill Swap JavaScript
// This script can be expanded for future interactivity,
// such as dynamic content loading, form validation, or animations.

document.addEventListener('DOMContentLoaded', () => {
    console.log('Local Skill Swap website loaded!');

    // Check if the current page is the skills page
    if (document.body.classList.contains('skills-page')) {
        loadSkills();
    }
});

async function loadSkills() {
    try {
        const response = await fetch('./database.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const skills = data.skills; // Assuming 'skills' is the key in database.json
        const skillListingsContainer = document.getElementById('skill-listings-container');

        if (skillListingsContainer && skills) {
            skillListingsContainer.innerHTML = ''; // Clear any existing content
            skills.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.classList.add('skill-card');
                skillCard.innerHTML = `
                    <img src="${skill.image}" alt="${skill.title}" class="skill-image">
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
