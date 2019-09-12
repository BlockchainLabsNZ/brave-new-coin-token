# Sphre AIR Token Audit Report


Prepared by:

- Alex Tikonoff, [alex@blockchainlabs.nz](alex@blockchainlabs.nz)

Report:

- September 13, 2019 – date of delivery

<br>

### Table of Contents

- [Preamble](#preamble)
- [Scope](#scope)
- [Issues](#issues-found):
	- [Minor](#minor)
	- [Moderate](#moderate)
	- [Major](#major)
	- [Critical](#critical)
- [Observations](#observations)
- [Conclusion](#conclusion)




<div class="page-break"></div><!-- ******************************************************** -->

## Preamble

This audit report was undertaken by **BlockchainLabs.nz** for the purpose of providing feedback to **Brave New Coin**. It has subsequently been shared publicly without any express or implied warranty.

Solidity contracts were sourced from the Ethereum mainnet at[0xdD6Bf56CA2ada24c683FAC50E37783e55B57AF9F](https://etherscan.io/address/0xdD6Bf56CA2ada24c683FAC50E37783e55B57AF9F#code). We took part in carefully inspecting the source code and tests for the **BNC Token**. We set out to establish that _the code had no known security vulnerabilities_.



<br><!-- ******************************************************** -->

## Scope

The following sources were in scope for static analysis:

#### Smart contracts

  - [BNC.sol](https://github.com/BlockchainLabsNZ/brave-new-coin-token/blob/master/contracts/BNC.sol)
  - [MiniMeToken.sol](https://github.com/BlockchainLabsNZ/brave-new-coin-token/blob/master/contracts/MiniMeToken.sol)

#### Tests

 - [`bnc_clonable_tests.js`](https://github.com/BlockchainLabsNZ/brave-new-coin-token/blob/master/test/bnc_clonable_tests.js)
 - [`bnc_init_tests.js`](https://github.com/BlockchainLabsNZ/brave-new-coin-token/blob/master/test/bnc_init_tests.js)

<br>


<br><!-- ******************************************************** -->

## Focus Areas

Testing was focused on the following key areas - though this is not an exhaustive list.

- ### Correctness

	- No correctness defects uncovered during static analysis?
	- No implemented contract violations uncovered during execution?
	- No other generic incorrect behaviour detected during execution?
	- Adherence to adopted standards such as ERC20?

- ### Testability

	- Test coverage across all functions and events?
	- Test cases for both expected behaviour and failure modes?
	- Settings for easy testing of a range of parameters?
	- No reliance on nested callback functions or console logs?
	- Avoidance of test scenarios calling other test scenarios?

- ### Security

	- No presence of known security weaknesses?
	- No funds at risk of malicious attempts to withdraw/transfer?
	- No funds at risk of control fraud?
	- Prevention of Integer Overflow or Underflow?

- ### Best Practice

	- Explicit labelling for the visibility of functions and state variables?
	- Proper management of gas limits and nested execution?
	- Latest version of the Solidity compiler?

<br><!-- *********************************************** -->


## Issues

<h4>Severity Description:</h4>

<table>
  <tr>
    <td><strong>Minor</strong></td>
    <td>A defect that does not have a material impact on the contract execution and is likely to be subjective.</td>
  </tr>
  <tr>
    <td><strong>Moderate</strong></td>
    <td>A defect that could impact the desired outcome of the contract execution in a specific scenario.</td>
  </tr>
  <tr>
    <td><strong>Major</strong></td>
    <td> A defect that impacts the desired outcome of the contract execution or introduces a weakness that may be exploited.</td>
  </tr>
  <tr>
    <td><strong>Critical</strong></td>
    <td>A defect that presents a significant security vulnerability or failure of the contract across a range of scenarios.</td>
  </tr>
</table>

<br><br>

### Minor

- **Functions should throw an error instead of returning false** -`Best practice` <br>
It is consider to be better solution to use `revert()` or `require()` instead of `return false` to signal that the function can not complete.
A big advantage of this tactic is that most wallet software will give you a warning that the transaction will not go through before you make the transaction. And Etherscan or some other blockchain explorers would show the tx as successful if it doesn’t return revert opcode.
This issue has been fixed in the latest version of MiniMe.
	- [ ] Not fixed
	
- **Get rid of MiniMe structures for saving gas** -`Best practice` <br>
MiniMe uses mappings to store every single balanceOfAt, totalSupplyAt which increases gas usage.
Suggest to get rid of MiniMe structure and consider implementing lightweight token functions(like ERC20 standard).
	- [ ] Not fixed


### Moderate


<br>

### Major


- **outdated version of MiniMe framework** -`Best practice` <br>
It is using a previous version of MiniMe token in the contract. There are a few of improvements have been made in those releases. We suggest to update it to the latest version.
	- [ ] Not fixed

- **transfer() and transferFrom() functions don’t comply with ERC20 standard** -`Best practice`<br>
According to [ERC20 specification](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#transfer), transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.
But `doTransfer()` function in [line 207](https://github.com/BlockchainLabsNZ/brave-new-coin-token/blob/104348f0df723394109456bb9041e26cedf7f5ce/contracts/MiniMeToken.sol#L207) returning `true` to `transfer()` function and it does not fire the `Transfer()` event in this case .

	```
	204 function doTransfer(address _from, address _to, uint _amount) internal returns(bool) {
	205    
	206   if (_amount == 0) {
	207     return true;
	208   }

	```

	- [ ] Not fixed 	(*This issue has been fixed in the latest version of MiniMe.*)



### Critical

- None found

<br>




## Observations

### Controller has full control
This control bestows onto the controller full control over the token contract, including transfering the tokens of any user, minting new tokens and burning any other token. Consider carefully whether this control is required for the project. If required ensure that the address set as the controller is well secured, if not required consider setting the controler to the 0x0 address.

### Extra Mappings
Minime framework uses mappings to store every single balanceOfAt, totalSupplyAt this increases the relative gas cost of transactions when compared to other frameworks. If these mapping are not required consider a simpler framework for additional gas savings.



<br><!-- *********************************************** -->

## Conclusion

Overall we have not identified any potential vulnerabilities. This contract has a low level risk of XID being hacked or stolen from the inspected contracts.

<br><!-- *********************************************** -->
<hr>
<h4>Disclaimer</h4>

Our team uses our current understanding of the best practises for Solidity and Smart Contracts. Development in Solidity and for Blockchains is an emerging area of software engineering which still has a lot of room to grow, hence our current understanding of best practices may not find all of the issues in this code and design. We have not analysed any of the assembly code generated by the Solidity compiler. We have not verified the deployment process and configurations of the contracts. We have only analysed the code outlined in the scope. We have not verified any of the claims made by any of the organisations behind this code. Security audits do not warrant bug-free code. We encourage all users interacting with smart contract code to continue to analyse and inform themselves of any risks before interacting with any smart contracts.
