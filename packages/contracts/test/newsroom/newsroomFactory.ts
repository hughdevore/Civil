import { configureChai } from "@joincivil/dev-utils";
import { DecodedLogEntry } from "@joincivil/typescript-types";
import { isDeployedBytecodeEqual, promisify } from "@joincivil/utils";
import * as chai from "chai";
import * as Web3 from "web3";
import { REVERTED } from "../utils/constants";

const Newsroom = artifacts.require("Newsroom");
const MultiSigWallet = artifacts.require("MultiSigWallet");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
const NewsroomFactory = artifacts.require("NewsroomFactory");

configureChai(chai);
const expect = chai.expect;

const CONTRACT_EVENT = "ContractInstantiation";
const NEWSROOM_NAME = "Newsroom name";
const SOME_URI = "http://someuri.com";
const SOME_HASH = web3.sha3();

function createdContract(factory: any, txReceipt: Web3.TransactionReceipt): string {
  const myLog = txReceipt.logs.find((log: any) => log.event === CONTRACT_EVENT && log.address === factory.address) as
    | DecodedLogEntry
    | undefined;

  if (!myLog) {
    throw new Error("ContractInstantation log not found");
  }
  return myLog.args.instantiation;
}

const getCode = promisify<string>(web3.eth.getCode);
// TODO(ritave): Make this into mocha extension
async function codeMatches(instance: any, clazz: any): Promise<void> {
  const code = await getCode(instance.address);
  expect(isDeployedBytecodeEqual(code, clazz.deployedBytecode)).to.be.true();
}

contract("NewsroomFactory", accounts => {
  const [owner, secondOwner, thirdOwner] = accounts;

  let multisigFactoryInstance: any;
  let instance: any;

  async function createNewsroom(
    owners: string[],
    required: number = 1,
    name: string = NEWSROOM_NAME,
  ): Promise<{ newsroom: any; multisig: any }> {
    const receipt = await instance.create(name, SOME_URI, SOME_HASH, owners, required);
    return {
      newsroom: Newsroom.at(createdContract(instance, receipt)),
      multisig: MultiSigWallet.at(createdContract(multisigFactoryInstance, receipt)),
    };
  }

  before(async () => {
    multisigFactoryInstance = await MultiSigWalletFactory.new();
  });

  beforeEach(async () => {
    instance = await NewsroomFactory.new(multisigFactoryInstance.address);
  });

  it("creates a newsroom", async () => {
    const { newsroom } = await createNewsroom([owner]);

    const [charterHash, charterUri] = await newsroom.getContent(0);

    await codeMatches(newsroom, Newsroom);

    expect(charterHash).to.be.equal(SOME_HASH);
    expect(charterUri).to.be.equal(SOME_URI);
  });

  it("creates a multisig", async () => {
    const { multisig } = await createNewsroom([owner]);

    await codeMatches(multisig, MultiSigWallet);
  });

  it("tranfers ownership to multisig", async () => {
    const { newsroom, multisig } = await createNewsroom([owner]);

    await expect(newsroom.owner()).to.eventually.be.equal(multisig.address);
  });

  it("sets proper owners", async () => {
    const OWNERS = [owner, thirdOwner];

    const { multisig } = await createNewsroom(OWNERS);

    await expect(multisig.getOwners()).to.eventually.have.members(OWNERS);
  });

  it("sets proper required", async () => {
    const OWNERS = [owner, secondOwner, thirdOwner];
    const REQUIRED = 2;

    const { multisig } = await createNewsroom(OWNERS, REQUIRED);

    await expect(multisig.required()).to.eventually.be.bignumber.equal(REQUIRED);
  });

  it("registers newsroom", async () => {
    const { newsroom } = await createNewsroom([owner]);

    await expect(instance.isInstantiation(newsroom.address)).to.eventually.be.true();
  });

  it("registers multisig", async () => {
    const { multisig } = await createNewsroom([owner]);

    await expect(multisigFactoryInstance.isInstantiation(multisig.address)).to.eventually.be.true();
  });

  it("sets the name properly", async () => {
    const MY_NAME = "my name";

    const { newsroom } = await createNewsroom([owner], 1, MY_NAME);

    expect(await newsroom.name()).to.be.equal(MY_NAME);
  });

  it("doesn't allow empty names", async () => {
    await expect(instance.create("", "somecontent.com", web3.sha3(), [owner], 1)).to.eventually.be.rejectedWith(
      REVERTED,
    );
  });

  it("checks required amount", async () => {
    await expect(
      instance.create(NEWSROOM_NAME, "somecontent.com", web3.sha3(), [owner], 2),
    ).to.eventually.be.rejectedWith(REVERTED);
  });
});
