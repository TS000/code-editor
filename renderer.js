const marked = require('marked');
const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');

const renderMarkdown = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
}

newFileButton.addEventListener('click', () => {
  mainProcess.createWindow();
})

markdownView.addEventListener('keyup', (event) => {
  renderMarkdown(event.target.value);
  currentWindow.setDocumentEdited(true);
});

openFileButton.addEventListener('click', () => {
  mainProcess.openFile(currentWindow);
});

ipcRenderer.on('file-opened', (event, file, content) => {
  markdownView.value = content;
  renderMarkdownToHtml(content);
});