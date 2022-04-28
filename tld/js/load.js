//wood, metal, food, owl, soldier [DEVELOPMENT: set minting fee]
var loaded;
async function loadNFTs() {
  res = await cm.player(acct[0]).call();
  items = await cm.PLAYERITEMS(acct[0]).call();
  img = await $.getJSON('js/img.min.json');
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
  s = '<br>Random addresses:<br>';
  arr.forEach((e) => {
    s += `<a onclick="$(txtAtk).val('${e}')">${e}</a><br>`;
  });
  for (i = 0; i < items[0].length; i++)
    s += `<img src=https://ipfs.io/ipfs/${img[items[0][i]][items[1][i]]}> `;
  $('#res').html(
    `Light: ${res[0]} | Water: ${res[1]} | Soil: ${res[2]} | Tea Leaf: ${res[3]} | Mosquito: ${res[4]}<br>${s}`
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
      [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'a',
              type: 'address',
            },
          ],
          name: 'ATTACK',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'a',
              type: 'address',
            },
          ],
          name: 'CLAIM',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_i',
              type: 'uint256',
            },
          ],
          name: 'MINT',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'a',
              type: 'address',
            },
          ],
          name: 'PLAYERITEMS',
          outputs: [
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'a',
              type: 'address',
            },
          ],
          name: 'player',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
      ],
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
