import "hammerjs";

// prevent mobile scrolling
document.ontouchmove = function (event) {
  event.preventDefault();
};

const getContainer = () => {
  const container = document.getElementById("area");
  if (container === null) {
    throw new Error("could not find container");
  }
  return container;
};

const halos = new Map<HTMLInputElement, HTMLDivElement>();

const getWrapperPos = (wrapper: HTMLElement, output: HTMLInputElement) => {
  const outputRect = output.getBoundingClientRect();

  const left = outputRect.left + outputRect.width * 0.5 - wrapper.clientWidth * 0.5;
  const top = outputRect.bottom + 10;

  return { left, top };
};

function createHalo(output: HTMLInputElement) {
  const wrapper = document.createElement("div");
  getContainer().appendChild(wrapper);
  wrapper.className = "wrapper";

  const outputRect = output.getBoundingClientRect();
  const { left: wrapperLeft, top: wrapperTop } = getWrapperPos(wrapper, output);

  wrapper.style.left = `${wrapperLeft}px`;
  wrapper.style.top = `${wrapperTop}px`;

  const halo = document.createElement("div");
  wrapper.appendChild(halo);
  halo.className = "halo";

  const pieceLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-", "X"] as const;
  pieceLabels.forEach((label, i, arr) => {
    const piece = document.createElement("div");
    halo.appendChild(piece);
    
    piece.classList.add("button", "halo-piece");
    if (label === "X") {
      piece.classList.add("delete");
    } else if (label === "." || label === "-") {
      piece.classList.add("mod");
    }

    const sizePx = wrapper.clientWidth * 0.2;
    piece.style.width = `${sizePx}px`;
    piece.style.height = `${sizePx}px`;
    piece.textContent = label;

    const radius = halo.clientWidth * 0.4;
    const radians = (i / arr.length) * (Math.PI * 2) - Math.PI / 2;
    const offsetX = halo.clientWidth / 2 - piece.clientWidth / 2;
    const offsetY = halo.clientHeight / 2 - piece.clientHeight / 2;

    piece.style.left = `${Math.cos(radians) * radius + offsetX}px`;
    piece.style.top = `${Math.sin(radians) * radius + offsetY}px`;

    const hammer = new Hammer(piece);

    hammer.on("tap", (_event) => {
      output.value =
        label === "-"
          ? output.value[0] === "-"
            ? output.value.slice(1)
            : `-${output.value}`
          : label === "."
          ? output.value.includes(".")
            ? output.value
            : output.value + label
          : label === "X"
          ? output.value.slice(0, -1)
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
  backspace.style.left = `${outputRect.right + 10}px`;
  backspace.style.top = `${inlineTop}px`;
  backspace.style.height = `${inlineDimension}px`;
  backspace.style.width = `${inlineDimension}px`;
  backspace.style.fontSize = `${inlineFontSize}px`;

  const backspaceHammer = new Hammer(backspace);
  backspaceHammer.on("tap", (_event) => {
    output.value = output.value.slice(0, output.value.length - 1);
  });

  const clear = document.createElement("div");
  wrapper.appendChild(clear);
  clear.classList.add("button", "clear");
  clear.textContent = "\u2327";
  clear.style.left = `${outputRect.right + backspace.clientWidth + 20}px`;
  clear.style.top = `${inlineTop}px`;
  clear.style.height = `${inlineDimension}px`;
  clear.style.width = `${inlineDimension}px`;
  clear.style.fontSize = `${inlineFontSize}px`;

  const clearHammer = new Hammer(clear);
  clearHammer.on("tap", (_event) => (output.value = ""));

  const done = document.createElement("div");
  wrapper.appendChild(done);
  done.classList.add("button", "done");
  done.textContent = "\u2713";

  done.style.top = `${halo.offsetTop + halo.clientHeight / 2 - done.clientHeight / 2}px`;
  done.style.left = `${wrapper.clientWidth / 2 - done.clientWidth / 2}px`;
  const doneHammer = new Hammer(done);
  doneHammer.on("tap", (_event) => removeHalo(output));

  return wrapper;
}

function removeHalo(key: HTMLInputElement) {
  const toRemove = halos.get(key);
  if (toRemove !== undefined) {
    getContainer().removeChild(toRemove);
    halos.delete(key);
  }
}

function clearAllHalos() {
  halos.forEach((halo, _key) => {
    getContainer().removeChild(halo);
  });
  halos.clear();
}

const containerHammer = new Hammer(getContainer());
containerHammer.on("tap", (event) => {
  if (event.target !== getContainer()) return;
  clearAllHalos();
});

// containerHammer.on("doubletap", (event) => {
//   event.preventDefault();
//   if (event.target !== getContainer()) return;
//   const bb = event.target.getBoundingClientRect();
//   const borderWidth = parseInt(window.getComputedStyle(event.target)["borderWidth"], 10);
//   const x = event.center.x - (bb.left + borderWidth);
//   const y = event.center.y - (bb.top + borderWidth);
//   halos.push(createHalo(x, y));
// });

(Array.from(document.querySelectorAll("input[type=text]")) as HTMLInputElement[]).forEach(
  (element) => {
    const hammer = new Hammer(element);
    hammer.on("tap", (event) => {
      event.preventDefault();
      clearAllHalos();
      if (!halos.has(element)) {
        halos.set(element, createHalo(element));
      }
    });
  },
);

window.addEventListener("resize", () => {
  clearAllHalos();
});
