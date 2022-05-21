const Background = [
    'Green',
    'Pink',
    'Brown',
    'Dark Gray',
    'Purple',
    'Gray',
    'Yellow',
    'Red',
    'Blue',
  ],
  Body = [
    'Blue',
    'Pink',
    'Light Gray',
    'Green',
    'Red',
    'Dark Gray',
    'Brown',
    'Purple',
    'Yellow',
  ],
  Headwear = ['Black Headphones', 'White Headphones', 'Beret', 'Tophat'],
  Brow = ['Furrowed', 'Raised', 'Normal'],
  Eyes = ['Sore', 'Normal', 'Crazy', 'Tired', 'Blur', 'Happy', 'Flame'],
  Beak = ['Open', 'Sad', 'Gold Teeth', 'Tounge Out', 'Wide'],
  c = document.getElementById('myCanvas');
cd = c.getContext('2d');

async function dd(s1, s2, s3, s4) {
  r = ran(s2);
  if (r <= s3) {
    $('#traits').append(`{"trait_type":"${s1}","value":"${s4[r]}"}`);
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
  $('#traits').html(`"attributes": [`);
  sex = ran(3);
  await dd('Background', 9, 9, Background);
  await dd('Body', 9, 9, Body);
}
function ran(p) {
  return Math.floor(Math.random() * p);
}
load();
