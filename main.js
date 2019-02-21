const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let mainWindow

const getFileFromUserSelection = exports.getFileFromUserSelection = () => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'JS Files', extensions: ['js', 'jsx'] },
      { name: 'HTML Files', extensions: ['html'] }
    ]
  });

  if (!files) return;

  const file = files[0];
  const content = fs.readFileSync(file).toString();

  mainWindow.webContents.send('file-opened', file, content);
};

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})