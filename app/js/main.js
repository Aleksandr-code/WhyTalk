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

