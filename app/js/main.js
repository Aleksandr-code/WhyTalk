// Меню (мобильная версия)
document.querySelector('.header__burger-menu').addEventListener('click', function() {
  let header__box = document.querySelector('.header__box');
  if (!header__box.classList.contains('header__box-active')){
    header__box.classList.add('header__box-active')
    //Анимация
    let start = Date.now();
    let timer = setInterval(function() {
      let timePassed = Date.now() - start;
      document.querySelector('.header__box-active').style.top = timePassed / 5 + 'px';
      if (timePassed >= 440) clearInterval(timer);
    }, 20);
    // смена значка
    this.lastElementChild.remove();
    this.firstElementChild.style = 'transform: rotate(45deg)';
    this.lastElementChild.style = 'margin-top: -2px; transform: rotate(-45deg)';
  } else {
    header__box.classList.remove('header__box-active');
    // смена значка
    this.firstElementChild.style = 'transform: rotate(0)';
    this.lastElementChild.style = 'margin-top: 5px; transform: rotate(0deg)';
    this.append(document.createElement('div'))
  }

})


// Настройка табов
let jsLinks = document.querySelectorAll('.js-communicate-items-link')
let jsPanes = document.querySelectorAll('.js-communicate-items-pane')

jsLinks.forEach(function(link){
  link.addEventListener('click', function(){
    if(this.classList.contains('active')){
      return
    }
    let id = this.getAttribute('data-tab'),
        pane = document.querySelector('.js-communicate-items-pane[data-tab="'+id+'"]')
        activeLink = document.querySelector('.js-communicate-items-link.active')
        activePane = document.querySelector('.js-communicate-items-pane.active')
    
    activeLink.classList.remove('active')
    link.classList.add('active')

    activePane.classList.remove('active');
    pane.classList.add('active');

  })
})



