var myWH=new Array();
var breed1,breed2,gen,sex,cid,count; //count need to add 1 when minting
const ipfs=IpfsApi({host:'ipfs.infura.io',port:5001,protocol:'https'});

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
				'" onclick="loadImg('+i+')" class="nft':
				'" class="nobreed')
			 +'"></p>'
		);
	}
}
async function loadImg(p1){ //add for breeding, hide the rest of it 
	const s1='<img onclick="unloadImg()" src="'+myWH[p1][7]+'" class="nft">';
	if($('#breed1').is(':empty')){
		$('#breed1').html(s1);
		breed1=myWH[p1][8];
		hideOwls(p1);
	}else if($('#breed2').is(':empty')){
		$('#breed2').html(s1);
		breed2=myWH[p1][8];
		hideOwls(p1);
	}else return;
	if(!$('#breed1').is(':empty')&&!$('#breed2').is(':empty')){
		$('#breed').show();
		await contract.methods.gen(parseInt(myWH[p1][3])+1).call().then(d=>{$('#lblBreed').html('('+d[1]+'/'+d[0]+')')});
		gen=parseInt(myWH[p1][3])+1;
	}
}
async function hideOwls(p1){ //breeding hide function
	for(let i=0;i<myWH.length;i++){
			if(myWH[i][4]==myWH[p1][4]||myWH[i][3]!=myWH[p1][3])$('#o'+myWH[i][8]).hide();
			if(myWH[i][0]==myWH[p1][8])$('#o'+myWH[i][1]).hide();
			if(myWH[i][1]==myWH[p1][8])$('#o'+myWH[i][0]).hide();
	}
}
async function unloadImg(){ //reset to select others for breeding
	$('#breed1').empty();
	$('#breed2').empty();
	$('#lblBreed').empty();
	breed1=null;
	breed2=null;
	$('#breed').hide();
	for(let i=0;i<myWH.length;i++)$('#o'+myWH[i][8]).show();
}
async function getCurrentAccount(){
	const accounts=await web3.eth.getAccounts();
	return accounts[0];
}
async function getCID(){ //to input into minting
	sex=Math.floor(Math.random()*2);
	var img;
	await $.getJSON('https://aloycwl.github.io/WhooliHootie/img.json',function(d){img=d.g[gen].s[sex]});
  const pro=await new Promise((d)=>{
    const reader=new FileReader();
    reader.onloadend=()=>{ipfs.add(ipfs.Buffer.from(reader.result)).then(files=>{d(files)});};
    reader.readAsArrayBuffer(new File([JSON.stringify({
    "name":"Whooli Hootie #"+(parseInt(count)+1),
    "description":"We are a green chip NFT that gives passive income and many offline perks. Find another gender to breed your baby owl now!",
    "image":"ipfs://"+img,
    "date":Date.now(),
    "attributes":[
      {"trait_type":"Generation","value":gen},
      {"trait_type":"Gender","value":sex==0?"Female":"Male"},
      {"trait_type":"Parent1","value":breed1==null?"":"WHCC #"+breed1},
      {"trait_type":"Parent2","value":breed2==null?"":"WHCC #"+breed2}]
    })],'application/json'));
  });
  cid=pro[0].hash;
}
async function MINT(){
	gen=1;
	await getCID(); 
	await contract.methods.MINT(sex,cid).send({
		from:await getCurrentAccount(),
		gas:250000,
		value:0000000000000000000 //0880000000000000000, DEPLOYMENT
	});
	location.reload();
}
async function BREED(){
	await getCID();
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
			[{"inputs":[{"internalType":"address","name":"_a","type":"address"},{"internalType":"uint256","name":"_s","type":"uint256"},{"internalType":"string","name":"_i","type":"string"}],"name":"AIRDROP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"owner","type":"address"},{"indexed":!0,"internalType":"address","name":"approved","type":"address"},{"indexed":!0,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"owner","type":"address"},{"indexed":!0,"internalType":"address","name":"operator","type":"address"},{"indexed":!1,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"inputs":[{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_1","type":"uint256"},{"internalType":"uint256","name":"_2","type":"uint256"},{"internalType":"uint256","name":"_s","type":"uint256"},{"internalType":"string","name":"_i","type":"string"}],"name":"BREED","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"DISTRIBUTE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_c","type":"uint256"},{"internalType":"uint256","name":"_x","type":"uint256"}],"name":"GENPREP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_s","type":"uint256"},{"internalType":"string","name":"_i","type":"string"}],"name":"MINT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_f","type":"address"},{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_f","type":"address"},{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"},{"internalType":"bytes","name":"_d","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_p","type":"uint256"}],"name":"setPercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"from","type":"address"},{"indexed":!0,"internalType":"address","name":"to","type":"address"},{"indexed":!0,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_f","type":"address"},{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"gen","outputs":[{"internalType":"uint256","name":"maxCount","type":"uint256"},{"internalType":"uint256","name":"currentCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"getWallet","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"owl","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"parent1","type":"uint256"},{"internalType":"uint256","name":"parent2","type":"uint256"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"gen","type":"uint256"},{"internalType":"uint256","name":"sex","type":"uint256"},{"internalType":"string","name":"cid","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_t","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_c","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
		,'0xAEd04EEfEcd6dFd10e1d7E337DcE933b63980913');
		$('#name').append(await contract.methods.name.call().call()+' - '+await contract.methods.getBalance.call().call()+' balance');
		await contract.methods.gen(1).call().then(d=>{$('#mint').append(d[1]+'/'+d[0]+')')});
		count=await contract.methods.count.call().call();
	}
}
var loaded=false;
async function isWeb3(){ //to check if metamask is connected or disconnnected
  await web3.eth.getAccounts().then(r=>{
    if(r.length>0){ 
			$('#connect').hide();
			$('#root').show();
			if(loaded==false){
				loadMyOwl();
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