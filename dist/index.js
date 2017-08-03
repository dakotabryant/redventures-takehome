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
  ]
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
    console.log(this)
    if (this.state.filters.includes(event.target.value)) {
      this.state.filters.filter(word => {
        return word !== event.target.value;
      });
    }
    (this.state.filters = [...this.state.filters, event.target.value]);
    console.log(this.state)
  }
};
const renderObject = {
  state: appState,

  renderDealers: function(state) {
    const cardsParent = document.getElementById('dealer-cards');
    let newDealers = document.createElement('div');
    let certificationContent;
    cardsParent.innerHTML = '';

    state.dealers.map(dealer => {
      certificationContent = '';
      newDealers.innerHTML += `
      <div class="card">
      <h6 class="title">${dealer.data.name}</h6>
      <a href="tel:${dealer.data.phone1}">
        <button class="call">
          <i class="phone"></i> Tap to call ${dealer.data.phone1}
        </button>
      </a>
      <i>Can't talk now? Click below to send an email.</i>
      <a href="mailto:${dealer.data.email}">
      <button>Contact this Pro</button>
      </a>
      <div class="hours">
        <h6>Business Hours</h6>
        <p>Weekdays 7:00am - 7:00pm</p>
        <p>Weekdays 7:00am - 7:00pm</p>
        <p>Weekdays 7:00am - 7:00pm</p>
      </div>
      <div class="card-bottom">        
        ${dealer.data.certifications.map(certification => {
          certificationContent += `<p>${certification}</p>`;
        })}
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
