function showMsg(data) {
  const maintenanceBlock = document.querySelector('.maintenance-block');
  const maintenanceMsg = document.querySelector('#maintenance-msg');
  maintenanceBlock.style.display = 'block';
  maintenanceMsg.innerHTML = data.message;
  console.log('show');
}

(function () {
  fetch('/data.json')
    .then((response) => response.json())
    .then((data) => showMsg(data))
    .catch((e) => {
      const maintenanceBlock = document.querySelector('.maintenance-block');
      maintenanceBlock.style.display = 'none';
      console.log('hide');
      console.log(e);
    });
})();
