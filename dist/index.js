/* eslint-disable */
(function() {

  //variable declerations
  const dealerNumber = document.getElementById('dealer-number');
  const button = document.getElementsByClassName('button-container')[0];
  const filterContainer = document.getElementsByClassName('pop-up-filter')[0];
  const filters = document.querySelector('.pop-up-filter');
  const cardParent = document.getElementById('dealer-cards');
  const emailModal = document.getElementsByClassName('email-modal')[0];
  const closeModalButton = document.getElementById('email-close');
  const closeMenuButton = document.getElementById('menu-close');
  const myForm = document.getElementById('my-form');
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  const menuContainer = document.querySelector('.mobile-nav');
  const panel = document.querySelector('.nav-items');
  const overlay = document.getElementById('overlay');
  const send = document.getElementById('send')
  //cross-site-scripting prevention since I'm using some innerHTML
  function xss(text) {
    try {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/\'/g, '&#39;');
      //.replace(/\//g, '&frasl;')
    } catch (e) {
      return 'xss failure';
    }
  }
  //initial appState

  let appState = {
    dealers: [],
    filters: [
      'Installation Pro',
      'Commercial Pro',
      'Residential Pro',
      'Service Pro'
    ],
    currentDealer: ''
  };

  //object that contains any state editing functions
  const stateEditingObject = {
    state: appState,
    //fetch dealers from json file
    getDealers: function(url) {
      fetch(url)
        .then(data => data.json())
        .then(data => {
          this.state.dealers = [...this.state.dealers, ...data.dealers];
          return (dealerNumber.innerHTML = `${this.state.dealers
            .length} dealers`);
        })
        .then(() => {
          renderObject.renderDealers(this.state);
        });
    },
    //filters dealers based on input values
    filterDealers: function(e) {
      if (!e.target.matches('input')) return;
      let newFilters = appState.filters.filter(word => {
        return word !== e.target.value;
      });
      if (appState.filters.includes(e.target.value)) {
        appState.filters = [...newFilters];
        renderObject.renderDealers(appState);
        dealerNumber.innerHTML = `${document.querySelectorAll('.card')
          .length} dealers`;
        return;
      } else {
        appState.filters = [...appState.filters, e.target.value];
        renderObject.renderDealers(appState);
        dealerNumber.innerHTML = `${document.querySelectorAll('.card')
          .length} dealers`;
        return;
      }
    },
    //stores current dealer so we can pass to additional dom elements
    currentDealer: function(e) {
      appState.currentDealer =
        appState.dealers[parseInt(e.target.getAttribute('key'))];
      console.log(appState);
    },
    //non functioning, just illustrating understanding of sending email to backend
    composeEmail: function(data) {
      opts = {
        type: 'POST'
      };
      fetch('api/email', opts).then(data => {
        alert('Email Sent');
      });
    }
  };

  //object that contains all the functions related to rendering or updating the dom
  const renderObject = {
    state: appState,
    //initial render function that's called after we get dealer data
    renderDealers: function(state) {
      const cardsParent = document.getElementById('dealer-cards');
      let newDealers = document.createElement('div');
      let certificationContent;
      let businessHours;
      let certificationIcon;

      newDealers.id = 'card-container';
      cardsParent.innerHTML = '';
      
      state.dealers.map((dealer, index) => {
        const { certifications, weekHours, name, phone1, email } = dealer.data;
        console.log(index)
        
        //prevents us from rendering dealers that are in the filter
        if (!certifications.includes(...state.filters)) {
          return;
        }
        certificationContent = '';
        certifications.forEach(certification => {
          switch (certification) {
            case 'Service Pro':
              certificationIcon = 'fa-cog';
              break;
            case 'Installation Pro':
              certificationIcon = 'fa-star';
              break;
            case 'Residential Pro':
              certificationIcon = 'fa-home';
              break;
            case 'Commercial Pro':
              certificationIcon = 'fa-users';
              break;
          }
          certificationContent += `<div class="pro-container"><p><i class="fa ${certificationIcon}"></i>${certification}</p></div>`;
        });
        businessHours = '';
            let i = 0;
        Object.keys(weekHours).forEach(key => {
          let keyText;
          let hoursText;
          weekHours[key] == ''
            ? (hoursText = 'Closed')
            : (hoursText = weekHours[key]);
          switch (key) {
            case 'mon':
              keyText = 'Weekdays';
              break;
            case 'sat':
              keyText = 'Saturdays';
              break;
            case 'sun':
              keyText = 'Sundays';
              break;
            default:
              return (keyText = 'Error');
          }

          businessHours += `<p>${keyText}: ${hoursText}</p>`;
        });

        newDealers.innerHTML += `
      <div class="card" >
      <h6 class="title">${xss(name)}</h6>
      <a href="tel:${xss(phone1)}" class="call">
          <i class="phone-icon fa fa-phone"></i> <span id="tap">Tap to call</span> <span id="phone-tap">${xss(
            phone1
          )}</span>
      </a>
      <i class="email" >Can't talk now? Click below to send an email.</i>
      <a class="contact-pro" key=${index}">
        <i class="fa fa-envelope"></i>Contact this Pro
      </a>
      <div class="hours">
        <h6>Business Hours</h6>
        ${businessHours}
      </div>
      <div class="card-bottom">        
        ${certificationContent}
      </div>
      </div>`;
      });
      cardsParent.appendChild(newDealers);
    },
    //email function for rendering on contact pro button
    renderEmail: function(state) {
      const emailTitle = document.getElementById('email-title');
      const emailText = document.getElementById('email-copy');
      emailTitle.innerHTML = '';
      emailText.innerHTML = '';
      emailTitle.appendChild(
        document.createTextNode(state.currentDealer.data.name)
      );
      emailText.appendChild(
        document.createTextNode(
          `Fill out the form below and ${state.currentDealer.data
            .name} will get in touch.`
        )
      );
    },
    //shows filters when you click dropdown
    showFilters: function() {
      filterContainer.classList.toggle('hidden');
    },
    showModal: function(e) {
      if (!e.target.matches('.contact-pro')) return;
      emailModal.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
      stateEditingObject.currentDealer(e);
      renderObject.renderEmail(appState);
      overlay.classList.remove('hidden')
    },
    closeModal: function(e) {
      emailModal.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
      appState.currentDealer = '';
      overlay.classList.add('hidden')
    },
    validateForm: function(e) {
      switch (e.target.id) {
        case 'name':
          if (e.target.value.length > 5 && typeof e.target.value === 'string') {
            document.getElementById('name-validate').classList.remove('hidden');
          }
          break;
        case 'number':
          if (e.target.value.length >= 10 && typeof e.target.value !== 'NaN') {
            document
              .getElementById('phone-validate')
              .classList.remove('hidden');
          }
          break;
        case 'zip':
          if (e.target.value.length == 5 && typeof e.target.value !== 'NaN') {
            document.getElementById('zip-validate').classList.remove('hidden');
          }
          break;
        case 'email':
          if (
            e.target.value.includes('@' && '.com') &&
            typeof e.target.value === 'string'
          ) {
            document
              .getElementById('email-validate')
              .classList.remove('hidden');
          }
          break;
      }
    },
    //hamburger menu handlers
    showMobileMenu: function(e) {
      menu.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
    },
    closeMobileMenu: function(e) {
      menu.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
    },
    //expand accordion handler
    expandMenu: function(e) {
      const menus = document.querySelectorAll('.menu-container');
      if (!e.target.matches('.accordion')) return;
      if (window.innerWidth > 950) {
        if (!e.target.classList.contains('active')) {
          menus.forEach(menu => {
            if (menu.firstElementChild.classList.contains('active')) {
              menu.firstElementChild.classList.remove('active');
              menu.firstElementChild.nextElementSibling.classList.toggle(
                'hidden'
              );
            }
          });
        }

        e.target.classList.toggle('active');
      }
      e.target.nextElementSibling.classList.toggle('hidden');
    }
  };
  //initial grab of data
  window.addEventListener('load', function() {
    stateEditingObject.getDealers('https://api.myjson.com/bins/l3geh');
  });


  //event listeners
  button.addEventListener('click', renderObject.showFilters);
  cardParent.addEventListener('click', renderObject.showModal);
  closeModalButton.addEventListener('click', renderObject.closeModal);
  filters.addEventListener('change', stateEditingObject.filterDealers);
  myForm.addEventListener('change', renderObject.validateForm);
  hamburger.addEventListener('click', renderObject.showMobileMenu);
  closeMenuButton.addEventListener('click', renderObject.closeMobileMenu);
  menuContainer.addEventListener('click', renderObject.expandMenu);
  send.addEventListener('click', renderObject.closeModal);
})();
