const electron = require('electron');
const url = require('url');
const path = require('path');
const server = require('./Server/index');
const {app, BrowserWindow, Menu, ipcRenderer} = electron;

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
    // Create main window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join('./assets/html/', 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
        width: 780,
        height: 100,
        webPreferences: {
            nodeIntegration: true
        },
        title:'Add Songs'
    });
    // Remove menu from addWindow
    addWindow.setMenu(null);
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join('./assets/html/', 'addWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    // Garbage collection
    addWindow.on('closed', function(){
        addWindow = null;
    });
}

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Add Songs',
                accelerator: process.platform == 'darwin' ? 'Command+S' :
                'Ctrl+S',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Refresh',
                accelerator: process.platform == 'darwin' ? 'Command+R' :
                'Ctrl+R',
                click(){
                    mainWindow.reload();
                }
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}
