
const btn = document.getElementById('btn');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('btn clicked');

  axios.get('/api/test')
    .then(response => response.data)
    .then((data) => {
      console.log('got data from API:', data);
    })
    .catch((error) => {
      console.log('error from API:', error);
    });
});
