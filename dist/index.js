/* eslint-disable */
let dealers;
const dealerNumber = document.getElementById('dealer-number');
const button = document.getElementsByClassName('button-container')[0];
const filters = document.getElementsByClassName('pop-up-filter')[0];

const showData = data => {
  console.log(data);
};
const getData = () => {
  fetch('./data/dealers.json')
    .then(data => {
      return data.json();
    })
    .then(data => {
      dealers = data;
    })
    .then(() => {
      showData(dealers);
      dealerNumber.innerHTML = `${dealers.dealers.length} dealers`;
    })
    .catch(err => {
      console.error(err);
    });
};

const showFilters = () => {
  filters.classList.toggle('hidden');
};

button.addEventListener('click', showFilters);

console.log(button);
getData();
