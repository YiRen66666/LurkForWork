import { AUTH } from './constants.js';
import { userToBackend, jobDeleteToBackend, updateJobToBackend,updateProfileToBackend,addJobsToBackend,chooseWatchToBackend} from './data-provider.js';
import { jobInfo, jumpToProfile, clearModalBody, rerenderCurrentView } from './feed.js';
import { createButton } from './modal.js'
import {createForm,createErrorPopup} from './modal.js';
import { fileToDataUrl } from './helpers.js';


// Handle job deletion by calling backend, then reload page
export const handleJobDelete=(jobId)=>{
    jobDeleteToBackend(jobId)
    .then(()=>{
        removeOldProfileElements();
                rerenderCurrentView();
    })
}

// Convert image file to base64, send job update to backend
const readyToUpdateJob=(jobId,title,jobImage,jobStart,description)=>{
    if (jobImage){
        fileToDataUrl(jobImage)
        .then((res)=>{
            return  updateJobToBackend(jobId,title,res,jobStart,description)
            .then(() => { 
                removeOldProfileElements();
                rerenderCurrentView(); 
            })
        })
    }
}

// Remove previous profile and feed elements to avoid duplication
export const removeOldProfileElements = () => {
    const oldPost = document.getElementById("postContainer");
    if (oldPost) oldPost.remove();
    const oldUpdateBtn = document.querySelector(".updateProfile-btn");
    if (oldUpdateBtn) oldUpdateBtn.remove();
    const oldAddJobBtn = document.querySelector(".addJob-btn");
    if (oldAddJobBtn) oldAddJobBtn.remove();
    const oldProfile = document.getElementById("profile-container");
    if (oldProfile) oldProfile.remove();
    const oldJob = document.getElementById("job-container");
    if (oldJob) oldJob.remove();
    const oldBtn = document.querySelector(".profile-btn");
    if (oldBtn) oldBtn.remove();
    const oldSearch = document.querySelector(".search-btn");
    if (oldSearch) oldSearch.remove();
};

// Open modal to update a job and handle the submission
export const triggerUpdateJob = (jobId) =>{
    const modal = document.getElementById('update-profile');
    const modalBody = document.getElementById('update-body');
  
    while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.firstChild);
    }
    const modalTitle = document.getElementById('ModalLabel');
    modalTitle.innerText = 'Update Jobs';

    createForm('label', 'Title', 'text', modalBody, 'job-title');
    createForm('label', 'Start Date (DD/MM/YYYY)', 'text', modalBody, 'job-start');
    createForm('label', 'Description', 'text', modalBody, 'job-description');
    createForm('label', 'Image', 'file', modalBody, 'job-image');

    const updateChangesBtn = document.getElementById("update-changes-btn");
    updateChangesBtn.innerText = 'Update!';
    updateChangesBtn.addEventListener("click",(e)=>{
        const title = document.getElementById('job-title').value;
        const jobImage = document.getElementById('job-image').files[0];
        const jobStart = document.getElementById('job-start').value;
        const description = document.getElementById('job-description').value;
        if (!title || !jobImage || !jobStart || !description) {
            createErrorPopup("Please fill in all fields before submitting.");
            return;
        }
      
        e.preventDefault();
        readyToUpdateJob(jobId,title,jobImage,jobStart,description);
    })

    const displayUpdateModal = new bootstrap.Modal(document.getElementById('update-profile'));
    displayUpdateModal.show();
}



// Convert profile image to base64 and update profile info
const readyToUpdate=(email,password,name,imageFile)=>{
    if (imageFile){
        fileToDataUrl(imageFile)
        .then((res)=>{
            return updateProfileToBackend(email,password,name,res)
            .then(() => { 
                removeOldProfileElements();
                rerenderCurrentView();
             })
        })
    }
}

// Open modal to update profile
const triggerUpdateProfile = () =>{
    const modal = document.getElementById('update-profile');
    const modalBody = document.getElementById('update-body');
  
    clearModalBody();
    const modalTitle = document.getElementById('ModalLabel');
    modalTitle.innerText = 'Update Profile'
  
    createForm('label', 'Name', 'text', modalBody, 'name-input');
    createForm('label', 'Email', 'email', modalBody, 'email-input');
    createForm('label', 'Password', 'password', modalBody, 'password-input');
    createForm('label', 'Profile Image', 'file', modalBody, 'image-input');

    const userId = localStorage.getItem(AUTH.USER_KEY);
    userToBackend(userId).then((res) => {
        const nameInput = document.getElementById('name-input');
        const emailInput = document.getElementById('email-input');
        const passWordInput = document.getElementById('password-input');
        // By default, name and email is placeholder, if users want to change, re-enter, password for security reason doesn't show
        nameInput.value = res.name;
        emailInput.value = res.email;

      });
    // get the updated profile information, and ready to update to the backend
    const updateChangesBtn = document.getElementById("update-changes-btn");
    updateChangesBtn.innerText = 'Comment';
    updateChangesBtn.addEventListener("click",(e)=>{
        const name = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const imageFile = document.getElementById('image-input').files[0];
        // all of info must be filled, otherwirse pop error 
        if (!name || !email || !password || !imageFile) {
            createErrorPopup("Please fill in all fields before submitting.");
            return;
        }
      
        e.preventDefault();
        readyToUpdate(email,password,name,imageFile);
    })

    const displayUpdateModal = new bootstrap.Modal(document.getElementById('update-profile'));
    displayUpdateModal.show();
}

// Convert job image to base64 and send to backend
const readyToAddJobs=(title,jobImage,jobStart,description)=>{
    if (jobImage){
        fileToDataUrl(jobImage)
        .then((res)=>{
            return addJobsToBackend(title,res,jobStart,description)
            .then(() => { 
                    removeOldProfileElements();
                    rerenderCurrentView(); 
                    bootstrap.Modal.getInstance(document.getElementById('update-profile')).hide();
                }
            )
        })
    }
}

// Open modal to add new job
export const triggerAddJob = () =>{
        const modal = document.getElementById('update-profile');
        const modalBody = document.getElementById('update-body');
        while (modalBody.firstChild) {
            modalBody.removeChild(modalBody.firstChild);
        }
        const modalTitle = document.getElementById('ModalLabel');
        modalTitle.innerText = 'Add New Job'
        createForm('label', 'Title', 'text', modalBody, 'job-title');
        const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        createForm('label', 'Start Date', 'date', modalBody, 'job-start');
        document.getElementById('job-start').setAttribute('min', today);
        createForm('label', 'Description', 'text', modalBody, 'job-description');
        createForm('label', 'Image', 'file', modalBody, 'job-image');

        const updateChangesBtn = document.getElementById("update-changes-btn");
        updateChangesBtn.innerText = 'Add!';
        const newBtn = updateChangesBtn.cloneNode(true); 
        updateChangesBtn.parentNode.replaceChild(newBtn, updateChangesBtn);
        newBtn.addEventListener("click",(e)=>{
            const title = document.getElementById('job-title').value;
            const jobImage = document.getElementById('job-image').files[0];
            const jobStart = document.getElementById('job-start').value;
            const description = document.getElementById('job-description').value;
            // all of info must be filled, otherwirse pop error 
            if (!title || !jobImage || !jobStart || !description) {
                createErrorPopup("Please fill in all fields before submitting.");
                return;
            }
        
            e.preventDefault();
            readyToAddJobs(title,jobImage,jobStart,description);

        })
    const displayUpdateModal = new bootstrap.Modal(document.getElementById('update-profile'));
    displayUpdateModal.show();
}

// Render the logged-in user's own profile with editable buttons and job controls
export const renderOwnProfile=(userId)=>{
    removeOldProfileElements();
    const main = document.querySelector('main[role="main"]');
    document.querySelector('.button-group')?.remove();
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');
    // Only login users themselves can have the right to  update own profile and add new jobs
    const updateProfileBtn = createButton("update my own profile", triggerUpdateProfile);
    updateProfileBtn.classList.add('updateProfile-btn','profile-btn');
    buttonGroup.appendChild(updateProfileBtn);

    const addJobBtn = createButton("Add Job",triggerAddJob);
    addJobBtn.classList.add('addJob-btn','profile-btn');
    buttonGroup.appendChild(addJobBtn);

    main.appendChild(buttonGroup);
    const profileContainer = document.createElement("div");
    profileContainer.id = "profile-container";
    main.appendChild(profileContainer);
    const jobContainer = document.createElement("div");
    jobContainer.id = "job-container";
    main.appendChild(jobContainer);
    userToBackend(userId)
    .then((res) => {
        // Title is different than other profile, which let user feel more comfortable
        // render profile as the requirement
        const title = document.createElement("h1");
        title.innerText = "Welcome! This is my profile"
        profileContainer.appendChild(title);

        const name = document.createElement("h3");
        name.innerText = res.name;
        profileContainer.appendChild(name);

        const email = document.createElement("h3");
        email.innerText = res.email;
        profileContainer.appendChild(email);

        const imageContainer = document.createElement("div");
        const img = new Image();
        img.src = res.image;
        img.alt = "Oops! This user hasn't upload the profile image!";
        img.width = 100;
        img.height = 100;
        imageContainer.appendChild(img);
        profileContainer.appendChild(imageContainer);

        const countText = document.createElement("p");
        countText.innerText = `${res.usersWhoWatchMeUserIds.length} watchers`;
        profileContainer.appendChild(countText);

        const chooseWatchButton = generateChooseWatcButton(res);
        profileContainer.appendChild(chooseWatchButton);

        const watchers = document.createElement("div");
        watchers.innerText = "Watched by:";
        const ul = document.createElement("ul");
        res.usersWhoWatchMeUserIds.forEach((id) => {
            userToBackend(id).then((user) => {
                const li = document.createElement("li");
                const em = document.createElement("em");
                const strong = document.createElement("strong");
                strong.innerText = user.name;
                strong.classList.add("creator-link");

                strong.addEventListener("click", () => {
                    removeOldProfileElements();
                    history.pushState("", document.title, location.pathname + location.search + `#profile=${id}`);
                    jumpToProfile(id);
                })
                em.appendChild(strong);
                li.appendChild(em); 
                ul.appendChild(li); 
                watchers.appendChild(ul);
                watchers.appendChild(document.createElement("br"));
            });
        });
        
        profileContainer.appendChild(watchers);
        // only user's own profile can have right to delete/update job
        res.jobs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach((each_job)=>{
            jobContainer.appendChild(jobInfo(each_job));
            })
    })
}

// Handle user watch/unwatch actions and re-render
const handleWatch=(email, turnon)=>{
    chooseWatchToBackend(email, turnon)
    .then(()=>{
        removeOldProfileElements();
        rerenderCurrentView();
    })
}

// Create watch/unwatch button based on current user watch status
const generateChooseWatcButton = (info) => {
    const currentUserId = parseInt(localStorage.getItem(AUTH.USER_KEY));
    const isWatching = info.usersWhoWatchMeUserIds.includes(currentUserId);
    const turnon = !isWatching;
    const buttonText = isWatching ? "Unwatch" : "Watch";
    const btn = createButton(buttonText, () => handleWatch(info.email, turnon));
    btn.classList.add('inside-job-btn')
    return btn
    };


// Render profile of another user (not self), including watch button and job info
export const renderOtherProfile=(otherId)=>{
    removeOldProfileElements();
    document.querySelectorAll(".profile-btn").forEach(btn => btn.remove());
    const profileContainer = document.createElement("div");
    profileContainer.id = "profile-container";
    const main = document.querySelector('main[role="main"]');
    main.appendChild(profileContainer);
    const jobContainer = document.createElement("div");
    jobContainer.id = "job-container";
    main.append(profileContainer);
    main.appendChild(jobContainer);
    userToBackend(otherId)
    .then((res) => {
        // stucture is slightly different than own profile
        const imageContainer = document.createElement("div");
        const img = new Image();
        img.src = res.image;
        img.alt = "This user hasn't upload job images!";
        img.width = 100;
        img.height = 100;
        imageContainer.appendChild(img);
        profileContainer.appendChild(imageContainer);
        const title = document.createElement("h1");
        title.innerText = `Welcome to ${res.name}'s profile!`
        profileContainer.appendChild(title);

        const name = document.createElement("h3");
        name.innerText = res.name;
        profileContainer.appendChild(name);

        const email = document.createElement("h3");
        email.innerText = res.email;
        profileContainer.appendChild(email);

        const chooseWatchButton = generateChooseWatcButton(res);
        profileContainer.appendChild(chooseWatchButton);

        const countText = document.createElement("p");
        countText.innerText = `${res.usersWhoWatchMeUserIds.length} watchers`;
        profileContainer.appendChild(countText);
        const ul = document.createElement("ul");
        const watchers = document.createElement("div");
        watchers.innerText = "Watched by:";
        res.usersWhoWatchMeUserIds.forEach((id) => {
            userToBackend(id).then((user) => {
                const li = document.createElement("li");
                const em = document.createElement("em");
                const strong = document.createElement("strong");
                strong.innerText = user.name;
                strong.classList.add("creator-link");

                strong.addEventListener("click", () => {
                        jumpToProfile(id);
                    });
                em.appendChild(strong);
                li.appendChild(em);
                ul.appendChild(li);
                watchers.appendChild(ul);
                watchers.appendChild(document.createElement("br")); 
            });
        });

        profileContainer.appendChild(watchers);

        res.jobs.forEach((each_job) => {
            jobContainer.appendChild(jobInfo(each_job));
        });
    });
};