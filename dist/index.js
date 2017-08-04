/* eslint-disable */
(function() {
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

  console.log(menuContainer);
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

  const stateEditingObject = {
    state: appState,

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
    filterDealers: function(event) {
      if (!event.target.matches('input')) return;
      let newFilters = appState.filters.filter(word => {
        return word !== event.target.value;
      });
      if (appState.filters.includes(event.target.value)) {
        appState.filters = [...newFilters];
        renderObject.renderDealers(appState);
        dealerNumber.innerHTML = `${document.querySelectorAll('.card')
          .length} dealers`;
        return;
      } else {
        appState.filters = [...appState.filters, event.target.value];
        renderObject.renderDealers(appState);
        dealerNumber.innerHTML = `${document.querySelectorAll('.card')
          .length} dealers`;
        return;
      }
    },
    currentDealer: function(event) {
      appState.currentDealer =
        appState.dealers[parseInt(event.target.getAttribute('key'))];
      console.log(appState);
    },
    composeEmail: function(data) {
      opts = {
        type: 'POST'
      };
      fetch('api/email', opts).then(data => {
        alert('Email Sent');
      });
    }
  };
  const renderObject = {
    state: appState,

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
        Object.keys(weekHours).forEach(key => {
          if (businessHours.includes('Weekdays')) {
          }
          let keyText;
          let hoursText;
          weekHours[key] == ''
            ? (hoursText = 'Closed')
            : (hoursText = weekHours[key]);
          switch (key) {
            case 'mon':
            case 'tue':
            case 'wed':
            case 'thu':
            case 'fri':
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
    showFilters: function() {
      filterContainer.classList.toggle('hidden');
    },
    showModal: function(e) {
      if (!event.target.matches('.contact-pro')) return;
      emailModal.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
      stateEditingObject.currentDealer(e);
      renderObject.renderEmail(appState);
    },
    closeModal: function(e) {
      emailModal.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
      appState.currentDealer = '';
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
    showMobileMenu: function(e) {
      menu.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
    },
    closeMobileMenu: function(e) {
      menu.classList.toggle('hidden');
      document.body.classList.toggle('hide-scroll');
    },
    expandMenu: function(e) {
      if (!event.target.matches('.accordion')) return;
      event.target.nextElementSibling.classList.toggle('hidden');
    }
  };
  window.addEventListener('load', function() {
    stateEditingObject.getDealers('./data/dealers.json');
  });

  button.addEventListener('click', renderObject.showFilters);
  cardParent.addEventListener('click', renderObject.showModal);
  closeModalButton.addEventListener('click', renderObject.closeModal);
  filters.addEventListener('change', stateEditingObject.filterDealers);
  myForm.addEventListener('change', renderObject.validateForm);
  hamburger.addEventListener('click', renderObject.showMobileMenu);
  closeMenuButton.addEventListener('click', renderObject.closeMobileMenu);
  menuContainer.addEventListener('click', renderObject.expandMenu);
})();
