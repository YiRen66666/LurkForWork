
/*This is the customoized popup alert with 'X' button */
export const createErrorPopup = (message) =>{
    if (document.getElementById("error-popup")) return;
    
    const popup = document.createElement("div");
    popup.id = "error-popup";
    popup.style.zIndex = "1100";
    popup.className = "position-fixed top-0 start-50 translate-middle-x m-3 p-3 bg-danger text-white rounded d-flex align-items-center shadow";
    
    const text = document.createElement("span");
    text.innerText = message;
    popup.appendChild(text);
    
    const closeButton = document.createElement("button");
    closeButton.className = "btn-close ms-3";
    closeButton.setAttribute("aria-label", "Close");
    closeButton.onclick = () => {
        document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
    }

/*check whether is posted within 24 hours */
export const isWithin24Hours = (isoTimeString) => {
    const postTime = new Date(isoTimeString);
    const now = new Date();
    const diffInMs = now - postTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours < 24;
};

/*calculate how many hours and minutes ago it was posted if posted within 24 hrs*/
export const getTimeSincePost = (isoTimeString) => {
    const postTime = new Date(isoTimeString);
    const now = new Date();
    const diffInMs = now - postTime;
  
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
    return `It was posted just ${hours} hour(s) ${minutes} minute(s) ago`;
  };

/*post time which is over24 hrs*/
export const getPostTimeDisplay = (time,message) => {
    const date = new Date(time);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${message} ${day}/${month}/${year}`;
};

// Create a generic button with an event handler
export const createButton = (text, handler, event = 'click') => {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode(text));
  button.addEventListener(event, handler);
  return button;
};

// Show a specific page by hiding others
export const showPage = (pageName) => {
  const pages = document.querySelectorAll('.page');
  for (const page of pages) {
      page.classList.add('hidden');
  }
  document.getElementById(pageName).classList.remove('hidden');
};

// Dynamically create and append a labeled input field to a form
export const createForm = (element, text, type, appendBody, id) => {
  const elementLabel = document.createElement(element);
  elementLabel.innerText = text;
  elementLabel.setAttribute("for", id);

  const nameInput = document.createElement('input');
  nameInput.type = type;
  nameInput.id = id;
  nameInput.classList.add('form-control', 'mb-2');

  appendBody.appendChild(elementLabel);
  appendBody.appendChild(nameInput);
};