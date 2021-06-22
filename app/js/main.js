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
  
  let dateTime = document.querySelectorAll('.datetime-js');
  if(dateTime){
    dateTime.forEach(element => {
        let date = new Date(element.textContent);
        console.log(date);
        var options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        element.textContent = Intl.DateTimeFormat('ru-RU', options).format(date);
    });
      
  }
  