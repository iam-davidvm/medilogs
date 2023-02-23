let useremail;

if (document.querySelector('#username')) {
  useremail = document.querySelector('#username');
} else {
  useremail = document.querySelector('#email');
}

useremail.addEventListener('input', function () {
  this.value = this.value.toLowerCase();
});

const togglePassword = document.querySelector('#toggle-password');
const password = document.querySelector('#password');
togglePassword.addEventListener('click', function () {
  const type =
    password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  const eye =
    password.getAttribute('type') === 'password'
      ? '/assets/icons/eye.svg'
      : '/assets/icons/eye-off.svg';
  togglePassword.src = eye;
});
