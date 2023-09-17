/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

function fillWithOptions(convObjectKeys, currSelect){
  for(let i=0; i<convObjectKeys.length; i++){
    let currOption = document.createElement("option");
    currOption.setAttribute("class", "option"+(i.toString()));
    currOption.innerText = convObjectKeys[i];
    currSelect.appendChild(currOption);
  }
}

function requestToMain(){
  ipcRenderer.send("msg", "gimedata");
}

window.bridge.sendSettings((event, info) => {
  console.log("111")
  console.log(info);
  let infoObject = JSON.parse(info);
  convObject = infoObject["conversion_rates"];
  let convObjectKeys = Object.keys(convObject);
  let currSelect1 = document.querySelector(".currSelect1");
  fillWithOptions(convObjectKeys, currSelect1);
  let currSelect2 = document.querySelector(".currSelect2");
  fillWithOptions(convObjectKeys, currSelect2);
  window.convObject = convObject;
  window.convObjectKeys = convObjectKeys;
});

function convertCurr(){
  let convObject = window.convObject;
  let convObjectKeys = window.convObjectKeys;
  let currSelect1 = document.querySelector(".currSelect1");
  let currSelect2 = document.querySelector(".currSelect2");
  let outputCturr = document.querySelector(".outputCturr");
  let inputCurr = document.querySelector(".inputCurr");
  inputCurrVal = parseInt(inputCurr.value);
  console.log(currSelect1.selectedIndex, currSelect2.selectedIndex)
  let cs1InUSD = convObject[convObjectKeys[currSelect1.selectedIndex-1]];
  let cs2InUSD = convObject[convObjectKeys[currSelect2.selectedIndex-1]];
  console.log(cs1InUSD, cs2InUSD)
  let sc12ConversionRate = cs2InUSD/cs1InUSD;
  console.log(inputCurrVal, sc12ConversionRate)
  outputCturr.value = inputCurrVal*sc12ConversionRate;
}

function darkMode(){
  let dBody = document.body;
  let colorB=dBody.getAttribute("colorB");
  if(colorB=="c0"){
    dBody.style.backgroundColor = "black";
    dBody.style.color = "white";
    dBody.setAttribute("colorB", "c1");
  }
  if(colorB=="c1"){
    dBody.style.backgroundColor = "white";
    dBody.style.color = "black";
    dBody.setAttribute("colorB", "c0");
  }
}
