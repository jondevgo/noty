
/* IMPORT */

import * as _ from 'lodash';
import {Menu, MenuItemConstructorOptions, shell} from 'electron';
import * as is from 'electron-is';
import * as localShortcut from 'electron-localshortcut';
import Environment from '@common/environment';
import Settings from '@common/settings';
import pkg from '@root/package.json';
import UMenu from '@main/utils/menu';
import About from './about';
import Route from './route';

/* MAIN */

class Main extends Route {

  /* CONSTRUCTOR */

  constructor ( name = 'main', options = { minWidth: 150, minHeight: 100 }, stateOptions = { defaultWidth: 250, defaultHeight: 450 } ) {

    super ( name, options, stateOptions );

  }

  /* SPECIAL */

  events () {

    super.events ();

    this.___focus ();
    this.___blur ();

  }

  /* FOCUS */

  ___focus () {

    this.win.on ( 'focus', this.__focus.bind ( this ) );

  }

  __focus () {

    this.win.webContents.send ( 'window-focus' );

  }

  /* BLUR */

  ___blur () {

    this.win.on ( 'blur', this.__blur.bind ( this ) );

  }

  __blur () {

    this.win.webContents.send ( 'window-blur' );

  }

  /* SPECIAL */

  initLocalShortcuts () {

    /* CmdOrCtrl + 1-9 */

    _.range ( 1, 10 ).forEach ( nr => {
      localShortcut.register ( this.win, `CmdOrCtrl+${nr}`, () => {
        this.win.webContents.send ( 'note-select-number', nr );
      });
    });

  }

  initMenu () {

    const template: MenuItemConstructorOptions[] = UMenu.filterTemplate ([
      {
        label: pkg.productName,
        submenu: [
          {
            label: `About ${pkg.productName}`,
            click: () => new About ()
          },
          {
            type: 'separator'
          },
          {
            role: 'services',
            submenu: [] ,
            visible: is.macOS ()
          },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          {
            role: 'hide',
            visible: is.macOS ()
          },
          {
            role: 'hideothers',
            visible: is.macOS ()
          },
          {
            role: 'unhide',
            visible: is.macOS ()
          },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          { role: 'quit' }
        ]
      },
      {
        label: 'Note',
        submenu: [
          {
            label: 'New',
            accelerator: 'CmdOrCtrl+N',
            click: () => this.win.webContents.send ( 'note-add' )
          },
          {
            label: 'Rename',
            accelerator: 'f2',
            click: () => this.win.webContents.send ( 'note-rename' )
          },
          {
            label: 'Delete',
            accelerator: 'CmdOrCtrl+Alt+Backspace',
            click: () => this.win.webContents.send ( 'note-delete' )
          },
          { type: 'separator' },
          {
            label: 'Open Configuration',
            click: () => Settings.openInEditor ()
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          // { role: 'undo' },
          // { role: 'redo' },
          // { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' }
            ],
            visible: is.macOS ()
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            role: 'reload',
            visible: Environment.isDevelopment
          },
          {
            role: 'forcereload',
            visible: Environment.isDevelopment
          },
          {
            role: 'toggledevtools',
            visible: Environment.isDevelopment
          },
          {
            type: 'separator',
            visible: Environment.isDevelopment
          },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'close' },
          { role: 'minimize' },
          {
            role: 'zoom',
            visible: is.macOS ()
          },
          { type: 'separator' },
          {
            label: 'Select Previous Note',
            accelerator: 'CmdOrCtrl+Alt+Left',
            click: () => this.win.webContents.send ( 'note-select-previous' )
          },
          {
            label: 'Select Previous Note',
            accelerator: 'Shift+Ctrl+Tab',
            click: () => this.win.webContents.send ( 'note-select-previous' )
          },
          {
            label: 'Select Next Note',
            accelerator: 'CmdOrCtrl+Alt+Right',
            click: () => this.win.webContents.send ( 'note-select-next' )
          },
          {
            label: 'Select Next Note',
            accelerator: 'Ctrl+Tab',
            click: () => this.win.webContents.send ( 'note-select-next' )
          },
          { type: 'separator' },
          {
            type: 'checkbox',
            label: 'Float on Top',
            checked: !!this.win && this.win.isAlwaysOnTop (),
            click: () => this.win.setAlwaysOnTop ( !this.win.isAlwaysOnTop () )
          },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          {
            role: 'front',
            visible: is.macOS ()
          }
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: () => shell.openExternal ( pkg.homepage )
          },
          {
            label: 'Support',
            click: () => shell.openExternal ( pkg.bugs.url )
          },
          { type: 'separator' },
          {
            label: 'View Changelog',
            click: () => shell.openExternal ( `${pkg.homepage}/blob/master/CHANGELOG.md` )
          },
          {
            label: 'View License',
            click: () => shell.openExternal ( `${pkg.homepage}/blob/master/LICENSE` )
          }
        ]
      }
    ]);

    const menu = Menu.buildFromTemplate ( template );

    Menu.setApplicationMenu ( menu );

  }

}

/* EXPORT */

export default Main;
