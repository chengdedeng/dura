import { create, createActionCreator } from "@dura/core";
import { EffectAPI, ExtractRootState, ExtractRootActionRunner, DuraStore } from "@dura/types";
import loading, { ExtractLoadingState, LoadingMeta } from "../src/index";

describe("测试loading 插件", function() {
  it("测试loading 插件", function(done) {
    const user = {
      state: {
        /**
         * 姓名
         */
        name: undefined,
        sex: undefined
      },
      reducers: {
        onChangeName(payload: { name: string }): any {
          return function(state) {
            return { ...state, ...payload };
          };
        }
      },
      effects: {
        /**
         * 异步获取用户信息
         * @param param0
         */
        onAsyncChangeName(payload: { name: string }, meta: LoadingMeta) {
          return async function(request: EffectAPI) {
            await request.delay(1500);
            store.actionRunner.user.onChangeName(payload);
          };
        }
      }
    };

    const initialModel = {
      /**
       * 用户模块
       */
      user
    };

    type RootAction = ExtractRootActionRunner<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel> & ExtractLoadingState<typeof initialModel>;

    const store = create({
      initialModel,
      plugins: [loading]
    }) as DuraStore<RootState, RootAction>;

    expect(store.getState().user).toEqual({ name: undefined, sex: undefined });

    store.actionRunner.user.onAsyncChangeName({ name: "张三" }, { loading: true });

    setTimeout(() => expect(store.getState().loading.user.onAsyncChangeName).toEqual(true), 300);

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("张三");
      expect(store.getState().loading.user.onAsyncChangeName).toEqual(false);
      done();
    }, 2000);
  });
});
