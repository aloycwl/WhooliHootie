c = document.getElementById('myCanvas');
cd = c.getContext('2d');
async function draw(s1, s2, s3) {
  s2 = ran(s2);
  if (s3 <= s2) {
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
}
async function load() {
  //sex = ran(3);
  await draw(0, 10, 9);
  await draw(1, 9, 9);
}
function ran(p) {
  return Math.floor(Math.random() * p);
}
load();
