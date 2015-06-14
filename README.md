# reaper-actions-server
A server to run on a machine that will translate requests into keystrokes in order to trigger actions in the music software Reaper. Also utilizes websockets in order to update the display of the currently playing song as needed on client devices.

# Running Locally

1. Install node 


2. If on Mac, install cliclick: (http://www.bluem.net/en/mac/cliclick/)

3. If on Linux, install xdotool (http://www.semicomplete.com/projects/xdotool/) 

4. If on Windows, make sure python is installed and the pertaining pywin32 library for your python installation is installed (http://sourceforge.net/projects/pywin32/files/pywin32/)

then:

``` bash
git clone https://github.com/kevinyuliawan/reaper-actions-server
npm install
npm start
```

Note for Mac and Windows: The window that you want to execute commands in **needs to have focus.**