pragma solidity^0.8.13;//SPDX-License-Identifier:Unlicensed

interface IERC165{function supportsInterface(bytes4 interfaceId)external view returns(bool);}
interface IERC721 is IERC165{event Transfer(address indexed from,address indexed to,uint256 indexed tokenId);event Approval(address indexed owner,address indexed approved,uint256 indexed tokenId);event ApprovalForAll(address indexed owner,address indexed operator,bool approved);function balanceOf(address owner)external view returns(uint256 balance);function ownerOf(uint256 tokenId)external view returns(address owner);function safeTransferFrom(address from,address to,uint256 tokenId)external;function transferFrom(address from,address to,uint256 tokenId)external;function approve(address to,uint256 tokenId)external;function getApproved(uint256 tokenId)external view returns(address operator);function setApprovalForAll(address operator,bool _approved)external;function isApprovedForAll(address owner,address operator)external view returns(bool);function safeTransferFrom(address from,address to,uint256 tokenId,bytes calldata data)external;}
interface IERC721Metadata is IERC721{function name()external view returns(string memory);function symbol()external view returns(string memory);function tokenURI(uint256 tokenId)external view returns(string memory);}
interface IERC721Receiver{function onERC721Received(address operator,address from,uint256 tokenId,bytes calldata data)external returns(bytes4);}
interface IERC721Enumerable is IERC721{function totalSupply()external view returns(uint256);function tokenOfOwnerByIndex(address owner,uint256 index)external view returns(uint256 tokenId);function tokenByIndex(uint256 index)external view returns(uint256);}
library Address{function isContract(address account)internal view returns(bool){uint256 size;assembly{size:=extcodesize(account)}return size>0;}function sendValue(address payable recipient,uint256 amount)internal{require(address(this).balance>=amount);(bool success,)=recipient.call{value:amount}("");require(success);}function functionCall(address target,bytes memory data)internal returns(bytes memory){return functionCall(target,data);}function functionCall(address target,bytes memory data,string memory errorMessage)internal returns(bytes memory){return functionCallWithValue(target,data,0,errorMessage);}function functionCallWithValue(address target,bytes memory data,uint256 value)internal returns(bytes memory){return functionCallWithValue(target,data,value);}function functionCallWithValue(address target,bytes memory data,uint256 value,string memory errorMessage)internal returns(bytes memory){require(address(this).balance>=value);require(isContract(target));(bool success,bytes memory returndata)=target.call{value:value}(data);return verifyCallResult(success,returndata,errorMessage);}function functionStaticCall(address target,bytes memory data)internal view returns(bytes memory){return functionStaticCall(target,data);}function functionStaticCall(address target,bytes memory data,string memory errorMessage)internal view returns(bytes memory){require(isContract(target));(bool success,bytes memory returndata)=target.staticcall(data);return verifyCallResult(success,returndata,errorMessage);}function functionDelegateCall(address target,bytes memory data)internal returns(bytes memory){return functionDelegateCall(target,data);}function functionDelegateCall(address target,bytes memory data,string memory errorMessage)internal returns(bytes memory){require(isContract(target));(bool success,bytes memory returndata)=target.delegatecall(data);return verifyCallResult(success,returndata,errorMessage);}function verifyCallResult(bool success,bytes memory returndata,string memory errorMessage)internal pure returns(bytes memory){if(success){return returndata;}else{if(returndata.length>0){assembly{let returndata_size:=mload(returndata)revert(add(32,returndata),returndata_size)}}else{revert(errorMessage);}}}}
library Strings{bytes16 private constant _HEX_SYMBOLS="0123456789abcdef";function toString(uint256 value)internal pure returns(string memory){if(value==0){return "0";}uint256 temp=value;uint256 digits;while(temp!=0){digits++;temp/=10;}bytes memory buffer=new bytes(digits);while(value!=0){digits-=1;buffer[digits]=bytes1(uint8(48+uint256(value%10)));value/=10;}return string(buffer);}function toHexString(uint256 value)internal pure returns(string memory){if(value==0){return "0x00";}uint256 temp=value;uint256 length=0;while(temp!=0){length++;temp>>=8;}return toHexString(value,length);}function toHexString(uint256 value,uint256 length)internal pure returns(string memory){bytes memory buffer=new bytes(2*length+2);buffer[0]="0";buffer[1]="x";for(uint256 i=2*length+1;i>1;--i){buffer[i]=_HEX_SYMBOLS[value&0xf];value>>=4;}require(value==0);return string(buffer);}}
abstract contract ERC165 is IERC165{function supportsInterface(bytes4 interfaceId)public view virtual override returns(bool){return interfaceId==type(IERC165).interfaceId;}}
abstract contract Context{function _msgSender()internal view virtual returns(address){return msg.sender;}function _msgData()internal view virtual returns(bytes calldata){return msg.data;}}
abstract contract Ownable is Context{address private _owner;event OwnershipTransferred(address indexed previousOwner,address indexed newOwner);constructor(){_transferOwnership(_msgSender());}function owner()public view virtual returns(address){return _owner;}modifier onlyOwner(){require(owner()==_msgSender());_;}function renounceOwnership()public virtual onlyOwner{_transferOwnership(address(0));}function transferOwnership(address newOwner)public virtual onlyOwner{require(newOwner!=address(0));_transferOwnership(newOwner);}function _transferOwnership(address newOwner)internal virtual{address oldOwner=_owner;_owner=newOwner;emit OwnershipTransferred(oldOwner,newOwner);}}
contract ERC721 is Context,ERC165,IERC721,IERC721Metadata{using Address for address;using Strings for uint256;string private _name;string private _symbol;mapping(uint256=>address)private _owners;mapping(address=>uint256)private _balances;mapping(uint256=>address)private _tokenApprovals;mapping(address=>mapping(address=>bool))private _operatorApprovals;constructor(string memory name_,string memory symbol_){_name=name_;_symbol=symbol_;}function supportsInterface(bytes4 interfaceId)public view virtual override(ERC165,IERC165)returns(bool){return interfaceId==type(IERC721).interfaceId||interfaceId==type(IERC721Metadata).interfaceId||super.supportsInterface(interfaceId);}function balanceOf(address owner)public view virtual override returns(uint256){require(owner!=address(0));return _balances[owner];}function ownerOf(uint256 tokenId)public view virtual override returns(address){address owner=_owners[tokenId];require(owner!=address(0));return owner;}function name()public view virtual override returns(string memory){return _name;}function symbol()public view virtual override returns(string memory){return _symbol;}function tokenURI(uint256 tokenId)public view virtual override returns(string memory){require(_exists(tokenId));string memory baseURI=_baseURI();return bytes(baseURI).length>0?string(abi.encodePacked(baseURI,tokenId.toString())):"";}function _baseURI()internal view virtual returns(string memory){return"";}function approve(address to,uint256 tokenId)public virtual override{address owner=ERC721.ownerOf(tokenId);require(to!=owner);require(_msgSender()==owner||isApprovedForAll(owner,_msgSender()));_approve(to,tokenId);}function getApproved(uint256 tokenId)public view virtual override returns(address){require(_exists(tokenId));return _tokenApprovals[tokenId];}function setApprovalForAll(address operator,bool approved)public virtual override{_setApprovalForAll(_msgSender(),operator,approved);}function isApprovedForAll(address owner,address operator)public view virtual override returns(bool){return _operatorApprovals[owner][operator];}function transferFrom(address from,address to,uint256 tokenId)public virtual override{require(_isApprovedOrOwner(_msgSender(),tokenId));_transfer(from,to,tokenId);}function safeTransferFrom(address from,address to,uint256 tokenId)public virtual override{safeTransferFrom(from,to,tokenId,"");}function safeTransferFrom(address from,address to,uint256 tokenId,bytes memory _data)public virtual override{require(_isApprovedOrOwner(_msgSender(),tokenId));_safeTransfer(from,to,tokenId,_data);}function _safeTransfer(address from,address to,uint256 tokenId,bytes memory _data)internal virtual{_transfer(from,to,tokenId);require(_checkOnERC721Received(from,to,tokenId,_data));}function _exists(uint256 tokenId)internal view virtual returns(bool){return _owners[tokenId]!=address(0);}function _isApprovedOrOwner(address spender,uint256 tokenId)internal view virtual returns(bool){require(_exists(tokenId));address owner=ERC721.ownerOf(tokenId);return(spender==owner||getApproved(tokenId)==spender||isApprovedForAll(owner,spender));}function _safeMint(address to,uint256 tokenId)internal virtual{_safeMint(to,tokenId,"");}function _safeMint(address to,uint256 tokenId,bytes memory _data)internal virtual{_mint(to,tokenId);require(_checkOnERC721Received(address(0),to,tokenId,_data));}function _mint(address to,uint256 tokenId)internal virtual{require(to!=address(0));require(!_exists(tokenId));_beforeTokenTransfer(address(0),to,tokenId);_balances[to]+=1;_owners[tokenId]=to;emit Transfer(address(0),to,tokenId);}function _burn(uint256 tokenId)internal virtual{address owner=ERC721.ownerOf(tokenId);_beforeTokenTransfer(owner,address(0),tokenId);_approve(address(0),tokenId);_balances[owner]-=1;delete _owners[tokenId];emit Transfer(owner,address(0),tokenId);}function _transfer(address from,address to,uint256 tokenId)internal virtual{require(ERC721.ownerOf(tokenId)==from);require(to!=address(0));_beforeTokenTransfer(from,to,tokenId);_approve(address(0),tokenId);_balances[from]-=1;_balances[to]+=1;_owners[tokenId]=to;emit Transfer(from,to,tokenId);}function _approve(address to,uint256 tokenId)internal virtual{_tokenApprovals[tokenId]=to;emit Approval(ERC721.ownerOf(tokenId),to,tokenId);}function _setApprovalForAll(address owner,address operator,bool approved)internal virtual{require(owner!=operator);_operatorApprovals[owner][operator]=approved;emit ApprovalForAll(owner,operator,approved);}function _checkOnERC721Received(address from,address to,uint256 tokenId,bytes memory _data)private returns(bool){if(to.isContract()){try IERC721Receiver(to).onERC721Received(_msgSender(),from,tokenId,_data)returns(bytes4 retval){return retval==IERC721Receiver.onERC721Received.selector;}catch(bytes memory reason){if(reason.length==0){revert("Fail");}else{assembly{revert(add(32,reason),mload(reason))}}}}else{return true;}}function _beforeTokenTransfer(address from,address to,uint256 tokenId)internal virtual{}}
abstract contract ERC721Enumerable is ERC721,IERC721Enumerable{mapping(address=>mapping(uint256=>uint256))private _ownedTokens;mapping(uint256=>uint256)private _ownedTokensIndex;uint256[]private _allTokens;mapping(uint256=>uint256)private _allTokensIndex;function supportsInterface(bytes4 interfaceId)public view virtual override(IERC165,ERC721)returns(bool){return interfaceId==type(IERC721Enumerable).interfaceId||super.supportsInterface(interfaceId);}function tokenOfOwnerByIndex(address owner,uint256 index)public view virtual override returns(uint256){require(index<ERC721.balanceOf(owner));return _ownedTokens[owner][index];}function totalSupply()public view virtual override returns(uint256){return _allTokens.length;}function tokenByIndex(uint256 index)public view virtual override returns(uint256){require(index<ERC721Enumerable.totalSupply());return _allTokens[index];}function _beforeTokenTransfer(address from,address to,uint256 tokenId)internal virtual override{super._beforeTokenTransfer(from,to,tokenId);if(from==address(0)){_addTokenToAllTokensEnumeration(tokenId);}else if(from!=to){_removeTokenFromOwnerEnumeration(from,tokenId);}if(to==address(0)){_removeTokenFromAllTokensEnumeration(tokenId);}else if(to!=from){_addTokenToOwnerEnumeration(to,tokenId);}}function _addTokenToOwnerEnumeration(address to,uint256 tokenId)private{uint256 length=ERC721.balanceOf(to);_ownedTokens[to][length]=tokenId;_ownedTokensIndex[tokenId]=length;}function _addTokenToAllTokensEnumeration(uint256 tokenId)private{_allTokensIndex[tokenId]=_allTokens.length;_allTokens.push(tokenId);}function _removeTokenFromOwnerEnumeration(address from,uint256 tokenId)private{uint256 lastTokenIndex=ERC721.balanceOf(from)-1;uint256 tokenIndex=_ownedTokensIndex[tokenId];if(tokenIndex!=lastTokenIndex){uint256 lastTokenId=_ownedTokens[from][lastTokenIndex];_ownedTokens[from][tokenIndex]=lastTokenId;_ownedTokensIndex[lastTokenId]=tokenIndex;}delete _ownedTokensIndex[tokenId];delete _ownedTokens[from][lastTokenIndex];}function _removeTokenFromAllTokensEnumeration(uint256 tokenId)private{uint256 lastTokenIndex=_allTokens.length-1;uint256 tokenIndex=_allTokensIndex[tokenId];uint256 lastTokenId=_allTokens[lastTokenIndex];_allTokens[tokenIndex]=lastTokenId;_allTokensIndex[lastTokenId]=tokenIndex;delete _allTokensIndex[tokenId];_allTokens.pop();}}

contract WhooliHootie is ERC721Enumerable,Ownable{
  struct WH{uint256 P1;uint256 P2;uint256 T;uint256 G;} //parents,time,1-Female/2-Male
  mapping(uint256=>WH) public wh;

  uint256 constant MAXSUPPLY=18; //[DEPLOYMENT SET TO 1849]
  uint256 constant GEN1MAX=7; //[DEPLOYMENT SET TO 169]
  uint256 constant WAITINGTIME=0; //[DEPLOYMENT SET TO 604800 (1 WEEK)]
  uint256 cost=0 ether; //[DEPLOYMENT SET TO 0.88]
  uint256 percent=5;
  using Strings for uint256;
  string baseURI;
  string baseURIF;
  string baseURIM;
  bool paused=false;
  bool breedable=true;

  constructor(string memory _name,string memory _symbol,string memory _BaseURIF,string memory _BaseURIM)ERC721(_name,_symbol){
    baseURIF=_BaseURIF;baseURIM=_BaseURIM;
  }
  function getGen(bool gen1)private returns(uint256){uint256 gender=uint256(keccak256(abi.encodePacked(block.timestamp)))%10>(gen1?4:7)?1:2;baseURI=gender==1?baseURIF:baseURIM;return gender;}
  function getOwnerWallet()public view returns(uint256[]memory){uint256[]memory tokenIds=new uint256[](balanceOf(msg.sender));for(uint256 i;i<balanceOf(msg.sender);i++){tokenIds[i]=tokenOfOwnerByIndex(msg.sender,i);}return tokenIds;}
  function getWallet()external view returns(uint256){return address(this).balance;}
  function _baseURI()internal view virtual override returns(string memory){return baseURI;}
  function setAirdrop(address airdropAddress)external onlyOwner{wh[totalSupply()+1].G=getGen(true);_safeMint(airdropAddress,totalSupply()+1);}
  function setBaseURI(string memory _BaseURIF,string memory _BaseURIM)external onlyOwner{baseURIF=_BaseURIF;baseURIM=_BaseURIM;}
  function setBreed(bool _state)external onlyOwner{breedable=_state;}
  function setCost(uint256 _newCost)external onlyOwner{cost=_newCost;}
  function setDistribute()external{for(uint256 i=1;i<=totalSupply();i++){(bool success,)=payable(payable(ownerOf(i))).call{value:address(this).balance/totalSupply()}("");require(success);}}
  function setPause(bool _state)external onlyOwner{paused=_state;}
  function setPercent(uint256 _newPercentage)external onlyOwner(){percent=_newPercentage;}
  function tokenURI(uint256 tokenId)public view virtual override returns(string memory){return bytes(_baseURI()).length>0?string(abi.encodePacked(_baseURI(),tokenId.toString(),".json")):"";}
  function mint()external payable{
    require(!paused&&totalSupply()+1<GEN1MAX&&msg.value>=cost);
    wh[totalSupply()+1].G=getGen(true);
    _safeMint(msg.sender,totalSupply()+1);
    for(uint256 i=1;i<=totalSupply();i++){
        (bool success,)=payable(payable(ownerOf(i))).call{value:address(this).balance*percent/100/totalSupply()}("");
        require(success);
    }
    (bool os,)=payable(owner()).call{value:address(this).balance}("");
    require(os);
  }
  function breed(uint256 p1,uint256 p2)external{
    bool existed;
    for(uint256 i=GEN1MAX;i<MAXSUPPLY;i++)existed=(wh[i].P1==p1&&wh[i].P2==p2)||(wh[i].P1==p2&&wh[i].P2==p1)?true:false;
    require(!paused&&
      breedable&&
      totalSupply()+1<MAXSUPPLY&&
      ownerOf(p1)==msg.sender&&
      ownerOf(p2)==msg.sender&&
      p1<GEN1MAX&&
      p2<GEN1MAX&&
      wh[p1].T+WAITINGTIME<block.timestamp&&
      wh[p2].T+WAITINGTIME<block.timestamp&&
      (wh[p1].G==1&&wh[p2].G==2)||(wh[p2].G==1&&wh[p1].G==2)&&
      !existed);
    wh[totalSupply()+1].G=getGen(true);
    _safeMint(msg.sender,totalSupply()+1);
    wh[totalSupply()].P1=p1;
    wh[totalSupply()].P2=p2;
    wh[p1].T=block.timestamp;
    wh[p2].T=block.timestamp;
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
