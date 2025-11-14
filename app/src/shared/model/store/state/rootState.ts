import { ExchangeReducerState } from "./exchangeReducerState";
import { FeaturesFlagsReducerState } from "./featuresFlagsReducerState";
import { PageDataReducerState } from "./pageDataReducerState";
import { RequestDetailsReducerState } from "./requestDetailsReducerState";
import { TransferAbroadReducerState } from "./transferAbroadReducerState";
import { UiReducerState } from "./uiReducerState";
import { UserReducerState } from "./userReducerState";

export type RootState = {
  ui: UiReducerState;
  user: UserReducerState;
  requestDetails: RequestDetailsReducerState;
  exchange: ExchangeReducerState;
  pageData: PageDataReducerState;
  featuresFlags: FeaturesFlagsReducerState;
  transferAbroad: TransferAbroadReducerState;

};
