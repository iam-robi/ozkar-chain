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

interface ProtocolRegistrationConfig {
  fee: UInt64;
}

@runtimeModule()
export class ProtocolRegistration extends RuntimeModule<ProtocolRegistrationConfig> {
  // fee for registering a protocol
  @state() public fee = State.from<UInt64>(UInt64);
  // to register a protocol, an organisation must provide signed ipfs hash of the protocol.
  @state() public registeredProtocols = StateMap.from<CircuitString, PublicKey>(
    CircuitString,
    PublicKey
  );
  //
  @state() public protocolInscriptionLimits = StateMap.from<
    CircuitString,
    UInt64
  >(CircuitString, UInt64);

  // bool allows to unscribe from a protocol
  @state() public inscriptions = StateMap.from<Signature, Bool>(
    Signature,
    Bool
  );

  @runtimeMethod()
  public addProtocol(
    documentHash: CircuitString,
    participantLimit: UInt64
  ): void {
    // get the public key of the transaction sender
    const address = this.transaction.sender;
    this.registeredProtocols.set(documentHash, address);
  }

  @runtimeMethod()
  public protocolInscription(
    documentHash: CircuitString,
    pvKey: PrivateKey
  ): void {
    // get the public key of the transaction sender
    const address = this.transaction.sender;
    const signedInscription = Signature.create(pvKey, documentHash.toFields());
    //TODO: check inscription limit

    // can we run a specific verifier for an inscription ? making it modular ? eg I set a verifier address that is used ( it must comply to InscriptionVerifier interface )
    this.inscriptions.set(signedInscription, Bool(true));
  }
}
