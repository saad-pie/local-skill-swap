// Local Skill Swap JavaScript
// This script can be expanded for future interactivity,
// such as dynamic content loading, form validation, or animations.

document.addEventListener('DOMContentLoaded', () => {
    console.log('Local Skill Swap website loaded!');

    // Check if the current page is the skills page
    if (document.body.classList.contains('skills-page')) {
        loadSkills();
    }

    // Check if the current page is the add-skill page
    if (document.body.classList.contains('add-skill-page')) {
        setupAddSkillForm();
    }
});

async function loadSkills() {
    try {
        const response = await fetch('./database.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let skills = data.skills; // Skills from database.json

        // Get client-side added skills from localStorage
        const clientSkillsJSON = localStorage.getItem('newlyAddedSkills');
        const clientSkills = clientSkillsJSON ? JSON.parse(clientSkillsJSON) : [];

        // Combine skills from database.json and client-side skills from localStorage.
        // Ensure client-side skills have unique IDs, especially if database.json changes.
        let maxDbId = skills.length > 0 ? Math.max(...skills.map(s => s.id)) : 0;
        clientSkills.forEach(skill => {
            // Assign a unique ID if it doesn't have one or if it clashes with existing IDs
            if (!skill.id || skill.id <= maxDbId) {
                maxDbId++;
                skill.id = maxDbId; // Assign a new unique ID
            }
        });

        const allSkills = [...skills, ...clientSkills]; // Combine all skills

        const skillListingsContainer = document.getElementById('skill-listings-container');

        if (skillListingsContainer && allSkills) {
            skillListingsContainer.innerHTML = ''; // Clear any existing content
            if (allSkills.length === 0) {
                skillListingsContainer.innerHTML = '<p>No skills available yet. Be the first to add one!</p>';
                return;
            }
            allSkills.forEach(skill => {
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

            // Generate a unique ID (client-side) and a placeholder image
            // Using timestamp for a reasonably unique ID
            const newSkillId = Date.now();
            const newSkillImage = `https://picsum.photos/400/300?random=${newSkillId}`;

            const newSkill = {
                id: newSkillId,
                title: skillTitle,
                description: skillDescription,
                offeredBy: offeredBy,
                lookingFor: lookingFor,
                image: newSkillImage
            };

            // Get existing client-side skills from localStorage
            const clientSkillsJSON = localStorage.getItem('newlyAddedSkills');
            let clientSkills = clientSkillsJSON ? JSON.parse(clientSkillsJSON) : [];

            // Add the new skill
            clientSkills.push(newSkill);

            // Save updated skills back to localStorage
            localStorage.setItem('newlyAddedSkills', JSON.stringify(clientSkills));

            // Display success message
            formMessage.textContent = 'Skill added successfully! It will appear on the "Browse Skills" page. (Note: This is client-side only and not persistent across all users or if your browser storage is cleared).';
            formMessage.style.color = 'green';
            addSkillForm.reset(); // Clear the form

            console.log('New skill added:', newSkill);
        });
    }
}
