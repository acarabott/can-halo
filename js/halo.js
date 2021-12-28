import "hammerjs";

// prevent mobile scrolling
document.ontouchmove = function (event) {
  event.preventDefault();
};

let test;

const container = document.getElementById("area");
const halos = new Map();

function createHalo(output) {
  const wrapper = document.createElement("div");
  container.appendChild(wrapper);
  wrapper.className = "wrapper";

  const outputRect = output.getBoundingClientRect();
  wrapper.style.left = outputRect.left + outputRect.width / 2 - wrapper.clientWidth / 2;
  wrapper.style.top = outputRect.bottom + 10;
  const halo = document.createElement("div");
  wrapper.appendChild(halo);
  halo.className = "halo";

  const pieceLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-"];
  const pieces = pieceLabels.map((label, i, arr) => {
    const piece = document.createElement("div");
    halo.appendChild(piece);
    piece.classList.add("button", "halo-piece");
    piece.textContent = label;

    const radius = halo.offsetWidth * 1;
    const radians = (i / arr.length) * (Math.PI * 2) - Math.PI / 2;
    const offsetX = halo.style.left + halo.offsetWidth / 2 - piece.offsetWidth / 2;
    const offsetY = halo.style.top + halo.offsetHeight / 2 - piece.offsetHeight / 2;

    piece.style.left = Math.cos(radians) * radius + offsetX;
    piece.style.top = Math.sin(radians) * radius + offsetY;

    const hammer = new Hammer(piece);

    hammer.on("tap", (event) => {
      output.value =
        label === "-"
          ? output.value[0] === "-"
            ? output.value.slice(1)
            : `-${output.value}`
          : label === "."
          ? output.value.includes(".")
            ? output.value
            : output.value + label
          : output.value + label;
    });
    return piece;
  });

  const inlineDimension = outputRect.height * 1.5;
  const inlineTop = outputRect.top + outputRect.height / 2 - inlineDimension / 2;
  const inlineFontSize = parseInt(window.getComputedStyle(output)["fontSize"], 10) * 1.5;
  const backspace = document.createElement("div");
  wrapper.appendChild(backspace);
  backspace.classList.add("button", "backspace");
  backspace.textContent = "\u232B";
  backspace.style.left = outputRect.right + 10;
  backspace.style.top = inlineTop;
  backspace.style.height = inlineDimension;
  backspace.style.width = inlineDimension;
  backspace.style.fontSize = inlineFontSize;

  const backspaceHammer = new Hammer(backspace);
  backspaceHammer.on("tap", (event) => {
    output.value = output.value.slice(0, output.value.length - 1);
  });

  const clear = document.createElement("div");
  wrapper.appendChild(clear);
  clear.classList.add("button", "clear");
  clear.textContent = "\u2327";
  clear.style.left = outputRect.right + backspace.clientWidth + 20;
  clear.style.top = inlineTop;
  clear.style.height = inlineDimension;
  clear.style.width = inlineDimension;
  clear.style.fontSize = inlineFontSize;

  const clearHammer = new Hammer(clear);
  clearHammer.on("tap", (event) => (output.value = ""));

  const done = document.createElement("div");
  wrapper.appendChild(done);
  done.classList.add("button", "done");
  done.textContent = "\u2713";

  done.style.top = halo.offsetTop + halo.offsetHeight / 2 - done.offsetHeight / 2;
  done.style.left = wrapper.offsetWidth / 2 - done.offsetWidth / 2;
  const doneHammer = new Hammer(done);
  doneHammer.on("tap", (event) => removeHalo(output));

  return wrapper;
}

function removeHalo(key) {
  container.removeChild(halos.get(key));
  halos.delete(key);
}

function clearAllHalos() {
  halos.forEach((halo, key) => {
    container.removeChild(halo);
  });
  halos.clear();
}

const containerHammer = new Hammer(container);
containerHammer.on("tap", (event) => {
  if (event.target !== container) return;
  // clearAllHalos();
});

containerHammer.on("doubletap", (event) => {
  event.preventDefault();
  if (event.target !== container) return;
  const bb = event.target.getBoundingClientRect();
  const borderWidth = parseInt(window.getComputedStyle(event.target)["borderWidth"], 10);
  const x = event.center.x - (bb.left + borderWidth);
  const y = event.center.y - (bb.top + borderWidth);
  // halos.push(createHalo(x, y));
});

Array.from(document.querySelectorAll("input[type=text]")).forEach((element) => {
  const hammer = new Hammer(element);
  hammer.on("tap", (event) => {
    event.preventDefault();
    if (!halos.has(element)) {
      halos.set(element, createHalo(element));
    }
  });
});
