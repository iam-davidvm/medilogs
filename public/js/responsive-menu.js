const menuBtn = document.querySelector('.menu-btn');
function getMenuState() {
  const menuBtn = document.querySelector('.menu-btn');
  const menuState = menuBtn.getAttribute('aria-expanded');
  return menuState;
}

function setIcon(
  width,
  isMenuExpanded,
  initialLoad = false,
  changeIcon = false
) {
  const menuBtnIcon = document.querySelector('.menu-btn-icon');
  // if the page first load and is a large screen
  if (initialLoad) {
    if (width >= 1040) {
      menuBtnIcon.src = '/assets/icons/menu-close.svg';
      return 'open';
    } else {
      return 'close';
    }
  }

  if (changeIcon) {
    if (isMenuExpanded === 'true') {
      menuBtnIcon.src = '/assets/icons/menu-open.svg';
      return 'close';
    } else {
      menuBtnIcon.src = '/assets/icons/menu-close.svg';
      return 'open';
    }
  } else {
    if (isMenuExpanded === 'true') {
      menuBtnIcon.src = '/assets/icons/menu-close.svg';
      return 'open';
    } else {
      menuBtnIcon.src = '/assets/icons/menu-open.svg';
      return 'close';
    }
  }
}

function changeMenuState(iconState) {
  const menuBtn = document.querySelector('.menu-btn');
  const menuState = menuBtn.getAttribute('aria-expanded');
  menuBtn.setAttribute(
    'aria-expanded',
    `${iconState === 'open' ? true : false}`
  );
}

function changeStyle(width, iconState) {
  const menu = document.querySelector('.menu');
  if (iconState === 'open') {
    if (width < 750) {
      menu.classList.add('expand-mobile-menu');
      menu.classList.remove('expand-tablet-menu');
      menu.classList.remove('fold-desktop-menu');
    } else if (width < 1040) {
      menu.classList.remove('expand-mobile-menu');
      menu.classList.add('expand-tablet-menu');
      menu.classList.remove('fold-desktop-menu');
    } else {
      menu.classList.remove('expand-mobile-menu');
      menu.classList.remove('expand-tablet-menu');
      menu.classList.remove('fold-desktop-menu');
    }
  } else {
    if (width < 750) {
      menu.classList.remove('expand-mobile-menu');
      menu.classList.remove('expand-tablet-menu');
      menu.classList.remove('fold-desktop-menu');
    } else if (width < 1040) {
      menu.classList.remove('expand-mobile-menu');
      menu.classList.remove('expand-tablet-menu');
      menu.classList.remove('fold-desktop-menu');
    } else {
      menu.classList.remove('expand-mobile-menu');
      menu.classList.remove('expand-tablet-menu');
      menu.classList.add('fold-desktop-menu');
    }
  }
}

function setWidth(width, iconState) {
  if (width >= 750) {
    if (iconState === 'open') {
      document.documentElement.style.setProperty('--width', '30rem');
    } else {
      document.documentElement.style.setProperty('--width', '7rem');
    }
  } else {
    if (iconState === 'open') {
      document.documentElement.style.setProperty('--width', '100vw');
    } else {
      document.documentElement.style.setProperty('--width', '0rem');
    }
  }
}

function renderPage() {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const isMenuExpanded = getMenuState();
  const iconState = setIcon(width, isMenuExpanded, true);
  changeMenuState(iconState);
  setWidth(width, iconState);
}

function changePage(changeIcon = false) {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  console.log('Width: ', width);
  console.log('window.screen.width: ', window.screen.width);
  const isMenuExpanded = getMenuState();
  const iconState = setIcon(width, isMenuExpanded, false, changeIcon);
  changeMenuState(iconState);
  changeStyle(width, iconState);
  setWidth(width, iconState);
}

// initial page view
renderPage();

// pageview when resizing screen
addEventListener('resize', () => {
  changePage();
});

// pageview after clicking hamburger
menuBtn.addEventListener('click', () => {
  changePage(true);
});
