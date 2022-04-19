var myWH=new Array();
var breed1,breed2,gen,sex,cid,count; //count need to add 1 when minting

async function loadMyOwl(){
	const arr=await contract.methods.getWallet(await getCurrentAccount()).call();
	for(let i=0;i<arr.length;i++){
		myWH[i]=new Array();
		await contract.methods.owl(arr[i]).call().then(d=>{for(let j=0;j<6;j++)myWH[i][j]=d[j+1];}); //parent1 parent2 time gen sex cid
		await $.getJSON('https://ipfs.io/ipfs/'+myWH[i][5],function(d){
			myWH[i][6]=d.name;
			myWH[i][7]=d.image.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
			myWH[i][8]=arr[i]; //token id
		});
		var breedable;
		await contract.methods.gen(parseInt(myWH[i][3])+1).call().then(d=>{breedable=parseInt(d[0])>parseInt(d[1])});
		$('#myWH').append(
			'<p id="o'+arr[i]+'" class="boxnft"><b>'+myWH[i][6]+
			'</b><br/>Parents ID: '+myWH[i][0]+' + '+myWH[i][1]+
			'<br/>Last breeded: '+(myWH[i][2]>0?moment(moment.unix(myWH[i][2])).fromNow():'Since forever')+
			'<br/>Generation: '+myWH[i][3]+' ('+(myWH[i][4]==0?'Female':'Male')+')<br/><img src="'+myWH[i][7]+
			(moment.duration(moment().diff(moment(moment.unix(myWH[i][2])))).asSeconds()>/*60480*/0&&breedable==true?
				'" class="nft':
				'" class="nobreed')
			 +'"></p>'
		);
	}
}

async function hideOwls(p1){ //breeding hide function
	for(let i=0;i<myWH.length;i++){
			if(myWH[i][4]==myWH[p1][4]||myWH[i][3]!=myWH[p1][3])$('#o'+myWH[i][8]).hide();
			if(myWH[i][0]==myWH[p1][8])$('#o'+myWH[i][1]).hide();
			if(myWH[i][1]==myWH[p1][8])$('#o'+myWH[i][0]).hide();
	}
}

async function getCurrentAccount(){
	const accounts=await web3.eth.getAccounts();
	return accounts[0];
}

async function MINT(){
	gen=1;
	await contract.methods.MINT(sex,cid).send({
		from:await getCurrentAccount(),
		gas:250000,
		value:0000000000000000000 //0880000000000000000, DEPLOYMENT
	});
	location.reload();
}
async function BREED(){
	await contract.methods.BREED(breed1,breed2,sex,cid).send({
		from:await getCurrentAccount(),
		gas:400000,
		value:0000000000000000000 //0020000000000000000, DEPLOYMENT
	});
	location.reload();
}
async function load(){
	if(ethereum){
		web3=new Web3(ethereum);
		await window.ethereum.request({method: 'eth_requestAccounts'});
	}
	if(await web3.eth.net.getId()!=4){ //DEPLOYMENT change this and the one below to 1 as mainnet
		await ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x4'}]});
		location.reload();
	}else{
		contract=new web3.eth.Contract(
			[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"owner","type":"address"},{"indexed":!0,"internalType":"address","name":"approved","type":"address"},{"indexed":!0,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"owner","type":"address"},{"indexed":!0,"internalType":"address","name":"operator","type":"address"},{"indexed":!1,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"inputs":[{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"ATTACK","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"CLAIM","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_i","type":"uint256"}],"name":"MINT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_f","type":"address"},{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_f","type":"address"},{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"},{"internalType":"bytes","name":"_d","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"setAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_i","type":"uint256"},{"internalType":"uint256","name":"_l","type":"uint256"},{"internalType":"string","name":"_c","type":"string"}],"name":"setURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"from","type":"address"},{"indexed":!0,"internalType":"address","name":"to","type":"address"},{"indexed":!0,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_f","type":"address"},{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nft","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"item","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"player","outputs":[{"internalType":"uint256","name":"wood","type":"uint256"},{"internalType":"uint256","name":"metal","type":"uint256"},{"internalType":"uint256","name":"food","type":"uint256"},{"internalType":"uint256","name":"owl","type":"uint256"},{"internalType":"uint256","name":"soldier","type":"uint256"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"lastClaimed","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_t","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
		,'0x477d080042f1Fe29c2719080ae4A6ae0964e305f');
		$('#name').append(await contract.methods.name.call().call());
	}
}
var loaded=false;
async function isWeb3(){ //to check if metamask is connected or disconnnected
  await web3.eth.getAccounts().then(r=>{
    if(r.length>0){ 
			$('#connect').hide();
			$('#root').show();
			if(loaded==false){
				//loadMyOwl();
				loaded=true;
			}
    }else{
			$('#connect').show();
			$('#root').hide();
    }
  });
}
load();
setInterval(isWeb3,2000);
