// @flow
import * as React from "react";
export type * from "./flow-types.js";

type Rest = $ReadOnlyArray<any>;
type Callback = (...Rest) => Promise<mixed>;

function useRpcCallback<T: Callback>(factory: number, deps?: ?string): boolean {
  return false;
}

export const FlowButton = () => {
  console.log(useRpcCallback);
  return (
    <>
      <h1>Flow Buttonna</h1>
    </>
  );
};
