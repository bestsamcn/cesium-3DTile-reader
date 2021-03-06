import electron, { app, BrowserWindow, screen } from 'electron';
import { join } from 'path';
import is from 'electron-is';
import log from 'electron-log';
import * as application from './services/application';
import * as window from './services/window';
import * as menu from './services/menu';
import * as config from './configs/config';
import path from 'path';
import { updator } from './services/updator';
import * as reader from './services/reader';

app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('force-device-scale-factor', '1');


declare module NodeJS  {
    interface Global {
        services: any,
        configs:any,
        updator:any
    }
}

log.transports.file.level = 'info';

if (is.dev()) {
    require('electron-debug')(); // eslint-disable-line global-require

    //自动刷新主线程
    // require('electron-reload')(process.cwd()+'/app', { 
    // 	electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron.cmd')
    // }); // eslint-disable-line global-require
}
app.on('ready', () => {
    log.info('(main ready');
    const win = application.init();
    global.win = win;
    updator.win = win;
    menu.init(updator);
    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (window.getCount() === 0) {
        application.init();
    }
});

app.on('quit', () => {
    log.info('main quit');
});


global.services = { 
    application,
    window,
    reader
};
global.configs = {
    config,
};


