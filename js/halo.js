// prevent mobile scrolling
document.ontouchmove = function(event){ event.preventDefault(); }


const container = document.getElementById('area');
const halos = [];

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
    ['button', 'halo-piece'].forEach(c => piece.classList.add(c));
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

  const backspace = document.createElement('div');
  wrapper.appendChild(backspace);
  ['button', 'backspace'].forEach(c => backspace.classList.add(c));
  backspace.textContent = '\u232B';
  backspace.style.top = halo.offsetTop + (halo.offsetHeight / 2) - (backspace.offsetWidth / 2);
  backspace.style.left = (wrapper.offsetWidth * 0.4) - (backspace.offsetWidth / 2);
  const backspaceHammer = new Hammer(backspace);
  backspaceHammer.on('tap', event => {
    output.textContent = output.textContent.slice(0, output.textContent.length - 1);
  });


  const clear = document.createElement('div');
  wrapper.appendChild(clear);
  ['button', 'clear'].forEach(c => clear.classList.add(c));
  clear.textContent = '\u2327';
  clear.style.top = halo.offsetTop + (halo.offsetHeight / 2) - (clear.offsetWidth / 2);
  clear.style.left = (wrapper.offsetWidth * 0.6) - (clear.offsetWidth / 2);

  const clearHammer = new Hammer(clear);
  clearHammer.on('tap', event => output.textContent = '');


  return wrapper;
}

function clearAllHalos() {
  halos.forEach(halo => container.removeChild(halo));
  halos.length = 0;
}

const hammer = new Hammer(container);
hammer.on('tap', event => {
  if (event.target !== container) return;
  clearAllHalos();
});

hammer.on('doubletap', event => {
  event.preventDefault();
  if (event.target !== container) return;

  const bb = event.target.getBoundingClientRect();
  const borderWidth = parseInt(window.getComputedStyle(event.target)['borderWidth'], 10);
  const x = event.center.x - (bb.left + borderWidth);
  const y = event.center.y - (bb.top + borderWidth);
  test = event.target
  halos.push(createHalo(x, y));
});

