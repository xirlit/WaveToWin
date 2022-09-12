// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    // mapping(address => bool) addresses; 
    
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address callerAddress;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() {
        console.log("fancy");
    }

    function wave(string memory _message) public {

        /* 

        if(addresses[msg.sender]){
            console.log("What you waving at? You've already been here. %s!", msg.sender);
            return;
        } 

        addresses[msg.sender] = true;

        */

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}