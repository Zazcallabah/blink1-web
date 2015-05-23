# nodeblink

Node-hosted web interface for blink1 that uses node-blink1 and node-hid to communicate with the device.

## Prerequisites

* python 2.7.3 - if you have later versions of python you may have to do tricksy things with your path variable
* npm, nodejs - some effort may be required to fix npm, see separate section


## Installation

Clone this repo

    git clone https://github.com/Zazcallabah/nodeblink.git
    cd nodeblink

We need node-hid, and it needs sudo for some reason

    sudo npm install node-hid

If you can open a node shell and can require('node-hid') without error, then you can proceed.

We need node-blink1, preferably a version that supports mk2 with firmware 204

    npm install "git+https://github.com/Zazcallabah/node-blink1.git"

now you can start the server and browse to the webpage

    nodejs server.js
    http://localhost:19333


## Depends on

* http://raphaeljs.com/picker/
* https://github.com/todbot/blink1
* https://nodejs.org/
* https://github.com/sandeepmistry/node-blink1
* https://github.com/node-hid/node-hid

## Todo

* Interface for getting, setting, and playing sequences.
* Buttons for specific states. Maybe programmable? Ideas from the blinkcontrol program.
* Show current color
* Support multiple blink1 devices
* Support different firmwares?
* enter command from url
* make real npm module

## Known issues

* Resizing the browser window may screw up the color pickers.

## npm install instructions

Install npm

    sudo apt-get install npm

Name conflict in package manager means you have to manually link the binary

    sudo ln -s /usr/bin/nodejs /usr/bin/node

install prereqs for getting node-hid to work on ubuntu

    sudo apt-get install libudev-dev libusb-1.0-0-dev

npm cant handle https apparently

    sudo npm config set registry http://registry.npmjs.org/
    npm config set registry http://registry.npmjs.org/

node-hid wont work if your node version is too low, if you are below ~0.8, do this

    sudo npm cache clean -f
    sudo npm install -g n
    sudo n 0.10.28

blink1 specific instructions

    wget https://raw.githubusercontent.com/todbot/blink1/master/linux/51-blink1.rules
    sudo cp 51-blink1.rules /etc/udev/rules.d/
   bsudo udevadm control --reload-rules

reboot is needed to fix node version mismatch

    sudo shutdown -r now
