c = document.getElementById('myCanvas');
cd = c.getContext('2d');
async function dd(s1, s2, s3) {
  r = ran(s2);
  if (r <= s3) {
    img = new Image();
    img.setAttribute('crossorigin', 'anonymous');
    img.src = `https://aloycwl.github.io/twc_frontend/img/${s1}/${r}.png`;
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
  await dd(0, 9, 9);
  await dd(1, 9, 9);
}
function ran(p) {
  return Math.floor(Math.random() * p);
}
load();
