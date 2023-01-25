if (!localStorage.getItem('cookie-consent')) {
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  (scrollLeft = window.pageXOffset || document.documentElement.scrollLeft),
    (window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    });

  const cookiesModal = document.querySelector('#cookies-modal');
  cookiesModal.classList.remove('invisible');
  const cookiesAccept = document.querySelector('.cookies-accept');
  cookiesAccept.addEventListener('click', () => {
    window.onscroll = null;
    localStorage.setItem('cookie-consent', true);
    cookiesModal.classList.add('invisible');
  });
}
