__||||||||||||||||||||||||||__
__--------------------------__
__If starting a new project:__
__--------------------------__
__||||||||||||||||||||||||||__

1.) Type `git status`.
    1.1) If `git` is already present, you should get a message of:
        __On branch main__
        __Your branch is up to date with 'origin/main'.__
    1.2) If you do not get this message, add `git` with the command `git init`.

2.) `Express` aides in the initialization of a server.
    2.1) Start with `npm init`.
    2.2) Follow the field prompts.
        2.2.1) If you want to just use defaults, hit `<enter>` to continue.
    2.3) Then run `npm install express`.
        2.3.1) This must be done for __EVERY__ new project!
    2.4) You should now have:
        -- `node_modules` folder and contained items
        -- `package-lock.json` file
        -- `package.json` file
    2.5) To stop tracking downloaded packages / libraries, use `.gitignore`
        2.5.1) Create a file in your __root__ folder (the base folder for your project), create a new file called `.gitignore`.
        2.5.2) Within the `.gitignore` file, add the exact text name of the files & folders that should not be tracked via `git`.
            2.5.2.1) Add `node_modules` to the `.gitignore` file.
            2.5.2.2) At this point, you can use `git status` to track which of these new files are being tracked.

3.) Once all specific files & folders are added to `.gitignore`, it is safe to `git add .` and `git commit -m "Initial commit"`.

4.) Within the `server.js` file (or the main entry file you are using), enter:
    4.1) `const express = require('express');`
        4.1.1) You do NOT need a `./` or `../` format to load in Express.
        4.1.2) If we don't pass either of those, JS will look in the `node_modules` folder.
    4.2) `const app = express();`
    4.3) `app.listen(5000, () => {__Entry function__});`

5.) Now the server can be started using a command line of `node server/server.js`.
    5.1) The command line will turn blank - this means the server is running.

6.) To stop the running server, use `<control> + C`.
    6.1) You will see the command line entry reappear.

7.) Within the `server/` folder, create a new folder called `public`
    7.1) The relative path will be: `server/public`

8.) Within the `public/` folder, create:
    8.1) All the typical web files (i.e. HTML, CSS, JS, ...).

9.) BEFORE the `listen()` function, we need to set up the file sharing.
    9.1) `app.use( express.static( './server/public ) )`.
        9.1.1) Make sure all public files are stored within the `./server/public` folder.