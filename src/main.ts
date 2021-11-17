import "./style.css";
import { reqTimeout } from "./utils";

let array: number[] = [];
(window as any).array = array;
let speedFactor = 1;
let skipSubloopAnimation = false;

//ALGORYTHMS
function compareFn(a: number, b: number) {
  return a - b;
}
async function generate() {
  const numCount = 150;
  //remove excess
  while (array.length > numCount) {
    array.splice(-1);
    await reqTimeUnit();
  }
  //gen
  for (let ind = 0; ind < numCount; ind++) {
    array[ind] = (ind * 100) / numCount;
    await reqTimeUnit();
  }
}
async function shuffle() {
  for (let ind = 0; ind < array.length; ind++) {
    const indToSwap =
      Math.floor(Math.random() * (array.length - ind - 1)) + ind;
    const swapVal = array[indToSwap];
    array[indToSwap] = array[ind];
    array[ind] = swapVal;
    await reqTimeUnit();
  }
}
async function bubbleSort() {
  for (let maxInd = array.length - 1; maxInd > 0; maxInd--) {
    if (skipSubloopAnimation) await reqTimeUnit();
    for (let ind = 0; ind < maxInd; ind++) {
      if (!skipSubloopAnimation) await reqTimeUnit();
      const compareRes = compareFn(array[ind], array[ind + 1]);
      if (compareRes === 0) continue;
      if (compareRes > 0) {
        const swapNum = array[ind + 1];
        array[ind + 1] = array[ind];
        array[ind] = swapNum;
      }
    }
  }
}

function reqTimeUnit(scl = 1) {
  return reqTimeout((10 / speedFactor) * scl);
}

//SETUP
document.getElementById("new")!.addEventListener("click", () => {
  generate();
});
document.getElementById("shuffle")!.addEventListener("click", () => {
  shuffle();
});
document.getElementById("clear")!.addEventListener("click", () => {
  array.length = 0;
});
document.getElementById("bubble-sort")!.addEventListener("click", () => {
  bubbleSort();
});
const skipSubloopAnimationElem = document.getElementById(
  "skip-subloop-anim"
)! as HTMLInputElement;
skipSubloopAnimationElem.checked = skipSubloopAnimation;
skipSubloopAnimationElem.addEventListener("change", () => {
  skipSubloopAnimation = skipSubloopAnimationElem.checked;
});
//start
(async () => {
  await generate();
  await shuffle();
  await bubbleSort();
})();

//RENDER
startRendering();
function startRendering() {
  const barsContainer = document.getElementById("table-values")!;
  const barItems: {
    elem: HTMLDivElement;
    value?: number;
    touched?: boolean;
  }[] = [];
  function renderLoop() {
    //equalize
    if (array.length != barItems.length) {
      if (array.length < barItems.length) {
        //remove
        const removedItems = barItems.splice(array.length);
        for (let ind = 0; ind < removedItems.length; ind++) {
          removedItems[ind].elem.remove();
        }
      } else {
        //add
        for (let ind = barItems.length; ind < array.length; ind++) {
          const elem = document.createElement("div");
          elem.style.left = "100%";
          elem.style.width = "0%";
          barsContainer.appendChild(elem);
          barItems.push({ elem });
        }
      }
      //recalculate width/left
      const percentVal = 100 / barItems.length;
      const percentString = percentVal + "%";
      for (let ind = 0; ind < barItems.length; ind++) {
        barItems[ind].elem.style.width = percentString;
        barItems[ind].elem.style.left = percentVal * ind + "%";
      }
    }
    //diff
    for (let ind = 0; ind < barItems.length; ind++) {
      if (barItems[ind].touched) {
        barItems[ind].touched = false;
        barItems[ind].elem.classList.remove("touched");
      }

      if (barItems[ind].value !== array[ind]) {
        barItems[ind].value = array[ind];
        barItems[ind].elem.style.height = array[ind] + "%";
        barItems[ind].elem.dataset.value = Math.round(array[ind]) + "";

        barItems[ind].touched = true;
        barItems[ind].elem.classList.add("touched");
      }
    }

    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}
