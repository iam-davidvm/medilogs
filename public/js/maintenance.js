function showMsg(message) {
  const maintenanceBar = document.querySelector('.maintenance-bar');
  const maintenanceMsg = document.querySelector('#maintenance-msg');
  maintenanceBar.style.display = 'block';
  maintenanceMsg.innerHTML = message;
}

(function () {
  fetch('/json/data.json')
    .then((response) => response.json())
    .then((data) => {
      if (data.messages[0]) {
        showMsg(data.messages[0]);
      }
    })
    .catch((e) => {
      const maintenanceBar = document.querySelector('.maintenance-bar');
      maintenanceBar.style.display = 'none';
    });
})();
