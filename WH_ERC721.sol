pragma solidity ^0.8.7;//SPDX-License-Identifier:None

import "ERC721_SingleFile.sol";

contract WHOOLIHOOTIE is ERC721{
    uint256 private percent=5;
    address private _owner;
    uint256 public count=0;
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
    constructor(string memory name,string memory symbol) ERC721(name, symbol) {
        _owner=msg.sender;
        name="Whooli Hootie Conservation Club";
        symbol="WHCC";
        gen[1].maxCount=168;
        gen[2].maxCount=1680;//TESTING VARIABLES
    }
    function ownerOf(uint256 _c)public view override returns(address){
        return owl[_c].owner;
    }
    function tokenURI(uint256 _c)public view override returns(string memory){
        return string(abi.encodePacked("ipfs://",owl[_c].cid)); 
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
    function DISTRIBUTE()external onlyOwner{
        unchecked{
            for(uint256 i=1;i<=count;i++){
                (bool _z,)=payable(payable(owl[i].owner)).call{value:address(this).balance/count}("");
                require(_z);
            }
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
    function AIRDROP(address _a,uint256 _s,string memory _i)external onlyOwner{
        _mint(_a,1,_s,_i);
    }
    function MINT(uint256 _s,string memory _i)external payable{
        unchecked{
            require(msg.value>=0.00 ether); //[DEPLOYMENT SET TO 0.88]
            _mint(msg.sender,1,_s,_i);
            (bool _z,)=payable(_owner).call{value:msg.value*19/20}(""); //pay admin 95%
            require(_z);
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
            (bool _z,)=payable(_owner).call{value:msg.value/5}(""); //pay admin 20%
            require(_z);
        }
    }
} 