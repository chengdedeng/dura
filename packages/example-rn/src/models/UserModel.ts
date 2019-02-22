import { EffectAPI } from "@dura/async";
import { LoadingMeta } from "@dura/async-loading";
import { reducerRunner, RootState } from "../store";
import { createSelector } from "reselect";

const initialState = {
  /**
   * 姓名
   */
  name: "默认姓名" as string,
  /**
   * 性别
   */
  sex: undefined as "男" | "女",
  /**
   * 年龄
   */
  age: undefined as number
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    /**
     *
     * @param payload 同步修改姓名
     */
    onChangeName(state: State, action: { payload: { newName: string } }): State {
      state.name = action.payload.newName;
      return state;
    }
  },
  effects: {
    /**
     * 异步修改姓名
     * @param payload
     */
    async onAsyncChangeName(action: { payload: { newName: string }; meta: LoadingMeta }, effectApi: EffectAPI) {
      await effectApi.delay(2000);
      reducerRunner.user.onChangeName(action.payload);
    }
  }
};
