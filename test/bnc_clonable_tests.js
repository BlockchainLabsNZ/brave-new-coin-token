let MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
let MiniMeToken = artifacts.require("MiniMeToken");
let BNC = artifacts.require("BNC");

contract("BNC", function(accounts) {
  it("A cloned Token will keep the original Token's transaction history", async () => {
    let bnc = await BNC.new(MiniMeTokenFactory.address);
    bnc.transfer(accounts[1], 50000000000000000000);

    assert.equal(
      (await bnc.balanceOf.call(accounts[0])).toNumber(),
      50000000000000000000,
      "50.000.000.000.000.000.000 wasn't in the first account after the transfer"
    );

    let bnc2 = BNC.at(
      (await bnc.createCloneToken(
        "Brave New Coin Clone",
        12,
        "BNCC",
        web3.eth.blockNumber,
        true
      )).logs[0].args._cloneToken
    );

    assert.equal(
      (await bnc2.balanceOf.call(accounts[0])).toNumber(),
      50000000000000000000,
      "50.000.000.000.000.000.000 wasn't in the first account after the clone process"
    );

    assert.equal(
      (await bnc2.balanceOf.call(accounts[1])).toNumber(),
      50000000000000000000,
      "50.000.000.000.000.000.000 wasn't in the second account after the clone process"
    );

    assert.equal(
      await bnc2.name.call(),
      "Brave New Coin Clone",
      "Brave New Coin Clone isn't the cloned token's name."
    );

    assert.equal(
      await bnc2.symbol.call(),
      "BNCC",
      "BNCC isn't the cloned token's symbol."
    );

    assert.equal(
      (await bnc2.decimals.call()).toNumber(),
      12,
      "12 isn't the cloned token's decimals"
    );
  });

  it("A cloned Token can be cloned whithout the calling createCloneToken", async () => {
    let bnc = await BNC.new(MiniMeTokenFactory.address);
    bnc.transfer(accounts[1], 50000000000000000000);

    assert.equal(
      (await bnc.balanceOf.call(accounts[0])).toNumber(),
      50000000000000000000,
      "50.000.000.000.000.000.000 wasn't in the first account after the transfer"
    );

    let bnc2 = await MiniMeToken.new(
      MiniMeTokenFactory.address,
      bnc.address,
      web3.eth.blockNumber,
      "Brave New Coin Clone",
      12,
      "BNCC",
      true
    );

    assert.equal(
      (await bnc2.balanceOf.call(accounts[0])).toNumber(),
      50000000000000000000,
      "50.000.000.000.000.000.000 wasn't in the first account after the clone process"
    );

    assert.equal(
      (await bnc2.balanceOf.call(accounts[1])).toNumber(),
      50000000000000000000,
      "50.000.000.000.000.000.000 wasn't in the second account after the clone process"
    );

    assert.equal(
      await bnc2.name.call(),
      "Brave New Coin Clone",
      "Brave New Coin Clone isn't the cloned token's name."
    );

    assert.equal(
      await bnc2.symbol.call(),
      "BNCC",
      "BNCC isn't the cloned token's symbol."
    );

    assert.equal(
      (await bnc2.decimals.call()).toNumber(),
      12,
      "12 isn't the cloned token's decimals"
    );
  });
});
