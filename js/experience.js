const experienceURL = 'https://api.acronical.uk/experience';
const altExperienceURL = 'https://api.acronical.co.uk/experience';
const dropdownList = document.querySelector('.dropdown-list');
const dropdownListButton = document.querySelector('.dropdown-open-button');
const experienceHeader = document.querySelector('.experience-title');
const experienceDescription = document.querySelector('.experience-description');
const experienceTimeframe = document.querySelector('.experience-timeframe');
const experienceIcon = document.querySelector('.experience-icon');
const experienceBanner = document.querySelector('.experience-banner');

async function fetchAllExperience() {
    try {
        const response = await fetch(experienceURL);
        return await response.json();
    } catch  {  
        try {
            const response = await fetch(altExperienceURL);
            return await response.json();
        } catch (error) {
            console.log("Failed to get projects")
        }
    }
}

async function fetchExperience(experienceName) {
    try {
        for (const [key, experience] of Object.entries(await fetchAllExperience())) {
            if (experience.name === experienceName) return experience;
        }
    } catch (error) {
        console.error('Failed to fetch experience:', error);
    }
}

window.onload = async () => {
    const experiences = await fetchAllExperience();
    for (const [key, experience] of Object.entries(experiences)) {
        const experienceElement = document.createElement('li');
        experienceElement.classList.add('dropdown-item');
        experienceElement.textContent = experience.name;
        dropdownList.appendChild(experienceElement);
    }
}

dropdownListButton.addEventListener('click', () => {
    dropdownList.classList.toggle('open');
});

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('dropdown-item')) {
        const item = e.target;
        console.log("Clicked on", item.textContent);
        const experience = await fetchExperience(item.textContent);
        console.log(experience);
        dropdownListButton.textContent = experience.name;
        experienceHeader.textContent = experience.name;
        experienceDescription.textContent = experience.description;
        experienceDescription.classList.remove('hidden');
        if (experience.left) {
            experienceTimeframe.textContent = `Started ${experience.start} ended ${experience.end}`;
            experienceTimeframe.classList.remove('hidden');
        } else if (!experience.left) {
            experienceTimeframe.textContent = `Started ${experience.start}`;
            experienceTimeframe.classList.remove('hidden');
        }
        if (experience.images.icon) {
            experienceIcon.src = experience.icon;
            experienceIcon.classList.remove('hidden');
        }
        if (experience.images.banner) {
            experienceBanner.src = experience.images.banner;
            experienceBanner.classList.remove('hidden');
        }
        if (experience.link) {
            experienceHeader.href = experience.link;
        }
    }
});