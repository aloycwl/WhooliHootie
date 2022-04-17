pragma solidity^0.8.13;//SPDX-License-Identifier:None
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
contract WHCC is IERC721,IERC721Metadata{
    uint256 private percent=5;
    address private _owner;
    uint256 public count;
    struct OWL{
        address owner;
        uint256 parent1;
        uint256 parent2;
        uint256 time;
        uint256 gen;
        uint256 sex;
        string cid;
    }
    struct GEN{
        uint256 maxCount;
        uint256 currentCount;
    }
    mapping(uint256=>OWL)public owl;
    mapping(uint256=>GEN)public gen;
    mapping(address=>uint256[])public tokens;
    modifier onlyOwner(){
        require(_owner==msg.sender);_;
    }
    constructor(){
        _owner=msg.sender;
        gen[1].maxCount=168;
        gen[2].maxCount=1680;//TESTING VARIABLES
    }
    function supportsInterface(bytes4 _t)external pure returns(bool){
        return _t==type(IERC721).interfaceId||_t==type(IERC721Metadata).interfaceId;
    }
    function ownerOf(uint256 _c)external view returns(address){
        return owl[_c].owner;
    }
    function owner()external view returns(address){
        return _owner;
    }
    function name()external pure override returns(string memory){
        return"Whooli Hootie Conservation Club";
    }
    function symbol()external pure override returns(string memory){
        return"WHCC";
    }
    function tokenURI(uint256 _c)external view override returns(string memory){
        return string(abi.encodePacked("ipfs://",owl[_c].cid)); 
    }
    function safeTransferFrom(address _f,address _t,uint256 _c)external override{
        transferFrom(_f,_t,_c);
    }
    function safeTransferFrom(address _f,address _t,uint256 _c,bytes memory _d)external override{
        require(keccak256(abi.encodePacked(_d))==keccak256(abi.encodePacked(_d))); //to dismiss warning (+gasfee)
        transferFrom(_f,_t,_c);
    }
    function transferFrom(address _f,address _t,uint256 _c)public override{
        unchecked{
            require(owl[_c].owner==_f);
            for(uint256 i=0;i<tokens[_f].length;i++)if(tokens[_f][i]==_c){
                tokens[_f][i]=tokens[_f][tokens[_f].length-1];
                tokens[_f].pop();
                break;
            }
            tokens[_t].push(_c);
            owl[_c].parent1=0;
            owl[_c].parent2=0;
            owl[_c].owner=_t;
        }
        emit Transfer(_f,_t,_c);
    }
    function approve(address _t,uint256 _c)external override{
        emit Approval(owl[_c].owner,_t,_c);
    }
    function getApproved(uint256 _c)external view override returns(address){
        require(_c==_c); //to dismiss warning (+gasfee)
        return msg.sender;
    }
    function getWallet(address _a)external view returns(uint256[]memory){
        return tokens[_a];
    }
    function getBalance()external view returns(uint256){
        return address(this).balance;
    }
    function setPercent(uint256 _p)external onlyOwner(){
        percent=_p;
    }
    function GENPREP(uint256 _c, uint256 _x)external onlyOwner{
        gen[_c].maxCount=_x;
    }
    function DISTRIBUTE()external{
        unchecked{
            bool _s;
            for(uint256 i=1;i<=count;i++){
                (_s,)=payable(payable(owl[i].owner)).call{value:address(this).balance/count}("");
            }
            require(_s);
        }
    }
    function _mint(address _a, uint256 _g,uint256 _s,string memory _i)private{
        unchecked{
            require(gen[_g].currentCount<gen[_g].maxCount);
            count++;
            gen[_g].currentCount++;
            owl[count].owner=_a;
            owl[count].sex=_s;
            owl[count].cid=_i;
            owl[count].gen=_g;
            tokens[_a].push(count);
        }
        emit Transfer(address(0),msg.sender,count);
    }
    function WITHDRAW(uint256 _p)external onlyOwner{
        unchecked{
            (bool _s,)=payable(payable(_owner)).call{value:address(this).balance/_p*100}("");
            require(_s);
        }
    }
    function AIRDROP(address _a,uint256 _s,string memory _i)external onlyOwner{
        _mint(_a,1,_s,_i);
    }
    function MINT(uint256 _s,string memory _i)external payable{
        unchecked{
            require(msg.value>=0.00 ether); //[DEPLOYMENT SET TO 0.88]
            _mint(msg.sender,1,_s,_i);
        }
    }
    function BREED(uint256 _1,uint256 _2,uint256 _s,string memory _i)external payable{
        unchecked{
            require(msg.value>=0.00 ether); //[DEPLOYMENT SET TO 0.02]
            bool existed;
            for(uint256 i=0;tokens[msg.sender].length>i;i++){
                if(((owl[tokens[msg.sender][i]].parent1==_1&&owl[tokens[msg.sender][i]].parent2==_2)||
                (owl[tokens[msg.sender][i]].parent2==_1&&owl[tokens[msg.sender][i]].parent1==_2))){
                    existed=true;
                    break;
                }
            }
            require(!existed&& //never mint before
                owl[_1].gen==owl[_2].gen&& //must be same gen
                owl[_1].owner==msg.sender&&owl[_2].owner==msg.sender&& //must only owner of _1 and _2
                (owl[_1].sex==0&&owl[_2].sex==1||owl[_2].sex==0&&owl[_1].sex==1)&& //must be different sex
                owl[_1].time+0<block.timestamp&&owl[_2].time+0<block.timestamp);//time [DEPLOYMENT 604800]
            _mint(msg.sender,owl[_1].gen+1,_s,_i);
            owl[count].parent1=_1;
            owl[count].parent2=_2;
            owl[_1].time=block.timestamp;
            owl[_2].time=block.timestamp;
        }
    }
} 