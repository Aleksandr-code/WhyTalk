var $tabs = function (target) {
    var
      _elemTabs = (typeof target === 'string' ? document.querySelector(target) : target),
      _eventTabsShow,
      _showTab = function (tabsLinkTarget) {
        var tabsPaneTarget, tabsLinkActive, tabsPaneShow;
        // console.log(tabsLinkTarget)
        tabsPaneTarget = document.querySelector(tabsLinkTarget.getAttribute('href'));
        tabsLinkActive = tabsLinkTarget.parentElement.querySelector('.communicate-items-active');
        tabsPaneShow = tabsPaneTarget.parentElement.querySelector('.communicate-items-pane-show');
        // если следующая вкладка равна активной, то завершаем работу
        if (tabsLinkTarget === tabsLinkActive) {
          return;
        }
        // удаляем классы у текущих активных элементов
        if (tabsLinkActive !== null) {
          tabsLinkActive.classList.remove('communicate-items-active');
        }
        if (tabsPaneShow !== null) {
          tabsPaneShow.classList.remove('communicate-items-pane-show');
        }
        // добавляем классы к элементам (в завимости от выбранной вкладки)
        tabsLinkTarget.classList.add('communicate-items-active');
        tabsPaneTarget.classList.add('communicate-items-pane-show');
        document.dispatchEvent(_eventTabsShow);
      },
      _switchTabTo = function (tabsLinkIndex) {
        var tabsLinks = _elemTabs.querySelectorAll('.communicate-items-link');
        if (tabsLinks.length > 0) {
          if (tabsLinkIndex > tabsLinks.length) {
            tabsLinkIndex = tabsLinks.length;
          } else if (tabsLinkIndex < 1) {
            tabsLinkIndex = 1;
          }
          _showTab(tabsLinks[tabsLinkIndex - 1]);
        }
      };

    _eventTabsShow = new CustomEvent('tab.show', { detail: _elemTabs });

    _elemTabs.addEventListener('click', function (e) {
      var tabsLinkTarget = e.target;
      // завершаем выполнение функции, если кликнули не по ссылке
      if (!tabsLinkTarget.classList.contains('communicate-items-link')) {
        return;
      }
      // отменяем стандартное действие
      e.preventDefault();
      _showTab(tabsLinkTarget);
    });

    return {
      showTab: function (target) {
        _showTab(target);
      },
      switchTabTo: function (index) {
        _switchTabTo(index);
      }
    }

  };

  $tabs('.communicate-items');