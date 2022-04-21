var account,wood,metal,food,owl,soldier,items,levels,jsonimg;

async function loadNFTs(){
	await contract.methods.player(account).call().then(d=>{wood=d[0];metal=d[1];food=d[2];owl=d[3];soldier=d[4]});
  $("#resources").html("Wood: "+wood+
      "<br>Metal: "+metal+
      "<br>Food: "+food+
      "<br>Owl: "+owl+
      "<br>Soldier: "+soldier);
  await contract.methods.PLAYERITEMS(account).call().then(d=>{items=d[0];levels=d[1];});
  await $.getJSON('https://aloycwl.github.io/omg_frontend/od/js/img.json',function(d){jsonimg=d});
  for(let i=0;i<items.length;i++){
    $("#nfts").append('<img src="https://cloudflare-ipfs.com/ipfs/'+jsonimg[items[i]][levels[i]]+'"> ');
  }
}
async function MINT(){
	await contract.methods.MINT($("#items").val()).send({
		from:account,
		value:0000000000000000000 //0880000000000000000, DEPLOYMENT
	});
	location.reload();
}
async function CLAIM(){
	await contract.methods.MINT(account).send();
	location.reload();
}
async function load(){
	web3=new Web3(ethereum);
	await window.ethereum.request({method:'eth_requestAccounts'});
	if(await web3.eth.net.getId()!=4){ //DEPLOYMENT change this and the one below to 1 as mainnet
		await ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x4'}]});
		location.reload();
	}else{
		contract=new web3.eth.Contract(
			abi
		,'0x539b76C8307d50a249C1c3E38fa660372bBc44B9');
	}
}
var loaded=false;
async function isWeb3(){ //to check if metamask is connected or disconnnected
  await web3.eth.getAccounts().then(d=>{
    if(d.length>0){ 
      account=d[0];
			$('#connect').hide();
			$('#root').show();
			if(loaded==false){
				loadNFTs();
				loaded=true;
			}
    }else{
			$('#connect').show();
			$('#root').hide();
    }
  });
}
setInterval(isWeb3,2000);
load();