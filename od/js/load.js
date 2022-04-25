//wood, metal, food, owl, soldier [DEVELOPMENT: set minting fee]
var acct, res, items, img, loaded;

async function loadNFTs() {
  res = await contract.player(acct[0]).call();
  $('#resources').html(
    `Wood: ${res[0]}<br>Metal: ${res[1]}<br>Food: ${res[2]}<br>Owl: ${res[3]}<br>Soldier: ${res[4]}`
  );
  items = await contract.PLAYERITEMS(acct[0]).call();
  await $.getJSON('js/img.min.json', function (d) {
    img = d;
  });
  for (let i = 0; i < items[0].length; i++)
    $('#nfts').append(
      `<img src="https://ipfs.io/ipfs/${img[items[0][i]][items[1][i]]}"> `
    );
}
async function MINT() {
  await contract.MINT($('#items').val()).send({
    from: acct[0],
    value: 0.0e18,
  });
  location.reload();
}
async function CLAIM() {
  await contract.CLAIM(acct[0]).send({
    from: acct[0],
  });
  location.reload();
}
async function ATTACK() {
  await contract.CLAIM($('#txtAtk').val()).send({
    from: acct[0],
  });
  location.reload();
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
    location.reload();
  } else {
    contract = new web3.Contract(
      abi,
      '0x9Bc8cDA64E91f3D3aED509278Eea321BF54f2B95'
    );
    contract = contract.methods;
  }
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
