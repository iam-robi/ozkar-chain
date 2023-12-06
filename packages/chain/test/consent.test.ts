import { TestingAppChain } from "@proto-kit/sdk";
import { CircuitString, PrivateKey, UInt64, Bool } from "o1js";
import { Consent } from "../src/Consent";
import { log } from "@proto-kit/common";
import { ZkConsent } from "@ozkar/vhir";

log.setLevel("ERROR");

describe("consent", () => {
  it("should demonstrate how consnet work", async () => {
    const appChain = TestingAppChain.fromRuntime({
      modules: {
        Consent,
      },
      config: {
        Consent: {
          sourceReference: CircuitString.fromString("hQKsdfsg67jfsdf"),
          manager: PrivateKey.random().toPublicKey(),
          controlledConsent: Bool(true),
        },
      },
    });

    await appChain.start();

    const managerPrivateKey = PrivateKey.random();
    const manager = managerPrivateKey.toPublicKey();
    const controllerPrivateKey = PrivateKey.random();
    const controller = managerPrivateKey.toPublicKey();

    appChain.setSigner(managerPrivateKey);

    const consent = appChain.runtime.resolve("Consent");

    const tx1 = await appChain.transaction(manager, () => {
      consent.whitelistController(controller);
    });

    await tx1.sign();
    await tx1.send();

    const block = await appChain.produceBlock();
  }, 1_000_000);
});
