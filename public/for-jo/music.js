// Original synthesized plucked strings and flute; playback starts only on request.
window.JoMusic={
 audio:null,
 async setPlaying(on){
  if(!this.audio){this.audio=new Audio('./assets/jo-guofeng.mp3');this.audio.loop=true;this.audio.volume=.48;this.audio.preload='none';}
  if(on)await this.audio.play();else this.audio.pause();
  return !this.audio.paused;
 }
};
