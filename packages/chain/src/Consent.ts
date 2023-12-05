import {
  RuntimeModule,
  runtimeModule,
  state,
  runtimeMethod,
} from "@proto-kit/module";
import { State, StateMap, assert } from "@proto-kit/protocol";
import {
  PublicKey,
  UInt64,
  Bool,
  Field,
  CircuitString,
  Signature,
  PrivateKey,
} from "o1js";

interface ConsentConfig {
  sourceReference: CircuitString;
  manager: PublicKey;
  controlledConsent: Bool;
}

@runtimeModule()
export class Consent extends RuntimeModule<ConsentConfig> {
  // fee for registering a protocol
  @state() public sourceReference = State.from<CircuitString>(CircuitString);
  @state() public manager = State.from<PublicKey>(PublicKey);
  @state() public controlledConsent = State.from<Bool>(Bool);

  // controllers must be whitelisted by the manager
  @state() public controllerWhitelist = StateMap.from<PublicKey, Bool>(
    PublicKey,
    Bool
  );

  // list of consents.
  @state() public consents = StateMap.from<PublicKey, Bool>(PublicKey, Bool);

  @runtimeMethod()
  public submitConsent(
    signedDocument: Signature,
    controllerSignedConsent: Signature
  ): void {
    // get the public key of the transaction sender
    const address = this.transaction.sender;
    const consentDocument = this.sourceReference.get().toFields();
    signedDocument.verify(address, consentDocument);

    // TODO: add controlled signature method to Consent interface
    // TODO: verify controller signature
    // TODO: verify controller is whitelisted
  }

  @runtimeMethod()
  public whitelistController(controller: PublicKey): void {
    // get the public key of the transaction sender
    const address = this.transaction.sender;
    assert(
      address.equals(this.config.manager),
      "Only manager can whitelist controllers"
    );
    this.controllerWhitelist.set(controller, Bool(true));
  }

  @runtimeMethod()
  public unlistController(controller: PublicKey, pvKey: PrivateKey): void {
    // get the public key of the transaction sender
    const address = this.transaction.sender;
    assert(
      address.equals(this.config.manager),
      "Only manager can unlist controllers"
    );
    this.controllerWhitelist.set(controller, Bool(false));
  }
}
