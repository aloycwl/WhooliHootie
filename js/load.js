//[DEPLOYMENT: set price, set mainnet]
var breed1,
  breed2,
  loaded,
  gen = 1,
  src = 'https://ipfs.io/ipfs/';
CA2 = '0xB9f856eaAfA84ED8Dc46E3F9fB78891C9f2Be67d';
CHAIN = 4;
img = {
  0: {
    1: 'bafkreiekrovk2y2giv3obc3wlqgzof4w35kvggabqlegghujlvagbglc6y',
    2: 'bafkreibhpstl6axw6gxjg3p5vcvmd4ub7ievsnn7kzh4v3cio77bi6p5li',
  },
  1: {
    0: 'bafkreihls74flpvqdxg2ckksqrpomea5kllfvsgpd5zq6drhjzukhscyu4',
    1: 'bafkreibfkmqhywmgu6bfecgwg3s5vs7fhcrb4w3r4hgki5acjxywur3po4',
    2: 'bafkreidolppy562ee567myxwleww4hjadtre6t3q43pe4tmvsn4r3h2n7i',
  },
  2: {
    0: 'bafkreicyt3paalz4kjzulaicxkfwa3bb7rjhplubrm63gifzxwkbzcrche',
    1: 'bafkreiecgao6l4osnnv4556yec363eogskt2lyesovugjjga66mryuzm5q',
    2: 'bafkreiav5lxuncubwx667nkisdyvxykhysmsnoagw4c7bgsgoll44au7cy',
  },
};
async function loadNFTs() {
  pi = await contract.PLAYERITEMS(acct).call();
  nfts = [];
  for (i = 0; i < 8; i++) {
    nfts[i] = [];
    if (i < 8) for (j = 0; j < pi.length / 7; j++) nfts[i][j] = pi[j * 7 + i];
  }
  for (i = 0; i < nfts[0].length; i++) {
    sex = nfts[4][i];
    nfts[7][i] = img[nfts[3][i]][sex];
    $('#myWH').append(
      `<p id="o${nfts[5][i]}"class="boxnft"><b>TWC #${nfts[5][i]}
      </b><br/>Parents : ${nfts[0][i]} + ${nfts[1][i]}<br/>Last breeded:${
        nfts[2][i] > 0
          ? moment(moment.unix(nfts[2][i])).fromNow()
          : 'Since forever'
      }<br/>Generation: ${nfts[3][i]} (${
        sex < 1 ? 'Egg' : sex < 2 ? 'Female' : 'Male'
      })
      <br/><img src="${src}${nfts[7][i]}${
        moment
          .duration(moment().diff(moment(moment.unix(nfts[2][i]))))
          .asSeconds() > /*60480*/ 0 &&
        nfts[6][i] > 0 &&
        sex > 0
          ? `"onclick="loadImg(${i})"class="nft`
          : `"class="nobreed`
      }">${
        sex < 1 ? `<br><a onclick="REVEAL(${nfts[5][i]})">Reveal</a>` : ``
      }</p> `
    );
  }
}
async function loadImg(p1) {
  s1 = `<img onclick="unloadImg()"src="${src}${nfts[7][p1]}"class="nft">`;
  if (breed1 == null) {
    $('#breed1').html(s1);
    breed1 = nfts[5][p1];
  } else if (breed2 == null) {
    $('#breed2').html(s1);
    breed2 = nfts[5][p1];
  }
  for (i = 0; i < nfts[0].length; i++) {
    p2 = nfts[1][i];
    p3 = nfts[0][i];
    p4 = nfts[5][p1];
    if (nfts[4][i] == nfts[4][p1] || nfts[3][i] != nfts[3][p1])
      $('#o' + nfts[5][i]).hide();
    if (p3 == p4) $(`#o${p2}`).hide();
    if (p2 == p4) $(`#o${p3}`).hide();
  }
  if (breed1 > 0 && breed2 > 0)
    await contract
      .gen(parseInt(nfts[3][p1]) + 1)
      .call()
      .then((d) => {
        $('#breed').html(`BREED (${d[1]}/${d[0]})`);
      });
  gen = parseInt(nfts[3][p1]) + 1;
}
async function unloadImg() {
  $('#breed1').empty();
  $('#breed2').empty();
  $('#breed').html('');
  breed1 = breed2 = null;
  gen = 0;
  for (i = 0; i < nfts[0].length; i++) $('#o' + nfts[5][i]).show();
}
async function MINT() {
  await contract.MINT(img[0][1]).send({
    from: acct,
    value: 0.0e18,
  });
  location.reload();
}
async function BREED() {
  if (owlWallet < 30) $('#breed').html(`Insufficient OWL Token`);
  else {
    await contract.BREED(breed1, breed2, img[0][gen]).send({
      from: acct,
    });
    location.reload();
  }
}
async function REVEAL(id) {
  sex = Math.floor(Math.random() * 2) + 1;
  txt = '"trait_type":"';
  ipfs = IpfsApi({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });
  pro = await new Promise((d) => {
    reader = new FileReader();
    reader.onloadend = () => {
      ipfs.add(ipfs.Buffer.from(reader.result)).then((files) => {
        d(files);
      });
    };
    reader.readAsArrayBuffer(
      new File(
        [
          `{"name":"TWC #${id}","description":"We are a green chip NFT that gives passive income and many offline perks. Find another gender to breed your baby owl now!","image":"ipfs://${
            img[gen][sex]
          }","attributes":[{"display_type":"number",${txt}Generation","value":${gen}},{${txt}Gender","value":"${
            sex == 0 ? 'Female' : 'Male'
          }"},{${txt}Parent 1","value":"${
            breed1 == null ? '' : 'TWC #' + breed1
          }"},{${txt}Parent 2","value":"${
            breed2 == null ? '' : 'TWC #' + breed2
          }"},{"display_type":"date",${txt}Hatched on","value":${Date.now()}}]}`,
        ],
        'application/json'
      )
    );
  });
  cid = pro[0].hash;
  await contract.REVEAL(id, sex, cid).send({
    from: acct,
  });
  location.reload();
}
async function display() {
  d = await contract.gen(1).call();
  count = await contract.count.call().call();
  owlWallet = (
    (await contract2.balanceOf(acct).call()) / 1e18
  ).toLocaleString();
  $('#mint').append(`(${d[1]} / ${d[0]})`);
  $('#name').append(
    `${
      (await contract.getBalance.call().call()) / 1e18
    } pool balance. Your Wallet: ${owlWallet} POT`
  );
}
(async () => {
  await load(
    [
      {
        inputs: [u1, u1, u5],
        name: 'BREED',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [u5],
        name: 'MINT',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [u3],
        name: 'PLAYERITEMS',
        outputs: [u2],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [u1, u1, u5],
        name: 'REVEAL',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'count',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [u1],
        name: 'gen',
        outputs: [u1, u1],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getBalance',
        outputs: [u1],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    '0x98F8CdA46159fA10583956C530D259929F0b6088'
  );
  await load2();
  display();
})();
$(document).ready(
  setInterval(async function () {
    if (typeof ethereum != 'undefined') {
      await web3.getAccounts().then((d) => {
        if (d.length > 0) {
          $('#connect').hide();
          $('#root').show();
          if (!loaded) {
            loadNFTs();
            loaded = true;
          }
        } else {
          $('#connect').show();
          $('#root').hide();
          $('#name').html(`<b>Whooli Hootie </b>`);
          $('#mint').html('MINT ');
        }
      });
    } else $('#connect').html('No Metamask');
  }, 1000)
);
