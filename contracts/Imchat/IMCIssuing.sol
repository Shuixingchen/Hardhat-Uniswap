pragma solidity ^0.4.24;

import "./IMCToken.sol";

// ----------------------------------------------------------------------------
// 数据存储合约
// ----------------------------------------------------------------------------
contract DataStore {
    using SafeMath for uint;

    // 定义IMCToken实例
    IMCToken public imcToken;

    // 存储允许访问的帐户地址
    mapping (address => bool) public accessAllowed;

    // 平台账户地址
    address platformAddr;

    // 用户分配记录
    struct UserInfo {
        uint balance;
        uint index;
    }
    
    // 分配记录
    mapping(bytes32 => UserInfo) public issuingRecord;
    
    // 用户索引自增长
    uint public index;
    
    // 分配总金额
    uint public totalIssuingBalance;
    
    constructor(address _tokenAddr, address _platformAddr) public{
        // 初始化合约发布者的权限
        accessAllowed[msg.sender] = true;
        
        // 初始化IMCToken实例
        imcToken = IMCToken(_tokenAddr);

        // 初始化平台账户地址
        platformAddr = _platformAddr;
    }

    
    // 添加修饰器
    modifier platform() {
        require(accessAllowed[msg.sender] == true);
        _;
    }
    
    // 允许访问
    function allowAccess(address _addr) platform public {
        accessAllowed[_addr] = true;
    }
    
    // 拒绝访问
    function denyAccess(address _addr) platform public {
        accessAllowed[_addr] = false;
    }
    
    // 修改platformAddr，只有owner能够修改
    function modifyPlatformAddr(address _addr) platform public {
        platformAddr = _addr;
    }



    // 保存用户Token到分配记录
    function saveToken(bytes32 _uid, uint _tokens) platform public returns (bool) {
        index = index.add(1);
        
        issuingRecord[_uid] = UserInfo(_tokens, index);

        totalIssuingBalance = totalIssuingBalance.add(_tokens);
        
        return true;
        
    }
    
    // 转账到中间帐户
    function sendTokenToPlatform(uint _tokens) platform public returns (bool) {

        imcToken.transfer(platformAddr, _tokens);
        
        return true;
    }

    
    // 获取用户余额
    function getUserBalance(bytes32 _uid) public view returns (uint) {
        UserInfo storage userInfo = issuingRecord[_uid];
        
        return userInfo.balance;
    }
    
    // 获取用户索引
    function getUserIndex(bytes32 _uid) public view returns (uint) {
        UserInfo storage userInfo = issuingRecord[_uid];
        
        return userInfo.index;
    }
    
    // 获取用户信息
    function getUserInfo(bytes32 _uid) public view returns (uint, uint) {
        UserInfo storage userInfo = issuingRecord[_uid];
        
        return (userInfo.balance, userInfo.index);
    }

}



// ----------------------------------------------------------------------------
// 分配控制合约
// ----------------------------------------------------------------------------
contract IMCIssuing is Owned{
    using SafeMath for uint;

    // 分配添加事件
    event IssuingAdd(uint _length, uint _stashIssuingTotal);

    DataStore dataContract;

    constructor(address _dataContractAddr) public{
        // 初始化DataStore合约实例
        dataContract = DataStore(_dataContractAddr);
    }

    // 分配规则
    function issuingRule(bytes32 _uid) internal returns (uint){
        uint tokenNum;
        uint index = dataContract.index();

        // 防止重复生成
        require(!(dataContract.getUserIndex(_uid) > 0));
        
        // if (index >= 0 && index < 100000) {
        //     tokenNum = 1024;
        // } else if (index >= 100000 && index < 200000) {
        //     tokenNum = 512;
        // } else if (index >= 200000 && index < 400000) {
        //     tokenNum = 256;
        // } else if (index >= 400000 && index < 800000) {
        //     tokenNum = 128;
        // } else if (index >= 800000 && index < 1600000) {
        //     tokenNum = 64;
        // } else if (index >= 1600000 && index < 3200000) {
        //     tokenNum = 32;
        // } else if (index >= 3200000 && index < 6400000) {
        //     tokenNum = 16;
        // } else if (index >= 6400000 && index < 12800000) {
        //     tokenNum = 8;
        // } else if (index >= 12800000 && index < 25600000) {
        //     tokenNum = 4;
        // } else if (index >= 25600000 && index < 51200000) {
        //     tokenNum = 2;
        // } else if (index >= 51200000 && index < 488000000) {
        //     tokenNum = 1;
        // } else {
        //     revert();
        // }

        // test rule
        if (index >= 0 && index < 2) {
            tokenNum = 1024;
        } else if (index >= 2 && index < 4) {
            tokenNum = 512;
        } else if (index >= 4 && index < 8) {
            tokenNum = 256;
        } else if (index >= 8 && index < 16) {
            tokenNum = 128;
        } else if (index >= 16 && index < 32) {
            tokenNum = 64;
        } else if (index >= 32 && index < 64) {
            tokenNum = 32;
        } else if (index >= 64 && index < 126) {
            tokenNum = 16;
        } else if (index >= 128 && index < 256) {
            tokenNum = 8;
        } else if (index >= 256 && index < 512) {
            tokenNum = 4;
        } else if (index >= 512 && index < 1024) {
            tokenNum = 2;
        } else if (index >= 1024 && index < 9760) {
            tokenNum = 1;
        } else {
            revert();
        }

        dataContract.saveToken(_uid, tokenNum);

        return tokenNum;
    }

    
    // 分配批量添加需owner自己操作
    // function issuingAdd(bytes32[] memory _uids) public onlyOwner returns (bool){
    function issuingAdd(bytes32[] memory _uids) public returns (bool){
        require(_uids.length > 0);
    
        // 暂存当次分配总额
        uint stashIssuingTotal;
        
        // 添加分配信息到区块链
        for(uint i = 0; i < _uids.length; i++) {
            stashIssuingTotal = stashIssuingTotal.add(issuingRule(_uids[i]));
        }

        // 记录分配记录
        emit IssuingAdd(_uids.length, stashIssuingTotal);

        // 执行转账到中间帐户
        dataContract.sendTokenToPlatform(stashIssuingTotal);
        
        return true;
    }


}
