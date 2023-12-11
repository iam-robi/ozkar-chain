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

interface DatasetConfig {
  commitment: Field;
  metadataCommitment: Field;
}

@runtimeModule()
export class Dataset extends RuntimeModule<DatasetConfig> {
  // fee for registering a protocol
  @state() public datasetList = StateMap.from<CircuitString, PublicKey>(
    CircuitString,
    PublicKey
  );

  //map metadata to dataset, metadata will be public and indexed
  @state() public metadataList = StateMap.from<CircuitString, CircuitString>(
    CircuitString,
    CircuitString
  );

  @runtimeMethod()
  public submitDataset(dataset: CircuitString, metadata: CircuitString): void {
    // get the public key of the transaction sender
    const address = this.transaction.sender;
    this.datasetList.set(dataset, address);
    this.metadataList.set(metadata, dataset);
  }
}
