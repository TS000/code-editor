const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

const createWindow = exports.createWindow = () => {
  let newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  windows.add(newWindow);

  newWindow.loadFile('index.html')

  newWindow.on('close', (event) => {
    if (newWindow.isDocumentEdited()) {
      event.preventDefault();
      
      const result = dialog.showMessageBox(newWindow, {
        type: "warning",
        title: "Do you really want to leave me?",
        message: "Your changes will be lost and this could be sad later.",
        buttons: [
          'Quit Anyway',
          'Cancel'
        ],
        defaultId: 0,
        cancelId: 1
      });
      
      if (result === 0) newWindow.destroy();
    }
  });

  newWindow.on('closed', function () {
    newWindow = null
  })

  // Quit when all windows are closed.
app.on('window-all-closed', function () {
  windows.delete(newWindow);
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
};

const getFileFromUserSelection = exports.getFileFromUserSelection = (targetWindow, filePath) => {
  const files = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'JS Files', extensions: ['js', 'jsx'] },
      { name: 'HTML Files', extensions: ['html'] }
    ]
  });

  if (!files) return;

  return files[0];
};

const openFile = exports.openFile = (targetWindow, filePath) => {
  const file = filePath || getFileFromUserSelection(targetWindow);
  const content = fs.readFileSync(file).toString();
  targetWindow.webContents.send('file-opened', file, content);
  targetWindow.setTitle(`${file} - Most Insane Editor Ever`);
  targetWindow.setRepresentedFilename(file);
}

app.on('ready', createWindow);

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});