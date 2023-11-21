import {
  RuntimeModule,
  runtimeModule,
  state,
  runtimeMethod,
} from "@proto-kit/module";
import { State, StateMap, assert } from "@proto-kit/protocol";
import { PublicKey, UInt64, Bool, Field, CircuitString } from "o1js";

interface TokensConfig {
  maxTokens: UInt64;
}

@runtimeModule()
export class Tokens extends RuntimeModule<TokensConfig> {
  @state() public dataOwners = StateMap.from<CircuitString, PublicKey>(
    CircuitString,
    PublicKey
  );

  @state() public maxTokens = State.from<UInt64>(UInt64);

  //   @runtimeMethod()
  //   public addBalance(address: PublicKey, amount: UInt64): void {
  //     const circulatingSupply = this.circulatingSupply.get();
  //     const newCirculatingSupply = circulatingSupply.value.add(amount);
  //     assert(
  //       newCirculatingSupply.lessThanOrEqual(this.config.totalSupply),
  //       "Circulating supply would be higher than total supply"
  //     );
  //     this.circulatingSupply.set(newCirculatingSupply);
  //     const currentBalance = this.balances.get(address);
  //     const newBalance = currentBalance.value.add(amount);
  //     this.balances.set(address, newBalance);
  //   }
}
