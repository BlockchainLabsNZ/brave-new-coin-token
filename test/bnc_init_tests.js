let MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
let BNC = artifacts.require("BNC");

contract("BNC", function(accounts) {
  it("Should initiate the MiniMe Token with the proper values", async () => {
    let bnc = await BNC.new(MiniMeTokenFactory.address);
    assert.equal(
      (await bnc.balanceOf.call(accounts[0])).toNumber(),
      100000000000000000000,
      "100.000.000.000.000.000.000 isn't the token's initial supply"
    );

    assert.equal(
      (await bnc.totalSupply.call()).toNumber(),
      100000000000000000000,
      "100.000.000.000.000.000.000 isn't the token's initial supply."
    );

    assert.equal(
      await bnc.name.call(),
      "Brave New Coin",
      "Brave New Coin isn't the token's name."
    );

    assert.equal(
      await bnc.symbol.call(),
      "BNC",
      "BNC isn't the token's symbol."
    );

    assert.equal(
      (await bnc.decimals.call()).toNumber(),
      12,
      "12 isn't the token's decimals"
    );
  });
});
