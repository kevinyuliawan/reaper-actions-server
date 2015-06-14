import ctypes
import sys

if __name__ == "__main__":
    #get all the titles and filter by the provided name of program in config.js ("REAPER")
    EnumWindows = ctypes.windll.user32.EnumWindows
    EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int))
    GetWindowText = ctypes.windll.user32.GetWindowTextW
    GetWindowTextLength = ctypes.windll.user32.GetWindowTextLengthW
    IsWindowVisible = ctypes.windll.user32.IsWindowVisible
    titles = []
    def foreach_window(hwnd, lParam):
        if IsWindowVisible(hwnd):
            length = GetWindowTextLength(hwnd)
            buff = ctypes.create_unicode_buffer(length + 1)
            GetWindowText(hwnd, buff, length + 1)
            str = buff.value.encode('ascii','replace')
            if(len(str) > 2 and sys.argv[1] in str):
                titles.append(buff.value.encode('ascii','replace'))
        return True
    EnumWindows(EnumWindowsProc(foreach_window), 0)
     
    if(len(titles) > 0):
        sys.stdout.write(titles[0])
    else:
        sys.stderr.write("Not Found!")