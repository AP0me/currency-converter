const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { net } = require('electron');
let netFunc = net;

// Initialize the apiInfo variable
let apiInfo = null;

function createWindow(info) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html').then(() => {
    mainWindow.webContents.send('sendSettings', info);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  const request = net.request(
    'https://v6.exchangerate-api.com/v6/f8238a063b96bd028661dad7/latest/USD'
  );
  console.log("JOJO")
  request.on('response', (response) => {
    console.log("JOJO")
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    let data = '';

    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      data += chunk;
    });

    response.on('end', () => {
      console.log('No more data in response.');
      // Update the apiInfo variable with the response data
      apiInfo = data;
      // Create the window after the API response is received
      createWindow(apiInfo);
    });
  });
  request.end();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(apiInfo);
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

/*
async function functionName(){
    const request = net.request(
    'https://v6.exchangerate-api.com/v6/f8238a063b96bd028661dad7/latest/USD'
  );
  console.log("JOJO")
  request.on('response', (response) => {
    console.log("JOJO")
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    let data = '';

    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      data += chunk;
    });

    response.on('end', () => {
      console.log('No more data in response.');
      // Update the apiInfo variable with the response data
      apiInfo = data;
      // Create the window after the API response is received
      window.apiInfo;
    });
  });
  request.end();
}
/*ipcMain.on("msg",async(event, data)=>{
  await functionName();
  console.log(window.apiInfo);
  ipcMain.send("ans", window.apiInfo)
})
*/

