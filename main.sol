/******************************************************************************
ERC721AC uses generic ERC721 with minimum necessary functions and 
refactored coding to minimise gas fee and editability.
Created by Aloysius Chan (AC).
******************************************************************************/
pragma solidity ^0.8.13;//SPDX-License-Identifier:None
interface IERC721{
    event Transfer(address indexed from,address indexed to,uint256 indexed tokenId);
    event Approval(address indexed owner,address indexed approved,uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner,address indexed operator,bool approved);
    function safeTransferFrom(address from,address to,uint256 tokenId)external;
    function safeTransferFrom(address from,address to,uint256 tokenId,bytes calldata data)external;
    function transferFrom(address from,address to,uint256 tokenId)external;
    function approve(address to,uint256 tokenId)external;
    function getApproved(uint256 tokenId)external view returns(address operator);
}
interface IERC721Metadata{
    function name()external pure returns(string memory);
    function symbol()external pure returns(string memory);
    function tokenURI(uint256 tokenId)external view returns(string memory);
}
contract ERC721AC is IERC721,IERC721Metadata{
    //uint256 constant MAXSUPPLY=18;  //[DEPLOYMENT SET TO 1849]
    //uint256 constant GEN1MAX=7;     //[DEPLOYMENT SET TO 169]
    uint256 constant WAITINGTIME=0; //[DEPLOYMENT SET TO 604800 (1 WEEK)]
    uint256 constant COST=0 ether;  //[DEPLOYMENT SET TO 0.88]
    //uint256 public count=0;
    uint256 percent=5;
    bool paused=false;
    bool breedable=true;
    address internal _owner;
    struct AC{
        address owner;
        uint256 parent1;
        uint256 parent2;
        uint256 time;
        uint256 generation;
        uint256 gender;
    }
    struct GENERATION{
        uint256 maxCount;
        uint256 currentCount;
    }
    mapping(uint256=>AC)public ac;  //change back to private
    mapping(uint256=>GENERATION)private age;
    mapping(address=>uint256[])internal tokens;
    mapping(uint256=>mapping(uint256=>string))internal baseURIs; //generation: 1 onwards, gender: 1-f/2-m
    modifier onlyOwner(){
        require(_owner==msg.sender);_;
    }
    constructor(){
        _owner=msg.sender;
        age[1].maxCount=7;
        age[2].maxCount=16;
    }
    function supportsInterface(bytes4 t)external pure returns(bool){
        return t==type(IERC721).interfaceId||t==type(IERC721Metadata).interfaceId;
    }
    function ownerOf(uint256 tokenId)public view returns(address){
        return ac[tokenId].owner;
    }
    function name()external pure override returns(string memory){
        return"Noctural-Owl-Club";
    }
    function symbol()external pure override returns(string memory){
        return"NOC";
    }
    function tokenURI(uint256 _t)external view override virtual returns(string memory){
        uint256 temp=_t;
        uint256 digits;
        while(temp!=0){
            digits++;
            temp/=10;
        }
        temp=_t;
        bytes memory buffer=new bytes(digits);
        while(temp!=0){
            digits-=1;
            buffer[digits]=bytes1(uint8(48+uint256(_t%10)));
            temp/=10;
        }
        return string(abi.encodePacked(baseURIs[ac[_t].generation][ac[_t].gender],_t>0?string(buffer):"0",".json"));
    }
    function safeTransferFrom(address from,address to,uint256 t)external override{
        transferFrom(from,to,t);
    }
    function safeTransferFrom(address from,address to,uint256 t,bytes memory _data)external override{
        transferFrom(from,to,t);
    }
    function transferFrom(address from,address to,uint256 _t)public override{
        require(from==msg.sender);
        for(uint256 i=0;i<tokens[from].length;i++)if(tokens[from][i]==_t){
            tokens[from][i]=tokens[from][tokens[from].length-1];
            tokens[from].pop();
            break;
        }
        tokens[to].push(_t);
        ac[_t].owner=to;
        emit Transfer(from,to,_t);
    }
    function approve(address to,uint256 t)external override{
        emit Approval(ac[t].owner,to,t);
    }
    function getApproved(uint256 t)external view override returns(address){
        return msg.sender;
    }
    function Mint(address _a, uint256 _generation)internal{
        unchecked{
            age[_generation].currentCount++;
            ac[age[_generation].currentCount].owner=_a;
            ac[age[_generation].currentCount].gender=
                uint256(keccak256(abi.encodePacked(block.timestamp)))%10>(_generation==1?4:8)?1:2;
            ac[age[_generation].currentCount].generation=_generation;
            tokens[_a].push(age[_generation].currentCount);
        }
        emit Transfer(address(0),msg.sender,age[_generation].currentCount);
        
    }
    function getOwnerWallet()public view returns(uint256[]memory){
        return tokens[msg.sender];
    }
    function ContractWalletBalance()external view returns(uint256){
        return address(this).balance;
    }
    function setAirdrop(address airdropAddress)external onlyOwner{
        Mint(airdropAddress,1);
    }
    function setBaseURI(uint256 _generation,uint256 _gender,string memory _str)external onlyOwner{
        baseURIs[_generation][_gender]=_str;
    }
    function setBreed(bool _state)external onlyOwner{
        breedable=_state;
    }
    function setDistribute()external{
        for(uint256 i=1;i<=count;i++){
            (bool success,)=payable(payable(ownerOf(i))).call{value:address(this).balance/count}("");
            require(success);
        }
    }
    function setPause(bool _state)external onlyOwner{
        paused=_state;
    }
    function setPercent(uint256 _newPercentage)external onlyOwner(){
        percent=_newPercentage;
    }
    function mint()external payable{
        require(!paused&&age[1].currentCount<=age[1].maxCount&&msg.value>=COST);
        Mint(msg.sender,1);
        for(uint256 i=1;i<=count;i++){
            (bool success,)=payable(payable(ownerOf(i))).call{value:address(this).balance*percent/100/count}("");
            require(success);
        }
        (bool os,)=payable(_owner).call{value:address(this).balance}("");
        require(os);
    }
    function breed(uint256 p1,uint256 p2)external{
        bool existed;
        //for(uint256 i=GEN1MAX;i<MAXSUPPLY;i++)
        //    existed=(ac[i].parent1==p1&&ac[i].parent2==p2)||(ac[i].parent1==p2&&ac[i].parent2==p1)?true:false;
        // change breed 
        require(!paused&&
        breedable&&
        count+1<MAXSUPPLY&&
        ownerOf(p1)==msg.sender&&
        ownerOf(p2)==msg.sender&&
        AC[p1].generation==AC[p2].generation&&
        ac[p1].time+WAITINGTIME<block.timestamp&&
        ac[p2].time+WAITINGTIME<block.timestamp&&
        (ac[p1].gender==1&&ac[p2].gender==2)||(ac[p2].gender==1&&ac[p1].gender==2)&&
        !existed);
        Mint(msg.sender,2);
        ac[count].parent1=p1;
        ac[count].parent2=p2;
        ac[p1].time=block.timestamp;
        ac[p2].time=block.timestamp;
    }
  /* 
     UAT Preparation
     1. test to all 168 gen1 mint + airdrop
     2. test to all 1680 gen2 breed
     3. opensea transfer
     4. private transfer
     5. test above 168 gen1 (less airdrop)
     6. test above 1680 breed
     7. test same sex breed
     8. test cross gen breed
     9. test gen2 breed
     10. test 1 week breed
     11. test breeded before same owner
     12. test is owner of parent1 and parent2
     13. test pause (boolean)
     14. test breadable (boolean)
     15. distributable (opensea to admin)
     16. minting distributable
  */
} 
