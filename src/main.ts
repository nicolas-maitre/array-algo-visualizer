import "./style.css";
import { reqAnimFrame } from "./utils";

let array: number[] = [];

async function generateAndShuffle() {
  //generate
  const numCounts = 100;
  for (let ind = 0; ind < numCounts; ind++) {
    array[ind] = ind;
    await reqAnimFrame();
  }
  //shuffle
  for (let ind = 0; ind < array.length; ind++) {
    const indToSwap =
      Math.floor(Math.random() * (array.length - ind - 1)) + ind;
    const swapVal = array[indToSwap];
    array[indToSwap] = array[ind];
    array[ind] = swapVal;
    await reqAnimFrame();
  }
}
document.getElementById("newshuffle")!.addEventListener("click", (evt) => {
  generateAndShuffle();
});
document.getElementById("push")!.addEventListener("click", (evt) => {
  array.push(Math.random() * 100);
});
document.getElementById("clear")!.addEventListener("click", (evt) => {
  array.length = 0;
});
document.getElementById("remove")!.addEventListener("click", (evt) => {
  array.splice(Math.floor(Math.random() * array.length), 1);
});
generateAndShuffle();
startRendering();
function startRendering() {
  const barsContainer = document.getElementById("table-values")!;
  const barItems: { elem: HTMLDivElement; value?: number }[] = [];
  function renderLoop() {
    //equalize
    if (array.length != barItems.length) {
      if (array.length < barItems.length) {
        //remove
        const removedItems = barItems.splice(array.length);
        // for (let ind = 0; ind < removedItems.length; ind++) {
        //   removedItems[ind].elem.style.width = "0%";
        //   removedItems[ind].elem.style.height = "0%";
        //   removedItems[ind].elem.dataset.value = "";
        // }
        // setTimeout(() => {
        for (let ind = 0; ind < removedItems.length; ind++) {
          removedItems[ind].elem.remove();
        }
        // }, 500);
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
      const percentVal = 100 / barItems.length; // + Number.MIN_VALUE;
      const percentString = percentVal + "%";
      // requestAnimationFrame(() => {
      for (let ind = 0; ind < barItems.length; ind++) {
        barItems[ind].elem.style.width = percentString;
        barItems[ind].elem.style.left = percentVal * ind + "%";
      }
      // });
    }
    //diff (height)
    // requestAnimationFrame(() => {
    for (let ind = 0; ind < barItems.length; ind++) {
      if (barItems[ind].value !== array[ind]) {
        barItems[ind].value = array[ind];
        barItems[ind].elem.style.height = array[ind] + "%";
        barItems[ind].elem.dataset.value = Math.round(array[ind]) + "";
      }
    }
    // });
    //continue
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}
