let useremail;

if (document.querySelector('#username')) {
  useremail = document.querySelector('#username');
} else {
  useremail = document.querySelector('#email');
}

useremail.addEventListener('input', function () {
  this.value = this.value.toLowerCase();
});
