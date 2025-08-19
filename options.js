let btnSave = document.querySelector("#btnSave");
let btnClear = document.querySelector("#btnClear");
let wordList = document.querySelector("#wordList");
let txtInfo = document.querySelector("#txtInfo");

document.addEventListener('DOMContentLoaded', showWordList);

btnSave.addEventListener("click", async () => {
  saveWordList();
});

btnClear.addEventListener("click", async () => {
  clearLocalStorage();
});

function showWordList() {
  chrome.storage.local.get("black", (result) => {
    let black = result.black;
    if (black) {
      let text = black.join('\n');
      wordList.value = text;
    }
    else {
      wordList.value = '';
    }
    if (wordList.value === '') {
      txtInfo.innerText = `Blacklist is empty`;
    }
    else {
      txtInfo.innerText = `Blacklist contains ${black.length} words`;
    }
  });
}

function saveWordList() {
  let text = wordList.value.trim().toLowerCase();
  let arr = text.split('\n');
  chrome.storage.local.set({"black": arr}, () => {
    console.log(`New blacklist saved`);
  });
  txtInfo.innerText = `New blacklist saved`;
}

function clearLocalStorage() {
  chrome.storage.local.clear(() => {
    console.log(`Local storage cleared`);
    showWordList();
  });
}
