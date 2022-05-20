c = document.getElementById('myCanvas');
cd = c.getContext('2d');
async function draw(s) {
  img = new Image();
  img.setAttribute('crossorigin', 'anonymous');
  img.src = `https://aloycwl.github.io/js/Examples/IFPS_Upload_Canvas_${s}.png`;
  return new Promise((resolve) => {
    img.onload = function () {
      cd.drawImage(img, 0, 0);
      resolve();
    };
  });
}
async function load() {
  await draw('1');
  await draw('0');
}
load();
