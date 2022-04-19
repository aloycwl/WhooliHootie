pragma solidity^0.8.13;//SPDX-License-Identifier: MIT
interface IERC721{
    event Transfer(address indexed from,address indexed to,uint256 indexed tokenId);
    event Approval(address indexed owner,address indexed approved,uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner,address indexed operator,bool approved);
    function balanceOf(address owner)external view returns(uint256 balance);
    function ownerOf(uint256 tokenId)external view returns(address owner);
    function safeTransferFrom(address from,address to,uint256 tokenId)external;
    function transferFrom(address from,address to,uint256 tokenId)external;
    function approve(address to,uint256 tokenId)external;
    function getApproved(uint256 tokenId)external view returns(address operator);
    function setApprovalForAll(address operator,bool _approved)external;
    function isApprovedForAll(address owner,address operator)external view returns(bool);
    function safeTransferFrom(address from,address to,uint256 tokenId,bytes calldata data)external;
}
interface IERC721Metadata{
    function name()external view returns(string memory);
    function symbol()external view returns(string memory);
    function tokenURI(uint256 tokenId)external view returns(string memory);
}
contract ERC721AC is IERC721,IERC721Metadata{
    address private _owner;
    mapping(uint256=>address)private _owners;
    mapping(address=>uint256)private _balances;
    mapping(uint256=>address)private _tokenApprovals;
    mapping(address=>mapping(address=>bool))private _operatorApprovals;
    constructor(){
        _owner=msg.sender;
    }
    function supportsInterface(bytes4 f)external pure returns(bool){
        return f==type(IERC721).interfaceId||f==type(IERC721Metadata).interfaceId;
    }
    function balanceOf(address o)external view override returns(uint256){
        return _balances[o];
    }
    function ownerOf(uint256 k)public view override returns(address){
        return _owners[k];
    }
    function owner()external view returns(address){
        return _owner;
    }
    function name()external pure override returns(string memory){
        return "TESTING 4";
    }
    function symbol()external pure override returns(string memory){
        return "TS4";
    }
    function tokenURI(uint256 k)external pure override returns(string memory){
        require(k==k);
        return"";
    }
    function approve(address t,uint256 k)external override{
        require(msg.sender==ownerOf(k)||isApprovedForAll(ownerOf(k),msg.sender));
        _tokenApprovals[k]=t;
        emit Approval(ownerOf(k),t,k);
    }
    function getApproved(uint256 tokenId)public view override returns(address){
        return _tokenApprovals[tokenId];
    }
    function setApprovalForAll(address p,bool a)external override{
        _operatorApprovals[msg.sender][p]=a;
        emit ApprovalForAll(msg.sender,p,a);
    }
    function isApprovedForAll(address o,address p)public view override returns(bool){
        return _operatorApprovals[o][p];
    }
    function transferFrom(address f,address t,uint256 k)public override{unchecked{
        require(f==ownerOf(k)||getApproved(k)==f||isApprovedForAll(ownerOf(k),f));
        _tokenApprovals[k]=address(0);
        emit Approval(ownerOf(k),t,k);
        _balances[f]-=1;
        _balances[t]+=1;
        _owners[k]=t;
        emit Transfer(f,t,k);
    }}
    function safeTransferFrom(address f,address t,uint256 k)external override{
        transferFrom(f,t,k);
    }
    function safeTransferFrom(address f,address t,uint256 k,bytes memory d)external override{
        d=d;
        transferFrom(f,t,k);
    }
    function MINT(address to,uint256 tokenId)public{unchecked{
        _balances[to]+=1;
        _owners[tokenId]=to;
        emit Transfer(address(0),to,tokenId);
    }}
}