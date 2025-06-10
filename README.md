### Download and install dependencies

```
git clone https://github.com/MatrixMedia/vaultify-blockchain-codes.git
cd vaultify-blockchain-codes
nvm use 20.17.0
npm i
```

### Compile

```
npx hardhat compile
```

### Set env variables
Create .evn file at the root of the project and fill below values. Refer to `env_sample` for reference
```
DEPLOYER_KEY=
NODE_ID=
NETWORK=polygon | amoy | hardhat  



### Prepare for Deployment

Custom `gas` value can be configured for different network in `hardhat.config.js`

e.g.
```
polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.NODE_ID}`,
      tags: [],
      gas: 6_000_000,
      gasPrice: 200_000_000_000,
      timeout: 3600000,
      timeoutBlocks: 1500,
      chainId: 137,
      accounts: real_accounts,
    },
```



Visite below script and update `isFreshDeploy` to true if you want to deploy fresh contract otherwise set it to false in case of upgrading the contract.

```
deploy/deploy_.js

```



Remove entries of deployment script from below file which you want to either deploy fresh or upgrade.

```
deployments/polygon/.migrations.json
```



To do fresh deployment or upgrade of all contracts, content of this file should look like this

```
{

}
```

### Deploy

```
# deploy on testnet
npx hardhat deploy --network polygon

# deploy on mainnet
npx hardhat deploy --network amoy

```
# run script on testnet
npx hardhat run <script-path> --network amoy

# run script on mainnet
npx hardhat run <script-path> --network polygon


```
Foundry Test

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
$ forge coverage --fork-url https://polygon-mainnet.infura.io/v3/${process.env.NODE_ID
```

