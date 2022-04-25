//p1,p2,time,gen,sex,id,breed,img [DEPLOYMENT: set price, set mainnet]
var nfts,
  breed1,
  breed2,
  gen,
  sex,
  cid,
  count,
  acct,
  loaded,
  owlWallet,
  img,
  src = 'https://ipfs.io/ipfs/';

async function loadMyOwl() {
  nfts = await contract.PLAYERITEMS(acct[0]).call();
  nfts[7] = new Array();
  for (let i = 0; i < nfts[0].length; i++) {
    nfts[7][i] = img[nfts[3][i]][nfts[4][i]];
    $('#myWH').append(
      `<p id="o${nfts[5][i]}"class="boxnft"><b>Whooli Hootie #${
        nfts[5][i]
      }</b><br/>Parents : ${nfts[0][i]} + ${nfts[1][i]}<br/>Last breeded: ${
        nfts[2][i] > 0
          ? moment(moment.unix(nfts[2][i])).fromNow()
          : 'Since forever'
      }<br/>Generation: ${nfts[3][i]} (${
        nfts[4][i] == 0 ? 'Female' : 'Male'
      })<br/><video autoplay loop muted src="${src}${nfts[7][i]}${
        moment
          .duration(moment().diff(moment(moment.unix(nfts[2][i]))))
          .asSeconds() > /*60480*/ 0 && nfts[6][i] == 1
          ? `"onclick="loadImg(${i})"class="nft`
          : `"class="nobreed`
      }"></video></p> `
    );
  }
}
async function loadImg(p1) {
  var s1 = `<video autoplay loop muted onclick="unloadImg()"src="${src}${nfts[7][p1]}"class="nft"></video>`;
  if (breed1 == null) {
    $('#breed1').html(s1);
    breed1 = nfts[5][p1];
  } else if (breed2 == null) {
    $('#breed2').html(s1);
    breed2 = nfts[5][p1];
  }
  for (let i = 0; i < nfts[0].length; i++) {
    var p2 = nfts[1][i],
      p3 = nfts[0][i],
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
  for (let i = 0; i < nfts[0].length; i++) $('#o' + nfts[5][i]).show();
}
async function getCID() {
  sex = Math.floor(Math.random() * 2);
  var txt = '"trait_type":"',
    ipfs = IpfsApi({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    }),
    pro = await new Promise((d) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        ipfs.add(ipfs.Buffer.from(reader.result)).then((files) => {
          d(files);
        });
      };
      reader.readAsArrayBuffer(
        new File(
          [
            `{"name":"Whooli Hootie #${
              parseInt(count) + 1
            }","description":"We are a green chip NFT that gives passive income and many offline perks. Find another gender to breed your baby owl now!","animation_url":"ipfs://${
              img[gen][sex]
            }","attributes":[{"display_type":"number",${txt}Generation","value":${gen}},{${txt}Gender","value":"${
              sex == 0 ? 'Female' : 'Male'
            }"},{${txt}Parent 1","value":"${
              breed1 == null ? '' : 'WHCC #' + breed1
            }"},{${txt}Parent 2","value":"${
              breed2 == null ? '' : 'WHCC #' + breed2
            }"},{"display_type":"date",${txt}Hatched on","value":${Date.now()}}]}`,
          ],
          'application/json'
        )
      );
    });
  cid = pro[0].hash;
}
async function MINT() {
  gen = 1;
  await getCID();
  await contract.MINT(sex, cid).send({
    from: acct[0],
    value: 0.0e18,
  });
  location.reload();
}
async function BREED() {
  if (owlWallet < 30) $('#breed').html(`Insufficient OWL Token`);
  else {
    await getCID();
    await contract.BREED(breed1, breed2, sex, cid).send({
      from: acct[0],
    });
    location.reload();
  }
}
async function load() {
  img = $.getJSON('js/img.min.json', function (d) {
    img = d;
  });
  if (ethereum) {
    web3 = new Web3(ethereum);
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    if ((await web3.eth.net.getId()) != 4) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
      location.reload();
    }
    contract = new web3.eth.Contract(
      abi,
      '0xD120D29947BCb41812Dc6e7AbA2782E7c8237F36'
    );
    contract = contract.methods;
    contract2 = new web3.eth.Contract(
      abi2,
      '0x34A85f092877F93584ab9f4fe9aE2FFA8C846B1F'
    );
    var d = await contract.gen(1).call();
    count = await contract.count.call().call();
    owlWallet = (await contract2.methods.balanceOf(acct[0]).call()) / 1e18;
    $('#mint').append(`${d[1]} / ${d[0]})`);
    $('#name').append(
      `${
        (await contract.getBalance.call().call()) / 1e18
      } balance. Owl Wallet: ${owlWallet}`
    );
    $('#connect').hide();
  } else $('#connect').html('No Metamask');
}
async function isWeb3() {
  await web3.eth.getAccounts().then((d) => {
    if (d.length > 0) {
      $('#connect').hide();
      $('#root').show();
      if (!loaded) {
        loadMyOwl();
        loaded = true;
      }
    } else {
      $('#connect').show();
      $('#root').hide();
      $('#name').html(`<b>Whooli Hootie </b>`);
      $('#mint').html('MINT (');
    }
  });
}
setInterval(isWeb3, 1000);
load();
