import { userToBackend, jobLikeToBackend, feedToBackend, chooseWatchToBackend, commentJobsToBackend } from "./data-provider.js";
import { isWithin24Hours, getTimeSincePost, getPostTimeDisplay, createButton, createForm } from './modal.js';
import { AUTH } from './constants.js';
import { renderOwnProfile, renderOtherProfile, handleJobDelete, triggerUpdateJob, removeOldProfileElements, triggerAddJob } from './profile.js';

const main = document.querySelector('main[role="main"]');
// Clear the modal, so that it can be reused next time
export const clearModalBody = () => {
    const modalBody = document.getElementById('update-body');
    while (modalBody.firstChild) modalBody.removeChild(modalBody.firstChild);
};

// To jump to a user's personal profile (own or others')
export const jumpToProfile = (userId) => {
    //Remove existing profile related elements from the page (avoid duplicate rendering)
    removeOldProfileElements();
    const currentUserId = parseInt(localStorage.getItem(AUTH.USER_KEY));
    const newHash = `#profile=${userId}`;
    if (location.hash !== newHash) {
        history.pushState("", document.title, location.pathname + location.search + newHash);
    }
    if (userId === currentUserId) {
      renderOwnProfile(userId);
    } else {
      renderOtherProfile(userId);
    }
};

// Used for listing the username, that can be jump to their profile
export const createUserLink = (userId, name) => {
    const object = document.createElement("strong");
    object.innerText = name;
    object.classList.add("creator-link");
    object.addEventListener("click", () => {
        jumpToProfile(userId);
    });
    return object;
};

export const rerenderCurrentView = () => {
    const hash = location.hash;
    const uid = localStorage.getItem(AUTH.USER_KEY);
    if (hash === "#feed") {
      renderFeed();
    } else if (hash.startsWith("#profile=")) {
      const id = hash.split("=")[1];
      if (id === uid) {
        renderOwnProfile(id);
      } else {
        renderOtherProfile(id);
      }
    }
  };

// Handles the logic of a modal pop-up after clicking the "Watch a user by email" button
const triggerSearchMail = () => {
    const modal = document.getElementById('update-profile');
    const modalBody = document.getElementById('update-body');

    clearModalBody();

    const modalTitle = document.getElementById('ModalLabel');
    modalTitle.innerText = 'Watch a user by email';

    createForm('label', 'Email', 'email', modalBody, 'email-input');
    // Add click event listener to 'search': After clicking, the input email is sent to the back-end, set to watch that particular user.
    const updateChangesBtn = document.getElementById("update-changes-btn");
    updateChangesBtn.innerText = "Search";
    updateChangesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        chooseWatchToBackend(email, true)
            .then(() => {
                alert(`You are now watching ${email}`);
                bootstrap.Modal.getInstance(document.getElementById('update-profile')).hide();
                removeOldProfileElements();
                rerenderCurrentView();
            });
    });
    // Show this modal pop-up
    const displayUpdateModal = new bootstrap.Modal(modal);
    displayUpdateModal.show();
};

// Creates and returns a button used for searching user's email that wants to watch
const generateSearchButton = () => {
    const buttonText = '🔍 Watch a user by entering their email';
    // Create button to handle click event triggerSearchMail
    const searchBtn = createButton(buttonText, triggerSearchMail);
    searchBtn.classList.add('profile-btn', 'search-btn'); 
    searchBtn.setAttribute('aria-label', 'Search and watch a user by their email');
    return searchBtn;
}

// Creates and returns a button used for entering profile of login  user: 'My profile'
const generateProfileButton = () => {
    const buttonText = 'My Profile';
    const myProfileBtn =  createButton(buttonText, handleMyProfile);
    myProfileBtn.classList.add('profile-btn');
    myProfileBtn.setAttribute('aria-label', 'Go to profile');
    return myProfileBtn;
}

// When the user submits a comment, send it to the backend and reload the page to reflect changes
const readyToAddComment = (Id, comment) => {
    commentJobsToBackend(Id, comment)
        .then(() => {
            removeOldProfileElements();
            rerenderCurrentView();
            bootstrap.Modal.getInstance(document.getElementById('update-profile')).hide();
        });
};

// Trigger modal to let user write a comment for a job
const triggerAddComment = (Id) =>{
    const modalBody = document.getElementById('update-body');
  
    clearModalBody();

    const modalTitle = document.getElementById('ModalLabel');
    modalTitle.innerText = 'Want to comment on this job?';

    createForm('label', 'Add your comments', 'text', modalBody, 'add-comment');

    const updateChangesBtn = document.getElementById("update-changes-btn");
    const newBtn = updateChangesBtn.cloneNode(true);
    updateChangesBtn.parentNode.replaceChild(newBtn, updateChangesBtn); 
    newBtn.setAttribute('aria-label', 'Comment this job'); 

    newBtn.innerText = 'comment';
    newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const addedComment = document.getElementById('add-comment').value;
        readyToAddComment(Id, addedComment);
    });
    const displayUpdateModal = new bootstrap.Modal(document.getElementById('update-profile'));
    displayUpdateModal.show();
}

// Handles like/unlike request and reloads to reflect the change
const handleLike = (post, turnon) => {
    removeOldProfileElements();
    jobLikeToBackend(post.id, turnon)
    .then(()=>{
        rerenderCurrentView();
    })
}

// Create a "Like" or "Not liked" button depending on current user's like status
const generateLikeBotton = (post) => {
    const currentUserId = parseInt(localStorage.getItem(AUTH.USER_KEY));
    const hasLiked = post.likes.some((like) => like.userId === currentUserId);

    const turnon = !hasLiked;
    const buttonText = hasLiked ? "Not liked" : "Like";
    const btn = createButton(buttonText, () => handleLike(post,turnon));
    btn.classList.add('inside-job-btn');
    btn.setAttribute('aria-label', turnon ? 'Like this job' : 'Unlike this job');
    return btn
}

// Handle when user clicks "My Profile" button
export const handleMyProfile=()=>{
        const myId = localStorage.getItem(AUTH.USER_KEY);
        history.pushState("", document.title, location.pathname + location.search + `#profile=${myId}`);
        const postContainer = document.getElementById("postContainer");
        if (postContainer) {
            postContainer.remove()
        }
        renderOwnProfile(myId);
    }


export const renderFeed=()=>{
    let start = 0;
    let loading = false;
    const postContainer = document.createElement('div');
    postContainer.id = "postContainer";
    const profileButton = generateProfileButton();
    const searchButton = generateSearchButton();
    const addJobBtn = createButton("Add Job", triggerAddJob);
    addJobBtn.classList.add('addJob-btn','profile-btn');
    addJobBtn.setAttribute('aria-label', 'Add a new job');
    
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');
    buttonGroup.appendChild(profileButton);
    buttonGroup.appendChild(searchButton);
    buttonGroup.appendChild(addJobBtn);
    
    main.appendChild(buttonGroup);
    main.appendChild(postContainer);
    
    // get the job info by 'feedToBackend', then rendering each job by using 'jobInfo'
    feedToBackend(start)
    .then((res)=>{
        for (const p of res) {
            postContainer.appendChild(jobInfo(p));
        }
        start += 5;
    });
    // add scroll event listener, this is infinite scroll one
    window.onscroll = () => {
        const scrollBottom = document.body.scrollHeight - window.innerHeight - window.scrollY;
        if (scrollBottom < 1 && !loading) {
          loading = true;
          feedToBackend(start).then((res) => {
            if (res.length === 0) {
              window.onscroll = null;
              return;
            }
            for (const p of res) {
              postContainer.appendChild(jobInfo(p));
            }
            start += 5;
            loading = false;
          });
        }
      };
};

// render each job details, will be used for several times, highly reuseable
export const jobInfo = ((post) => {
    const currentUserId = parseInt(localStorage.getItem(AUTH.USER_KEY)); 
    const jobResult = document.createElement("div");
    jobResult.id = "job-result";
    jobResult.classList.add("card", "mb-3", "p-3", "shadow-sm");
    const infoContainer = document.createElement("div");
    infoContainer.classList.add('info-container');
    infoContainer.classList.add("card-body")
    const imageContainer = document.createElement("div");
    imageContainer.classList.add('image-container');
    // If the job is posted by current user, allow editing/deleting , they are only visible to the job creator
    if (post.creatorId === currentUserId) {
        const editButton = createButton("Update this job", () => triggerUpdateJob(post.id));
        editButton.classList.add("inside-job-btn");
        const deleteButton = createButton("Delete this job", () => handleJobDelete(post.id));
        deleteButton.classList.add("inside-job-btn");

        deleteButton.setAttribute('aria-label', 'Delete this job');
        editButton.setAttribute('aria-label', 'Update this job');
        infoContainer.appendChild(editButton);
        infoContainer.appendChild(deleteButton);
    }
    // Job image information
    const img = new Image();
    img.src = post.image;
    img.alt = "Job image failed to load";
    img.width = 200;
    img.height = 150;
    imageContainer.appendChild(img);

    const jobTitle = document.createElement("h3");
    jobTitle.innerText = post.title;
    infoContainer.appendChild(jobTitle);
    const isOnProfile = location.hash.startsWith("#profile=");

     //Fetch user info (job creator) and show relevant text
    userToBackend(post.creatorId).then((res) => {
        const jobCreator = document.createElement("h3");
        // In the profile page, the username should NOT be clickable.Otherwise, profile will go to profile. 
        // Avoiding the redundant behavior of clicking to jump profiles
        if (post.creatorId === currentUserId && isOnProfile) {
            jobCreator.innerText = "I already posted this job.";
        } else if ( post.creatorId !== currentUserId && isOnProfile){
            jobCreator.innerText = "l have posted this job. Are you interested?";
        // In the feed page, let a user click on a user's name from a job, the pages go to profile screen for that user.
        }else {
            const prefixText = document.createTextNode("The job post was made by ");
            const italic = document.createElement("em");
            const boldUser = document.createElement("strong");
            boldUser.innerText = res.name;
            boldUser.classList.add("creator-link");
            
            boldUser.addEventListener("click", () => {
                history.pushState("", document.title, location.pathname + location.search + `#profile=${post.creatorId}`);
                removeOldProfileElements();
                jumpToProfile(post.creatorId);
            });

            italic.appendChild(boldUser);
            jobCreator.appendChild(prefixText);
            jobCreator.appendChild(italic);
        }

        infoContainer.appendChild(jobCreator);
        // Job specifc information listed as required
        const createdTime = document.createElement("p");
        if (isWithin24Hours(post.createdAt)) {
            createdTime.innerText = getTimeSincePost(post.createdAt);
        } else {
            createdTime.innerText = getPostTimeDisplay(post.createdAt, "Post on:");
        }
        infoContainer.appendChild(createdTime);

        const startPara = document.createElement("p");
        startPara.innerText = getPostTimeDisplay(post.start, "Start on:");
        infoContainer.appendChild(startPara);

        const likesPara = document.createElement("p");
        likesPara.innerText = `Like count: ${post.likes.length || 0}`;
        infoContainer.appendChild(likesPara);

        const showLikesBtn = document.createElement("button");
        showLikesBtn.innerText = "Show Likes";
        showLikesBtn.classList.add('inside-job-btn');
        showLikesBtn.setAttribute('aria-label', 'Toggle like list');
        infoContainer.appendChild(showLikesBtn);

        const likeList = document.createElement("div");
        likeList.classList.add("hidden");
        infoContainer.appendChild(likeList);
        // Add event listener to each user under like
        if (post.likes.length > 0) {
            post.likes.forEach((like) => {
                likeList.appendChild(createUserLink(like.userId, like.userName));
        
            });
        } else {
            likeList.innerText = "None";
        }

        let showLikes = false;
        showLikesBtn.addEventListener("click", () => {
            showLikes = !showLikes;
            likeList.classList.toggle("hidden");
            showLikesBtn.innerText = showLikes ? "Hide Likes" : "Show Likes";
        });

        const descPara = document.createElement("p");
        descPara.innerText = post.description || "No description";
        infoContainer.appendChild(descPara);

        const commentsPara = document.createElement("p");
        commentsPara.innerText = `Comments: ${post.comments.length || 0}`;
        infoContainer.appendChild(commentsPara);

        const showCommentsBtn = document.createElement("button");
        showCommentsBtn.innerText = "Show comments";
        showCommentsBtn.classList.add('inside-job-btn')
        showCommentsBtn.setAttribute('aria-label', 'Toggle comment list');
        infoContainer.appendChild(showCommentsBtn);

        const commentList = document.createElement("div");
        commentList.classList.add("hidden");
        infoContainer.appendChild(commentList);

        if (post.comments.length > 0) {
            post.comments.forEach((each) => {
                const line = document.createElement("div");

                line.appendChild(createUserLink(each.userId, each.userName));

                const text = document.createTextNode(`: ${each.comment}`);
                line.appendChild(text);
                commentList.appendChild(line);
            });
        } else {
            commentList.innerText = "None";
        }


        let showComment = false;
        showCommentsBtn.addEventListener("click", () => {
            showComment = !showComment;
            commentList.classList.toggle("hidden");
            showCommentsBtn.innerText = showComment ? "Hide comments" : "Show comments";
        });
        // If the current user is viewing a profile they are watching, show like and comment interactions
        // Otherwise, backend API for like and comment interactions will show error.
        const isWatching = res.usersWhoWatchMeUserIds.includes(currentUserId);
        if (isWatching){
            const likeButton = generateLikeBotton(post);
            infoContainer.appendChild(likeButton);

             const addCommentButton = createButton("Add comment", () => triggerAddComment(post.id));
             addCommentButton.classList.add('inside-job-btn');
             addCommentButton.setAttribute('aria-label', 'Add comment');
             infoContainer.appendChild(addCommentButton);
        }

        jobResult.appendChild(infoContainer);
        jobResult.appendChild(imageContainer);
    });

    return jobResult;
});
