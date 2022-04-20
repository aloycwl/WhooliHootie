var myWHp1,
  myWHp2,
  myWHtime,
  myWHgen,
  myWHsex,
  myWHid,
  myWHbreed,
  myWHimg = new Array(),
  breed1,
  breed2,
  gen,
  sex,
  cid,
  count,
  account;
const ipfs = IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
var img;

async function loadMyOwl() {
  await contract.methods
    .PLAYERITEMS(account)
    .call()
    .then((d) => {
      myWHp1 = d[0];
      myWHp2 = d[1];
      myWHtime = d[2];
      myWHgen = d[3];
      myWHsex = d[4];
      myWHid = d[5];
      myWHbreed = d[6];
    });
  for (let i = 0; i < myWHid.length; i++) {
    myWHimg[i] = img[myWHgen[i]][myWHsex[i]];
    $('#myWH').append(
      '<p id="o' +
        myWHid[i] +
        '" class="boxnft"><b>Whooli Hootie #' +
        myWHid[i] +
        '</b><br/>Parents ID: ' +
        myWHp1[i] +
        ' + ' +
        myWHp1[i] +
        '<br/>Last breeded: ' +
        (myWHtime[i] > 0
          ? moment(moment.unix(myWHtime[i])).fromNow()
          : 'Since forever') +
        '<br/>Generation: ' +
        myWHgen[i] +
        ' (' +
        (myWHsex[i] == 0 ? 'Female' : 'Male') +
        ')<br/><video autoplay loop muted src="https://ipfs.io/ipfs/' +
        myWHimg[i] +
        (moment
          .duration(moment().diff(moment(moment.unix(myWHtime[i]))))
          .asSeconds() > /*60480*/ 0 && myWHbreed[i] == 1
          ? '" onclick="loadImg(' + i + ')" class="nft'
          : '" class="nobreed') +
        '"></video></p> '
    );
  }
}
async function loadImg(p1) {
  //add for breeding, hide the rest of it
  const s1 =
    '<video autoplay loop muted onclick="unloadImg()" src="https://ipfs.io/ipfs/' +
    myWHimg[p1] +
    '" class="nft"></video>';
  if ($('#breed1').is(':empty')) {
    $('#breed1').html(s1);
    breed1 = myWHid[p1];
    hideOwls(p1);
  } else if ($('#breed2').is(':empty')) {
    $('#breed2').html(s1);
    breed2 = myWHid[p1];
    hideOwls(p1);
  } else return;
  if (!$('#breed1').is(':empty') && !$('#breed2').is(':empty')) {
    $('#breed').show();
    await contract.methods
      .gen(parseInt(myWHgen[p1]) + 1)
      .call()
      .then((d) => {
        $('#lblBreed').html('(' + d[1] + '/' + d[0] + ')');
      });
    gen = parseInt(myWHgen[p1]) + 1;
  }
}
async function hideOwls(p1) {
  //breeding hide function
  for (let i = 0; i < myWHid.length; i++) {
    if (myWHsex[i] == myWHsex[p1] || myWHgen[i] != myWHgen[p1])
      $('#o' + myWHid[i]).hide();
    if (myWHp1[i] == myWHid[p1]) $('#o' + myWHp2[i]).hide();
    if (myWHp2[i] == myWHid[p1]) $('#o' + myWHp1[i]).hide();
  }
}
async function unloadImg() {
  //reset to select others for breeding
  $('#breed1').empty();
  $('#breed2').empty();
  $('#lblBreed').empty();
  breed1 = null;
  breed2 = null;
  $('#breed').hide();
  for (let i = 0; i < myWHid.length; i++) $('#o' + myWHid[i]).show();
}
async function getCID() {
  //to input into minting
  sex = Math.floor(Math.random() * 2);
  const pro = await new Promise((d) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      ipfs.add(ipfs.Buffer.from(reader.result)).then((files) => {
        d(files);
      });
    };
    reader.readAsArrayBuffer(
      new File(
        [
          JSON.stringify({
            name: 'Whooli Hootie #' + (parseInt(count) + 1),
            description:
              'We are a green chip NFT that gives passive income and many offline perks. Find another gender to breed your baby owl now!',
            animation_url: 'ipfs://' + img[gen][sex],
            attributes: [
              { display_type: 'number', trait_type: 'Generation', value: gen },
              { trait_type: 'Gender', value: sex == 0 ? 'Female' : 'Male' },
              {
                trait_type: 'Parent 1',
                value: breed1 == null ? '' : 'WHCC #' + breed1,
              },
              {
                trait_type: 'Parent 2',
                value: breed2 == null ? '' : 'WHCC #' + breed2,
              },
              {
                display_type: 'date',
                trait_type: 'Hatched date',
                value: Date.now(),
              },
            ],
          }),
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
  await contract.methods.MINT(sex, cid).send({
    from: account,
    gas: 1000000,
    value: 0000000000000000000, //0880000000000000000, DEPLOYMENT
  });
  location.reload();
}
async function BREED() {
  await getCID();
  await contract.methods.BREED(breed1, breed2, sex, cid).send({
    from: await account,
    gas: 1000000,
    value: 0000000000000000000, //0020000000000000000, DEPLOYMENT
  });
  location.reload();
}
async function load() {
  if (ethereum) {
    web3 = new Web3(ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  if ((await web3.eth.net.getId()) != 4) {
    //DEPLOYMENT change this and the one below to 1 as mainnet
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    });
    location.reload();
  } else {
    contract = new web3.eth.Contract(
      abi,
      '0xD9B8883A657B63f90E0D95Bdd588908243DAB4FA'
    );
    $('#name').append(
      (await contract.methods.getBalance.call().call()) + ' balance'
    );
    await contract.methods
      .gen(1)
      .call()
      .then((d) => {
        $('#mint').append(d[1] + '/' + d[0] + ')');
      });
    count = await contract.methods.count.call().call();
    await $.getJSON('js/img.json', function (d) {
      img = d;
    });
  }
}
var loaded = false;
async function isWeb3() {
  //to check if metamask is connected or disconnnected
  await web3.eth.getAccounts().then((d) => {
    account = d[0];
    if (d.length > 0) {
      $('#connect').hide();
      $('#root').show();
      if (loaded == false) {
        loadMyOwl();
        loaded = true;
      }
    } else {
      $('#connect').show();
      $('#root').hide();
    }
  });
}
load();
setInterval(isWeb3, 2000);
