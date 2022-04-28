//wood, metal, food, owl, soldier [DEVELOPMENT: set minting fee]
var loaded;
async function loadNFTs() {
  res = await cm.player(acct[0]).call();
  items = await cm.PLAYERITEMS(acct[0]).call();
  await $.getJSON('js/img.min.json', function (d) {
    img = d;
  });
  s = '<br>Random addresses:<br>';
  arr = new Array();
  await contract
    .getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest',
    })
    .then((events) => {
      events.forEach((event) => {
        e = event.returnValues.to;
        if (!arr.includes(e)) arr.push(e);
      });
    });
  arr.forEach(async (e) => {
    s += `<a onclick="$(txtAtk).val('${e}')">${e}</a><br>`;
  });
  for (i = 0; i < items[0].length; i++)
    s += `<img src=https://ipfs.io/ipfs/${img[items[0][i]][items[1][i]]}> `;
  $('#res').html(
    `Wood: ${res[0]} | Metal: ${res[1]} | Food: ${res[2]} | Owl: ${res[3]} | Soldier: ${res[4]}<br>${s}`
  );
}
function r() {
  location.reload();
}
async function MINT() {
  await cm.MINT($('#items').val()).send({
    from: acct[0],
    value: 0.0e18,
  });
  r();
}
async function CLAIM() {
  await cm.CLAIM(acct[0]).send({
    from: acct[0],
  });
  r();
}
async function ATTACK() {
  await cm.CLAIM($('#txtAtk').val()).send({
    from: acct[0],
  });
  r();
}
async function load() {
  web3 = new Web3(ethereum);
  web3 = web3.eth;
  acct = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if ((await web3.net.getId()) != 4) {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    });
    r();
  } else {
    contract = new web3.Contract(
      abi,
      '0x9Bc8cDA64E91f3D3aED509278Eea321BF54f2B95'
    );
  }
  cm = contract.methods;
}
async function isWeb3() {
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
    }
  });
}
setInterval(isWeb3, 1000);
load();
