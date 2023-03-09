let useremail;

if (document.querySelector('#username')) {
  useremail = document.querySelector('#username');
} else {
  useremail = document.querySelector('#email');
}

if (useremail !== null) {
  useremail.addEventListener('input', function () {
    this.value = this.value.toLowerCase();
  });
}

const togglePasswords = document.querySelectorAll('#toggle-password');
const passwords = document.querySelectorAll('#password');
togglePasswords.forEach((togglePassword, index) => {
  togglePassword.addEventListener('click', function () {
    const type =
      passwords[index].getAttribute('type') === 'password'
        ? 'text'
        : 'password';
    passwords[index].setAttribute('type', type);
    const eye =
      passwords[index].getAttribute('type') === 'password'
        ? '/assets/icons/eye.svg'
        : '/assets/icons/eye-off.svg';
    togglePassword.src = eye;
  });
});
