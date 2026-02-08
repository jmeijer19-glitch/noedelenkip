// --- DAY/NIGHT CYCLE ---
const dayNight = {
  time: 0.25, // 0-1, 0=midnight, 0.25=sunrise, 0.5=noon, 0.75=sunset
  speed: 0.00003, // one full cycle approx 9 min at 60fps
  getOverlay() {
    const t = this.time;
    // midnight=0, dawn=0.2-0.3, noon=0.5, dusk=0.7-0.8, night=0.9-1.0
    if (t < 0.2) { // deep night
      return { r:10, g:10, b:40, a:0.55 };
    } else if (t < 0.3) { // dawn
      const p = (t-0.2)/0.1;
      return { r: Math.floor(10+50*p), g: Math.floor(10+30*p), b: Math.floor(40-10*p), a: 0.55-0.45*p };
    } else if (t < 0.45) { // morning
      const p = (t-0.3)/0.15;
      return { r: Math.floor(60-60*p), g: Math.floor(40-40*p), b: Math.floor(30-30*p), a: 0.1-0.1*p };
    } else if (t < 0.55) { // noon
      return { r:0, g:0, b:0, a:0 };
    } else if (t < 0.7) { // afternoon
      const p = (t-0.55)/0.15;
      return { r: Math.floor(60*p), g: Math.floor(20*p), b: 0, a: 0.05*p };
    } else if (t < 0.8) { // dusk/sunset
      const p = (t-0.7)/0.1;
      return { r: Math.floor(60+30*p), g: Math.floor(20-10*p), b: Math.floor(20*p), a: 0.05+0.3*p };
    } else { // night
      const p = (t-0.8)/0.2;
      return { r: Math.floor(90-80*p), g: Math.floor(10), b: Math.floor(20+20*p), a: 0.35+0.2*p };
    }
  },
  getLabel() {
    const t = this.time;
    if (t < 0.2) return 'Nacht';
    if (t < 0.3) return 'Dageraad';
    if (t < 0.45) return 'Ochtend';
    if (t < 0.55) return 'Middag';
    if (t < 0.7) return 'Namiddag';
    if (t < 0.8) return 'Schemering';
    return 'Nacht';
  },
  update() {
    this.time += this.speed;
    if (this.time >= 1) this.time -= 1;
  }
};
