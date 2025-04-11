import { AUTH } from './constants.js';
import { BACKEND_PORT } from './config.js';

// Handle API error responses
export const handleError = (res) => {
  const { error } = res;
  if (error) {
    throw new Error(error);
  }
  return res;
};

// Register a new user 
export const registerToBackend = (email, password, name) => {
  return fetch(`http://localhost:${BACKEND_PORT}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  })
  .then((res) => res.json())
  .then(handleError);
};

// Login with user 
export const loginToBackend = (email, password) => {
  return fetch(`http://localhost:${BACKEND_PORT}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then((res) => res.json())
  .then(handleError);
};

// Get job feed
export const feedToBackend = (startIndex) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  return fetch(`http://localhost:${BACKEND_PORT}/job/feed?start=${startIndex}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`
    }
  })
  .then((res) => res.json())
  .then(handleError);
};

// Get basic details of a specific user
export const userToBackend = (userId) => {
    const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch(`http://localhost:${BACKEND_PORT}/user?userId=${userId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
    })
    .then((res) => res.json())
    .then(handleError);
};

// Like/Unlike on a job post from user they are watching
export const jobLikeToBackend = (id, turnon) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  return fetch(`http://localhost:${BACKEND_PORT}/job/like`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ id, turnon })
  })
  .then((res) => res.json())
  .then(handleError);
};

// Delete job given job ID
export const jobDeleteToBackend = (id) => {
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  return fetch(`http://localhost:${BACKEND_PORT}/job`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ id })
  })
  .then((res) => res.json())
  .then(handleError);
};

// Update info on a existing job
export const updateJobToBackend = (id,title,jobImage,jobStart,description) => {
    const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch(`http://localhost:${BACKEND_PORT}/job`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ id, title, image: jobImage, start: jobStart, description })
    })
    .then(res => res.json())
    .then(handleError);
};

// Update user's profile, remain unchanged detales
export const updateProfileToBackend = (email,password,name,image) =>{
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  return fetch(`http://localhost:${BACKEND_PORT}/user`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ email, password, name, image }),
  })
  .then(res => res.json())
  .then(handleError);
};

// Create a new job posting with the given details
export const addJobsToBackend = (title, image, start, description) =>{
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  return fetch(`http://localhost:${BACKEND_PORT}/job`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({title, image, start, description}),
  })
  .then(res => res.json())
  .then(handleError);
};

// Specify whether this user should be watching or unwatching another user
export const chooseWatchToBackend = (email,turnon) =>{
  const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
  return fetch(`http://localhost:${BACKEND_PORT}/user/watch`, {
      method: 'PUT',
      headers: { 
          'Content-Type': 'application/json' ,
          Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ email, turnon })
  })
  .then((res) => res.json())
  .then(handleError);
};

// Allow the current user to leave a text comment on a job post from a user they are watching.
export const commentJobsToBackend = (id,comment) =>{
    const userToken = localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch(`http://localhost:${BACKEND_PORT}/job/comment`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' ,
            Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({id, comment })
    })
    .then((res) => res.json())
    .then(handleError);
};

