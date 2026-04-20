(function () {
  "use strict";

  const items = [
    '🟦', '🟦', '🟦', '🟨', '🟨', '🟥'
  ];
  //document.querySelector(".info").textContent = items.join(" ");

  const doors = document.querySelectorAll(".door");
  const result = document.querySelector(".prize");
  document.querySelector("#spinner").addEventListener("click", function () {
    // init();
    spin();
  });
  // document.querySelector("#reseter").addEventListener("click", init);

  async function spin() {
    const r = init(false, 1, 2);
    for (let i = 0; i < doors.length; i++) {
      const door = doors[i];
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      // console.log(duration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 50));
      if (i === 2) {
        // console.log(duration);
        await new Promise((resolve) => setTimeout(resolve, duration * 1000));
        showResult(r);
      }
    }
  }

  function init(firstInit = true, groups = 1, duration = 1) {
    showResult("SPINNING...", true, firstInit)
    const rolls = [];
    for (var i = 0; i < doors.length; i++) {
      const door = doors[i];
      if (firstInit) {
        door.dataset.spinned = "0";
      } else if (door.dataset.spinned === "1") {
        // return;
      }

      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);

      const pool = [];
      if (door.dataset.spinned === "0") {
        pool.push("❓");
      } else {
        // console.log(boxes.firstChild);
        pool.push(boxes.firstChild.innerText);
      }
      groups = i+1;
      duration = duration + i;
      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        // pool.push(...shuffle(arr));
        pool.push(...arr);
        pool.push(...arr);
        const popAmount = Math.floor(Math.random() * 6) + 1;
        rolls.push(popAmount);
        for (let m = 0; m < popAmount; m++) {
          pool.pop();
        }

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            door.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }
      // console.log(pool);

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        door.clientHeight * (pool.length - 1)
      }px)`;
      door.replaceChild(boxesClone, boxes);
      // console.log(door);
    }
    return rolls;
  }
  
  function showResult(roll, spinning = false, first = false) {
    if (first) return;
    if (spinning) {
      result.style.color = "white";
      result.innerText = "SPINNING...";
    } else {
      console.log(roll);
      
      const types = [];
      for (let i = 0; i < roll.length; i++) {
        if (roll[i] < 3) {
          types.push(1);
        } else if (roll[i] < 6) {
          types.push(0);
        } else {
          types.push(2);
        }
      }
      
      console.log(types);
      if (types.includes(0) && types.includes(1) && types.includes(2)) {
        result.style.color = "mediumspringgreen";
        result.innerText = "3 COLORS!!";
      } else if (types[0] == types[1] && types[0] == types[2]) {
        if (types[0] == 0) {
          result.style.color = "deepskyblue";
          result.innerText = "3 BLUE!!";
        } else if (types[0] == 1) {
          result.style.color = "gold";
          result.innerText = "3 YELLOW!!!";
        } else {
          result.style.color = "crimson";
          result.innerText = "3 RED!!!!";
        }
      } else {
        result.style.color = "gray";
        result.innerText = "No prize...";
      }
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init();
})();
