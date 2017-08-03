/* eslint-disable */

const dealerNumber = document.getElementById('dealer-number');
const button = document.getElementsByClassName('button-container')[0];
const filterContainer = document.getElementsByClassName('pop-up-filter')[0];
const filters = document.querySelector('.pop-up-filter');
const showFilters = () => {
  filterContainer.classList.toggle('hidden');
};

let appState = {
  dealers: [],
  filters: [
    'Installation Pro',
    'Commercial Pro',
    'Residential Pro',
    'Service Pro'
  ],
  filteredDealers: []
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
      dealerNumber.innerHTML = `${document
        .querySelectorAll('.card')
        .length} dealers`;
      return;
    } else {
      appState.filters = [...appState.filters, event.target.value];
      renderObject.renderDealers(appState);
      dealerNumber.innerHTML = `${document
        .querySelectorAll('.card')
        .length} dealers`;
      return;
    }
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

    state.dealers.map(dealer => {
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
      <div class="card">
      <h6 class="title">${name}</h6>
      <a href="tel:${phone1}" class="call">
          <i class="phone-icon fa fa-phone"></i> Tap to call <span>${phone1}</span>
      </a>
      <i class="email" >Can't talk now? Click below to send an email.</i>
      <a href="mailto:${email}" class="contact-pro">
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
  }
};
window.addEventListener('load', function() {
  stateEditingObject.getDealers('./data/dealers.json');
});

button.addEventListener('click', showFilters);

filters.addEventListener('change', stateEditingObject.filterDealers);
