import {createDuraCore} from '../src/index'
import produce from 'immer'
import DuraImmer from 'dura-plugin-immer'

describe('demo', () => {

    it('should ', function () {
        const duraCore = createDuraCore();
        duraCore.addModel({
            namespace: "user",
            initialState: {
                name: "张三"
            },
            reducers: {
                s() {
                    console.log("ss")
                },
                a(state, {payload}) {
                    state.name = payload?.name
                }
            },
            effects: {
                * j() {
                    console.log("jj")
                },
                * k() {
                    console.log("kk")
                },
                o: [function* (a, b) {
                    console.log('oo')
                }, {type: 'throttle', ms: 50}]
            }
        }, {
            namespace: "23",
            initialState: {
                name: "张泗"
            },
            reducers: {
                b() {
                    console.log("bb")
                },
                d() {
                    console.log("dd")
                }
            },
            effects: {
                * k() {
                    console.log("kk")
                },
            }
        })


        const loadingPlugin = {
            namespace: 'loading',
            initialState: {},
            reducers: {
                onChangeStatus(state, {payload}) {
                    console.log("onChangeStatus",payload)
                    console.log("12",{...state , ...payload})
                    return {...state , ...payload}
                }
            },
            onEffect: function (effect, name, {put}) {
                return function* (...args) {
                    yield put({
                        type: 'loading/reducers/onChangeStatus',
                        payload: {
                            [name]: true
                        }
                    })
                    yield effect(...args)
                    yield put({
                        type: 'loading/reducers/onChangeStatus',
                        payload: {
                            [name]: false
                        }
                    })
                }
            }
        }

        duraCore.addPlugin(DuraImmer,loadingPlugin)


        duraCore.start()

        console.log(duraCore._reduxStore.getState())

        // duraCore._reduxStore.dispatch({type: 'user/reducers/a',payload: {name: "里斯"}})
        duraCore._reduxStore.dispatch({type: 'user/effects/o'})

        console.log(duraCore._reduxStore.getState())


        // duraCore._reduxStore.dispatch({type: 'user/effects/o', payload: {name: "里斯"}})
        // duraCore._reduxStore.dispatch({type: 'user/effects/o'})
        // duraCore._reduxStore.dispatch({type: 'user/effects/o'})
    });

})