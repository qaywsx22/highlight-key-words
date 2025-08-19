let btnHide = document.querySelector("#btnHide");
let btnMinus = document.querySelector("#btnMinus");
// let btnClear = document.querySelector("#btnClear");
let txtInfo = document.querySelector("#txtInfo");

btnHide.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: hideBlacklisted,
  });
});

btnMinus.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: addSelectionToBlackList,
  });
});

// btnClear.addEventListener("click", async () => {
//   clearLocalStorage();
// });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    showFilteringResult(request.filtering);
  }
);

function showFilteringResult(mess) {
  if (mess) {
    txtInfo.innerText = mess;
  }
  else {
    txtInfo.innerText = "&nbsp;";
  }
}

function addSelectionToBlackList() {
  let selObj = window.getSelection();
  let sel = (selObj && selObj !== "" ? selObj.toString() : null);
  if (sel) {
    chrome.storage.local.get("black", (result) => {
      let black = result.black;
      (black == null) ? black = new Set() : black = new Set(black);
      sel = sel.trim().toLowerCase();
      black.add(sel);
      chrome.storage.local.set({"black": [...black]}, () => {
        console.log(`Selection ${sel} added to black list`);
      });
    });
  }
  else {
    console.log(`No selection on the page`);
  }
}

// function clearLocalStorage() {
//   chrome.storage.local.clear(() => console.log(`Local storage cleared`));
// }

function hideBlacklisted() {
  const rejs = /\.js/gi;
  const re = /'|,|\.|:|;|\)|\(/gi;
  let count = 0;
  let total = 0;
  chrome.storage.local.get("black", (result) => {
    let black = result.black;
    (black == null) ? black = new Set() : black = new Set(black);
    if (black && black.size > 0) {
      count = 0;
      let nodeList = document.querySelectorAll(".job-title");
      total = nodeList.length;
      total && nodeList.forEach((node) => {
        let card = node.parentElement.parentElement.parentElement;
        let text = card.innerText.replaceAll(rejs, 'js');
        text = text.replaceAll(re, ' ');
        let sepre = /\s/;
        let words = text.split(sepre);
        words.forEach(function(elem, index, array) {
          array[index] = elem.toLowerCase();
        });
        let curSet = new Set(words);
        // curSet.forEach((elem, index, array) => array[index] = elem.toLowerCase());
        for (let elem of black) {
          if (curSet.has(elem)) {
              card.style.display = "none";
              count++;
              break;
          }
        }        
      });
    }
    else {
      console.log(`Black list is empty, nothing to do`);
    }
    const mess = `${count} from ${total} hidden`;
    total && console.log(mess);
    total && chrome.runtime.sendMessage({filtering: mess}, function(response) {
      console.log(response.farewell);
    });
  });
}
