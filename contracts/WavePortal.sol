// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => bool) addresses; 

    constructor() {
        console.log("fancy");
    }

    function wave() public {
        if(addresses[msg.sender]){
            console.log("What you waving at? You've already been here. %s!", msg.sender);
            return;
        }
        totalWaves += 1;
        addresses[msg.sender] = true;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}