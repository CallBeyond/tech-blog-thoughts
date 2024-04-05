let inactivityTime = function () {
  let time;
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  function logout() {
    console.log("You are now logged out.");
    location.href = "/api/users/logout";
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 60000);
  }
};

inactivityTime();
