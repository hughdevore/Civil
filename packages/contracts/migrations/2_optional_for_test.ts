/* global artifacts */

import BN from "bignumber.js";

import { config } from "./utils";
import { MAIN_NETWORK, RINKEBY } from "./utils/consts";

const Token = artifacts.require("EIP20");

const BASE_10 = 10;

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const totalSupply = new BN("1000000000000000000000000", BASE_10);
  const decimals = "18";

  async function giveTokensTo(addresses: string[], originalCount: number): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    let allocation;
    allocation = totalSupply.div(new BN(originalCount, BASE_10));
    await token.transfer(user, allocation);

    if (addresses.length === 1) {
      return true;
    }
    return giveTokensTo(addresses.slice(1), originalCount);
  }
  deployer.then(async () => {
    if (network !== MAIN_NETWORK && network !== RINKEBY) {
      await deployer.deploy(Token, totalSupply, "TestCvl", decimals, "TESTCVL");
      if (network in config.nets) {
        const updatedAccounts = [...accounts, ...config.nets[network].tokenHolders];
        return giveTokensTo(updatedAccounts, updatedAccounts.length);
      }
      return giveTokensTo(accounts, accounts.length);
    }
  });
};
