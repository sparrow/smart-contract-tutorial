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

  function sendPayAmountToTasker() public {
    require(deployer == msg.sender);

    // transfer pay amount to tasker
    tasker.transfer(payAmount);

    // nullify pay amount manually
    payAmount = 0;
  }
}
