# log-parser

A command line tool to convert Apache-style access log files into human-readable CSVs.

---
## Requirements

You will need Node.js and npm installed in your environment.

### Node
- #### Node installation on Windows

  Go to the [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm
      
If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

## Install

    $ git clone https://github.com/alexborrego/log-parser
    $ cd log-parser
    $ npm install

## Running the project

    Open a terminal from within the log-parser folder. From here, run the following command:
    $ node ./src/app.js
    
    You will receive a prompt to enter the path to your log file. Enter the path relative to the log-parser folder.
    When the program finishes, it will output the CSV file directly to the log-parser folder.
