let dealers;
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
      showData(dealers.dealers[0]);
    });
};

getData();
