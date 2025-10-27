import { PROJECT_DATA, REDUX_LOCAL_STORE_KEY } from "@/shared/config";
import { RootState } from "@/shared/model/store";

export const loadState = async (): Promise<Partial<RootState> | undefined> => {
  const pageData = PROJECT_DATA.page;

  const rootState = { pageData };
  try {
    const serializedState = localStorage.getItem(REDUX_LOCAL_STORE_KEY);

    if (serializedState === null) {
      return rootState;
    }
    const serializedStateParsed = JSON.parse(serializedState);

    return { ...rootState, ...serializedStateParsed };
  } catch (err) {
    return rootState;
  }
};
