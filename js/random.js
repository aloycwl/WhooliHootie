c = document.getElementById('myCanvas');
cd = c.getContext('2d');
async function draw(s1, s2) {
  img = new Image();
  img.setAttribute('crossorigin', 'anonymous');
  img.src = `https://aloycwl.github.io/twc_frontend/img/${s1}/${s2}.png`;
  return new Promise((resolve) => {
    img.onload = function () {
      cd.drawImage(img, 0, 0, 350, 350);
      resolve();
    };
  });
}
async function load() {
  s2 = ran(10);
  if (s2 < 9) await draw(0, s2);
  s2 = ran(12);
  if (s2 < 11) draw(1, s2);
}
function ran(p) {
  return Math.floor(Math.random() * p);
}
load();
