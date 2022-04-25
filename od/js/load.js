var acct, wood, metal, food, owl, soldier, items, levels, img, loaded;

async function loadNFTs() {
  await contract
    .player(acct[0])
    .call()
    .then((d) => {
      wood = d[0];
      metal = d[1];
      food = d[2];
      owl = d[3];
      soldier = d[4];
    });
  $('#resources').html(
    `Wood: ${wood}<br>Metal: ${metal}<br>Food: ${food}<br>Owl: ${owl}<br>Soldier: ${soldier}`
  );
  await contract
    .PLAYERITEMS(acct[0])
    .call()
    .then((d) => {
      items = d[0];
      levels = d[1];
    });
  await $.getJSON('js/img.json', function (d) {
    img = d;
  });
  for (let i = 0; i < items.length; i++) {
    $('#nfts').append(
      `<img src="https://ipfs.io/ipfs/${img[items[i]][levels[i]]}"> `
    );
  }
}
async function MINT() {
  await contract.MINT($('#items').val()).send({
    from: acct[0],
    value: 0.0e18,
  });
  location.reload();
}
async function CLAIM() {
  await contract.MINT(acct[0]).send();
  location.reload();
}
async function load() {
  web3 = new Web3(ethereum);
  acct = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if ((await web3.eth.net.getId()) != 4) {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    });
    location.reload();
  } else {
    contract = new web3.eth.Contract(
      abi,
      '0x539b76C8307d50a249C1c3E38fa660372bBc44B9'
    );
    contract = contract.methods;
  }
}
async function isWeb3() {
  await web3.eth.getAccounts().then((d) => {
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
