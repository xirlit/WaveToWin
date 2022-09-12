const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    let wavecount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave("hi");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    waveTxn = await waveContract.connect(randomPerson).wave("Hi from random person");
    await waveTxn.wait();

    waveTxn = await waveContract.connect(randomPerson).wave("Hi from random person for the second time");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
    console.log(await waveContract.getAllWaves());
};

const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();