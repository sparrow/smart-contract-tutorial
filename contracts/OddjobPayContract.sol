pragma solidity ^0.4.4;

contract OddjobPayContract {
  address public deployer;

  address public client;
  address public tasker;

  uint256 public payAmount;

  constructor (address _client, address _tasker) public {
    deployer = msg.sender;

    client = _client;
    tasker = _tasker;

    payAmount = 0;
  }

  function () public payable {
    require(client == msg.sender);
    payAmount += msg.value;
  }

  function sendPrizeToImplementer() public {
    require(deployer == msg.sender);

    // transfer prize amount to implementer
    tasker.transfer(payAmount);

    // nullify prize amount manually
    payAmount = 0;
  }
}
