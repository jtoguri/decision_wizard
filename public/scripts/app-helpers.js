// Helper functions for the app.js file

// Confirms if a user_id cookie exists
const confirmCookie = function ()  {
  const cookieExists =  document.cookie.split('=')[1];
  return cookieExists ? true : null;
}
