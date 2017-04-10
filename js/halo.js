const container = document.getElementById('area');

let test;

function createHalo(x, y) {
  const wrapper = document.createElement('div');
  container.appendChild(wrapper);
  wrapper.className = 'wrapper';
  wrapper.style.left = x - (wrapper.offsetWidth / 2);
  wrapper.style.top = y - (wrapper.offsetHeight / 2);

  const output = document.createElement('div');
  wrapper.appendChild(output);
  output.className = 'output';
  // output.textContent = '1234567890';

  const halo = document.createElement('div');
  wrapper.appendChild(halo);
  halo.className = 'halo';

  const pieceLabels = ['0','1','2','3','4','5','6','7','8','9','.','-'];
  const pieces = pieceLabels.map((label, i, arr) => {
    const piece = document.createElement('div');
    halo.appendChild(piece);
    piece.className = 'halo-piece';
    piece.textContent = label;

    const radius = halo.offsetWidth * 0.5;
    const radians = (i / arr.length) * (Math.PI * 2) - Math.PI / 2;
    const offsetX = halo.style.left + (halo.offsetWidth / 2) - (piece.offsetWidth / 2);
    const offsetY = halo.style.top + (halo.offsetHeight / 2) - (piece.offsetHeight / 2);

    piece.style.left = Math.cos(radians) * radius + offsetX;
    piece.style.top = Math.sin(radians) * radius + offsetY;

    const hammer = new Hammer(piece);

    hammer.on('tap', event => {
      output.textContent = label === '-'
        ? output.textContent[0] === '-' ? output.textContent.slice(1) : `-${output.textContent}`
        : label === '.'
          ? output.textContent.includes('.') ? output.textContent : output.textContent + label
          : output.textContent + label;
    });
    return piece;
  });

  return wrapper;
}

const hammer = new Hammer(container);
hammer.on('doubletap', event => {
  const bb = event.target.getBoundingClientRect();
  const borderWidth = parseInt(window.getComputedStyle(event.target)['borderWidth'], 10);
  const x = event.center.x - (bb.left + borderWidth);
  const y = event.center.y - (bb.top + borderWidth);
  test = event.target
  createHalo(x, y);

});

// createHalo(250, 250);
