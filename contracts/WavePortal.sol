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

    constructor() payable {
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

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
