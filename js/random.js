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
  mAccessories = ['Black Glasses', 'Gold Glasses', 'Monacle'],
  mClothes = [
    'Black Tattoo',
    'White Tattoo',
    'Red Shirt',
    'Purple Shirt',
    'Blue Shirt',
    'Green Shirt',
    'Purple Suit',
    'Red Suit',
    'Black Suit',
    'Blue Suit',
  ],
  fMask = ['Blue-Gold', 'Red-Purple', 'Red-Yellow', 'Gold'],
  fClothes = [
    'White Tattoo',
    'Black Tattoo',
    'Purple Flower Shirt',
    'Blue Flower Shirt',
    'Gray Flower Shirt',
    'Pink Flower Shirt',
    'Yellow Dress',
    'Purple Dress',
    'Blue Dress',
    'Red Dress',
  ],
  fAccessories = ['Earrings', 'Necklace'],
  fFlower = ['Red-Purple', 'Yellow-Orange', 'Purple-Blue'],
  c = document.getElementById('myCanvas'),
  cd = c.getContext('2d');

async function dd(s1, s2, s3) {
  r = ran(s3.length);
  if (r + s2 <= s3.length) {
    $('#traits').append(`{"trait_type":"${s1}","value":"${s3[r]}"},`);
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
  $('#traits').html(`{"attributes": [`);
  sex = ran(2);
  await dd('Background', 2, Background);
  await dd('Body', 0, Body);
  $('#traits').html(`asdasd]}`);
}
function ran(p) {
  return Math.floor(Math.random() * p);
}
load();
