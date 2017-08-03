/* eslint-disable */

const dealerNumber = document.getElementById('dealer-number');
const button = document.getElementsByClassName('button-container')[0];
const filterContainer = document.getElementsByClassName('pop-up-filter')[0];
const filters = document.querySelectorAll('input');
const showFilters = () => {
  filterContainer.classList.toggle('hidden');
};

let appState = {
  dealers: [],
  filters: [
    'Service Pro',
    'Installation Pro',
    'Residential Pro',
    'Commercial Pro'
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
  filterDealers: function(e) {
    let newFilters = appState.filters.filter(word => {
      return word !== event.target.value;
    });
    if (appState.filters.includes(event.target.value)) {
      appState.filters = [...newFilters];
      dealerNumber.innerHTML = `${appState.filteredDealers.length} dealers`;
      renderObject.renderDealers(appState);
      return;
    } else {
      appState.filters = [...appState.filters, event.target.value];
      dealerNumber.innerHTML = `${appState.filteredDealers.length} dealers`;
      renderObject.renderDealers(appState);
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

    newDealers.id = 'card-container';
    cardsParent.innerHTML = '';

    state.dealers.map(dealer => {
      const { certifications, weekHours, name, phone1, email } = dealer.data;

      // if (!certifications.includes(...state.filters)) {
      //   console.log(certifications)
      //   return;
      // }
      certificationContent = '';
      certifications.forEach(certification => {
        certificationContent += `<p>${certification}</p>`;
      });
      businessHours = '';
      Object.keys(weekHours).forEach(key => {
        if (businessHours.includes('Weekdays')) {
          console.log('weekday');
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
          <i class="phone-icon"></i> Tap to call <span>${phone1}</span>
      </a>
      <i class="email" >Can't talk now? Click below to send an email.</i>
      <a href="mailto:${email}" class="contact-pro">
      Contact this Pro
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

filters[0].addEventListener('change', stateEditingObject.filterDealers);
