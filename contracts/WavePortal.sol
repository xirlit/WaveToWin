// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address callerAddress;
        string message;
        uint256 timestamp;
    }
    mapping(address => uint256) lastWaveTime;

    Wave[] waves;

    constructor() payable {
        console.log("fancy");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWaveTime[msg.sender] + 5 minutes < block.timestamp,
            "Stop spamming"
        );

        totalWaves += 1;
        lastWaveTime[msg.sender] = block.timestamp;
        console.log("%s has waved!", msg.sender);

        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("The seed has been generated: %s", seed);
        waves.push(Wave(msg.sender, _message, block.timestamp));

        if (seed < 50) {
            console.log("%s has won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

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
