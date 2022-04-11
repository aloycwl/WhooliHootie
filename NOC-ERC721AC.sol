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
contract WHOOLIHOOTIEERC721AC is IERC721,IERC721Metadata{
    uint256 private percent=5;
    address private _owner;
    uint256 private count=0;
    struct AC{
        address owner;
        uint256 parent1;
        uint256 parent2;
        uint256 time;
        uint256 gen;
        uint256 sex;
    }
    struct GEN{
        uint256 maxCount;
        uint256 currentCount;
        bool breedable;
        string[2]baseURI; //sex:0-f/1-m
    }
    mapping(uint256=>AC)public ac;
    mapping(uint256=>GEN)public age;
    mapping(address=>uint256[])public tokens;
    modifier onlyOwner(){
        require(_owner==msg.sender);_;
    }
    constructor(){
        _owner=msg.sender;
        age[1].maxCount=168; //TESTING VARIABLES STARTS
        age[1].breedable=true;
        age[1].baseURI[0]="http://somedomain.com/gen1female/";
        age[1].baseURI[1]="http://somedomain.com/gen1male/";
        age[2].maxCount=1680;
        age[2].breedable=true;
        age[2].baseURI[0]="http://somedomain.com/gen2female/";
        age[2].baseURI[1]="http://somedomain.com/gen2male/";
    }
    function supportsInterface(bytes4 _t)external pure returns(bool){
        return _t==type(IERC721).interfaceId||_t==type(IERC721Metadata).interfaceId;
    }
    function ownerOf(uint256 _c)external view returns(address){
        return ac[_c].owner;
    }
    function name()external pure override returns(string memory){
        return"Whooli Hootie Conservation Club";
    }
    function symbol()external pure override returns(string memory){
        return"WHCC";
    }
    function tokenURI(uint256 _c)external view override returns(string memory){
        unchecked{
            uint256 temp=_c;
            uint256 digits;
            while(temp!=0){
                digits++;
                temp/=10;
            }
            temp=_c;
            bytes memory buffer=new bytes(digits);
            while(temp!=0){
                digits-=1;
                buffer[digits]=bytes1(uint8(48+uint256(_c%10)));
                temp/=10;
            }
            return string(abi.encodePacked(age[ac[_c].gen].baseURI[ac[_c].sex],_c>0?string(buffer):"0",".json")); 
        }
    }
    function safeTransferFrom(address _f,address _t,uint256 _c)external override{
        transferFrom(_f,_t,_c);
    }
    function safeTransferFrom(address _f,address _t,uint256 _c,bytes memory _d)external override{
        transferFrom(_f,_t,_c);
    }
    function transferFrom(address _f,address _t,uint256 _c)public override{
        unchecked{
            require(ac[_c].owner==_f);
            for(uint256 i=0;i<tokens[_f].length;i++)if(tokens[_f][i]==_c){
                tokens[_f][i]=tokens[_f][tokens[_f].length-1];
                tokens[_f].pop();
                break;
            }
            tokens[_t].push(_c);
            ac[_c].parent1=0;
            ac[_c].parent2=0;
            ac[_c].owner=_t;
        }
        emit Transfer(_f,_t,_c);
    }
    function approve(address _t,uint256 _c)external override{
        emit Approval(ac[_c].owner,_t,_c);
    }
    function getApproved(uint256 _c)external view override returns(address){
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
    function GENPREP(uint256 _c, bool _b, uint256 _x, string memory _f, string memory _m)external onlyOwner{
        age[_c].breedable=_b;
        age[_c].maxCount=_x;
        age[_c].baseURI[0]=_f;
        age[_c].baseURI[1]=_m;
    }
    function DISTRIBUTE()external onlyOwner{
        unchecked{
            for(uint256 i=1;i<=count;i++){
                payable(payable(ac[i].owner)).call{value:address(this).balance/count}("");
            }
        }
    }
    function _mint(address _a, uint256 _g)private{
        unchecked{
            require(age[_g].currentCount<age[_g].maxCount&&age[_g].breedable);
            count++;
            age[_g].currentCount++;
            ac[count].owner=_a;
            ac[count].sex=uint256(keccak256(abi.encodePacked(block.timestamp)))%2;
            ac[count].gen=_g;
            tokens[_a].push(count);
        }
        emit Transfer(address(0),msg.sender,count);
    }
    function AIRDROP(address _a)external onlyOwner{
        _mint(_a,1);
    }
    function MINT()external payable{
        unchecked{
            require(msg.value>=0.00 ether); //[DEPLOYMENT SET TO 0.88]
            _mint(msg.sender,1);
            payable(_owner).call{value:msg.value*19/20}(""); //pay admin 95%
        }
    }
    function BREED(uint256 _1,uint256 _2)external payable{
        unchecked{
            require(msg.value>=0.00 ether); //[DEPLOYMENT SET TO 0.02]
            bool existed;
            for(uint256 i=0;tokens[msg.sender].length>i;i++){
                if(((ac[tokens[msg.sender][i]].parent1==_1&&ac[tokens[msg.sender][i]].parent2==_2)||
                (ac[tokens[msg.sender][i]].parent2==_1&&ac[tokens[msg.sender][i]].parent1==_2))){
                    existed=true;
                    break;
                }
            }
            require(!existed&& //never mint before
                ac[_1].gen==ac[_2].gen&& //must be same gen
                ac[_1].owner==msg.sender&&ac[_2].owner==msg.sender&& //must only owner of _1 and _2
                (ac[_1].sex==0&&ac[_2].sex==1||ac[_2].sex==0&&ac[_1].sex==1)&& //must be different sex
                ac[_1].time+0<block.timestamp&&ac[_2].time+0<block.timestamp);//time [DEPLOYMENT 604800]
            _mint(msg.sender,ac[_1].gen+1);
            ac[count].parent1=_1;
            ac[count].parent2=_2;
            ac[_1].time=block.timestamp;
            ac[_2].time=block.timestamp;
            payable(_owner).call{value:msg.value/5}(""); //pay admin 20%
        }
    }
} 