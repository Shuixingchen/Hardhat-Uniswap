pragma solidity ^0.4.24;

import "./IMCToken.sol";

// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------
contract BuyCoffee{

    event Buy(uint _fee);
    event ReceiveApproval(address _sender, uint256 _value, address _tokenContract, bytes _extraData);

    IMCToken public imcToken;
    
    constructor(address _tokenAddr) public payable{
        // 初始化ICPToken实例
        imcToken = IMCToken(_tokenAddr);
    }
    
    function buy(uint _fee) public returns (bool) {
        
        emit Buy(_fee);
        
        
        return true;
    }

    function receiveApproval(address _sender, uint256 _value, address _tokenContract, bytes _extraData) public{
        // require(msg.sender == address(_tokenContract));
        require(imcToken == address(_tokenContract));
        
        require(imcToken.transferFrom(_sender, address(this), 2000));
        
        emit ReceiveApproval(_sender, _value, _tokenContract, _extraData);
        
        buy(2000);
        
        
    }
    
    

}

