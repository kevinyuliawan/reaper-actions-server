#http://stackoverflow.com/questions/1823762/sendkeys-for-python-3-1-on-windows

import win32api
import win32con
import win32ui
import time,sys

keyDelay = 0.1
keymap = {
    #https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
    "previous": int(0xDB), #the "[{" key
    "next": int(0xDD), #the "]}" key
    "playstop": win32con.VK_F10,
    "record": win32con.VK_F1,
    "recordorig": win32con.VK_F12,
    "volumeDownKy": win32con.VK_F2,
    "volumeDownWy": win32con.VK_F3,
    "volumeUpKy": int(0xBF), #the "/" key
    "volumeUpWy": int(0xDC) #the "\" key
}

def sendKey(button):
    win32api.keybd_event(keymap[button], 0, 0, 0)
    time.sleep(keyDelay)
    win32api.keybd_event(keymap[button], 0, win32con.KEYEVENTF_KEYUP, 0)

if __name__ == "__main__":
    win = win32ui.FindWindow(None, sys.argv[1])
    win.SetForegroundWindow()
    win.SetFocus()
    sendKey(sys.argv[2])