# nodeblink

Node-hosted web interface for blink1-tool.

## Instructions

* Make sure server has functional blink1-tool binary in path.
* Install nodejs. Use nodejs to launch server.js.
* Browse to localhost:19333 using your favorite chrome browser.

## Depends on

* http://raphaeljs.com/picker/
* https://github.com/todbot/blink1
* https://nodejs.org/

## Todo

* Interface for getting, setting, and playing sequences.
* Buttons for specific states. Maybe programmable?
* Show current color?
* Support multiple blink1 devices
* Support different firmwares?

## Known issues

* Resizing the browser window may screw up the color pickers.


## Coming up

Switching from blink1-tool binary to nodejs hid libraries.

prerequisite: python 2.7.3, and to get nodejs to work properly with the hid library you may need
to do all of the following

	sudo apt-get install npm
	sudo ln -s /usr/bin/nodejs /usr/bin/node
	sudo apt-get install libudev-dev libusb-1.0-0-dev
	sudo npm config set registry http://registry.npmjs.org/
	npm config set registry http://registry.npmjs.org/
	sudo npm cache clean -f
	sudo npm install -g n
	sudo n 0.10.28
	wget https://raw.githubusercontent.com/todbot/blink1/master/linux/51-blink1.rules
	sudo cp 51-blink1.rules /etc/udev/rules.d/
	sudo udevadm control --reload-rules
	sudo shutdown -r now

then clone this repo,
then `sudo npm install node-hid` in this repo,
then `wget https://raw.githubusercontent.com/Zazcallabah/node-blink1/master/blink1.js`
then nodejs server.js
	