const container = document.getElementById('area');

let test;

container.addEventListener('click', event => {
  const output = document.createElement('div');
  container.appendChild(output);
  output.className = 'output';
  output.style.left = event.offsetX - (output.offsetWidth / 2);
  output.style.top = event.offsetY - (output.offsetHeight / 2);
});
