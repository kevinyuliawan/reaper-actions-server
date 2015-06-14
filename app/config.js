function os(){
  var temp = process.platform;
  if(temp.indexOf("darwin")>=0){
    return "macintosh";
  }
  else if(temp.indexOf("win")>=0){
    return "windows";
  }
  else{
    return "other";
  }
}

module.exports = {
  os: os(),
  programName: process.env.CONFIG_PROGRAM_NAME || "REAPER",
  afterDelay: 10,
  // Linux: delay between each possible keypress in ms (can't be too fast)
  // If you want to change delay for windows - change key.py
  delay: 10,
  commands: {
    
    macintosh: { //https://github.com/BlueM/cliclick
      previous: ' "kp:[" ',
      next: ' "kp:]" ',
      playstop: ' "kp:space" ',
      record: ' "kd:cmd" "t:r" "ku:cmd" ',
      volumeDownKy: ' "kp:volume-down" ', //volume actions (although these should be mapped to a custom Reaper track action) aren't working yet, opened issue: https://github.com/BlueM/cliclick/issues/16
      volumeDownWy: ' "kp:volume-down" ',
      volumeUpKy: ' "kp:volume-up" ',
      volumeUpWy: ' "kp:volume-up" '
    },

    windows: {
      previous: '',
      next: '',
      playstop: '',
      record: '',
      volumeDownKy: '',
      volumeDownWy: '',
      volumeUpKy: '',
      volumeUpWy: ''
    },

    other: { //TODO: don't have any linux systems to test on...
      previous: '',
      next: '',
      playstop: '',
      record: '',
      volumeDownKy: '',
      volumeDownWy: '',
      volumeUpKy: '',
      volumeUpWy: ''
    }

  }
}

