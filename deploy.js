const Web3 = require('web3')
const contract = require('truffle-contract')
const SmartContract = contract(require('./build/contracts/OddjobPayContract'))

const deployer = '0x2Af1552C6b02a1C8eE6B8A9175867198EE7DeCA1'
const client   = '0x4baB642a718738504871e4e9399C8F103aE0A23E'
const tasker   = '0xAcF1006EA19f9ed5b276204036010687C1A79683'

const web3Provider = new Web3.providers.HttpProvider(
  'http://10.10.11.75:8545' // address of the Parity node
)

const web3 = new Web3(web3Provider)

web3.eth.getAccounts(error => {
  if (error) {
    throw new Error(`
      Error while fetching accounts from RPC!
      Check RPC address! The problem may be there!
    `)
  }
})

const fetchBalanceByAddress = async address => {
  return new Promise(resolve => {
    web3.eth.getBalance(address, (_, balance) => {
      resolve(web3.fromWei(balance, 'ether').toString())
    })
  })
}

const printBalancesToConsole = async () => {
  const deployerBalance = await fetchBalanceByAddress(deployer)
  const clientBalance   = await fetchBalanceByAddress(client)
  const taskerBalance   = await fetchBalanceByAddress(tasker)

  console.log(`Deployer: ${deployerBalance}; Client: ${clientBalance}; Tasker: ${taskerBalance}`)
}

const run = async () => {
  await printBalancesToConsole()

  SmartContract.setProvider(web3Provider)

  const smartContract = await SmartContract.new(
    client, tasker, { gas: 1000000, from: deployer }
  )

  await printBalancesToConsole()

  await smartContract.sendTransaction({ from: client, value: web3.toWei(0.1, 'ether') })

  await printBalancesToConsole()

  await smartContract.sendPrizeToTasker({ from: deployer })

  await printBalancesToConsole()
}

run()
