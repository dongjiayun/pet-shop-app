<template>
    <!-- 索引列表 -->
    <view class="root" :style="{ height: height || contentHeight }">
        <!-- scroll-view 开启动画如果切换元素过快会出现不准确  -->
        <scroll-view
            :scroll-top="scrollTop"
            class="scrollView"
            :scroll-into-view="currentScrollIntoView"
            @scroll="scroll"
            scroll-y="true"
        >
            <!-- <slot name="topContent" /> -->
            <slot :indexList="indexList" v-if="list.length > 0" />
            <!-- <slot name="bottomContent" /> -->
        </scroll-view>

        <!--        <view class="indexBox" @touchend="touchend" @touchstart="touchstart" @touchmove="touchmove">-->
        <!--            <view-->
        <!--                class="index"-->
        <!--                :style="currentIndex == index ? `background:${indexActiveColor};color:white` : ''"-->
        <!--                v-for="(item, index) in indexList"-->
        <!--                :key="index"-->
        <!--            >-->
        <!--                {{ item.name }}-->
        <!--            </view>-->
        <!--        </view>-->

        <!--        <view class="moveBox" :class="isTouch ? 'show' : ''" :style="[moveBoxStyles]">-->
        <!--            <view class="text" v-if="currentIndex != null">-->
        <!--                {{ indexList[currentIndex].name }}-->
        <!--            </view>-->
        <!--        </view>-->
    </view>
</template>

<script>
import { convertPinyin, debounce } from "./utils/index.js";

import props from "./props";
export default {
    name: "indexList",
    props,
    data() {
        return {
            children: [],
            contentHeight: uni.getSystemInfoSync().windowHeight + "px",
            currentIndex: null, // 当前索引
            currentScrollIntoView: "", // 位移元素(由于跳转元素不在一个页面中，再加上uni不能动态slot) 故用scrollTop替代
            scrollTop: 0,
            indexList: [], // 数据
            indexBoxInfo: {
                height: 0, // 高度
                childHeight: 0, // 单个子节点高度,
                top: 0, //距离顶部的高度 ， 手指移入实践是从最顶部开始计算的
                moveBoxHeight: 0, // 移动盒子的高度
            },
            isTouch: false, // 是否为手指滑动期间，滑动期间不处理滚动事件
        };
    },

    methods: {
        getDomInfo(selector, all) {
            // 可一次查多个元素selectAll
            return new Promise((resolve) => {
                uni.createSelectorQuery()
                    .in(this)
                    [all ? "selectAll" : "select"](selector)
                    .boundingClientRect((rect) => {
                        if (all && Array.isArray(rect) && rect.length) {
                            resolve(rect);
                        }
                        if (!all && rect) {
                            resolve(rect);
                        }
                    })
                    .exec();
            });
        },

        touchstart(e) {
            this.isTouch = true;
            // 只处理单个手指触摸
            this.touchElements(e.changedTouches[0].pageY);
        },

        touchElements(e) {
            this.goIndexView(
                Math.floor((e - this.indexBoxInfo.top) / this.indexBoxInfo.childHeight)
            );
        },

        touchmove(e) {
            this.isTouch = true;
            this.touchElements(e.changedTouches[0].pageY);
        },

        touchend() {
            // 防止动画消失太快
            setTimeout(() => {
                this.isTouch = false;
            }, 300);
        },

        getChildComponentsList() {
            // vue3移除了$children，在子组件中通过 $parent 传过来
            // #ifdef VUE3
            // #ifdef H5
            return this.children;
            // #endif
            return this.$children;
            // #endif

            // #ifdef H5
            return this.$children[0].$children[0].$children;
            // #endif

            // #ifdef APP-PLUS
            return this.$children;
            // #endif

            //  #ifndef  VUE3
            return this.$children[0].$children;
            // #endif
        },

        async goIndexView(index) {
            if (index == this.currentIndex) return;
            index = index > this.indexList.length - 1 ? this.indexList.length - 1 : index;
            index = index < 0 ? 0 : index;
            this.currentIndex = index;
            let height = 0;
            this.getChildComponentsList().map((item, i) => {
                if (i <= index - 1) {
                    height += item.height;
                }
            });
            this.scrollTop = height;
            // this.currentScrollIntoView = `lineBox${index}`
        },

        scroll: debounce(async function (e) {
            if (this.isTouch) return;
            let height = 0;
            let indexs = 0;
            this.getChildComponentsList().map((item, index) => {
                height += item.height;
                if (e.detail.scrollTop >= height) {
                    indexs = index + 1;
                }
            });
            this.currentIndex = indexs;
        }, 0),

        async initData() {
            let generateArray = () => {
                let array = JSON.parse(JSON.stringify(this.list));
                array.map((item, index) => {
                    item.name = item[this.retrieveProperties];
                    item.pinyin = convertPinyin(item[this.retrieveProperties], 1);
                });
                let arrGenerate = [];
                for (var i = 0; i < 26; i++) {
                    var letter = String.fromCharCode(65 + i);
                    let obj = {
                        name: letter,
                        data: [],
                    };
                    array.map((item, index) => {
                        if (item.pinyin == letter || item.pinyin == letter.toLowerCase())
                            obj.data.push(item);
                    });
                    if (this.showEmptyDataElement || obj.data.length > 0) {
                        arrGenerate.push(obj);
                    }
                }
                return arrGenerate;
            };
            this.indexList = generateArray();

            this.$nextTick(() => {
                setTimeout(async () => {
                    let indexBoxDomInfo = await this.getDomInfo(".indexBox");
                    let moveBoxInfo = await this.getDomInfo(".moveBox");
                    indexBoxDomInfo.moveBoxHeight = moveBoxInfo.height;
                    indexBoxDomInfo.childHeight = indexBoxDomInfo.height / this.indexList.length;
                    this.indexBoxInfo = indexBoxDomInfo;
                });
            });
        },
    },

    async mounted() {
        this.initData();
    },

    created() {
        // if(this.height) return
        // let height = uni.getSystemInfoSync().windowHeight
        // // #ifdef H5
        // if(!this.h5NoTopBar){
        // 	height -= 44
        // }
        // // #endif
        // this.contentHeight = height + 'px'
    },

    computed: {
        moveBoxStyles() {
            let { childHeight, top, moveBoxHeight } = this.indexBoxInfo;

            let calcTop = childHeight * (this.currentIndex + 1) - moveBoxHeight / 2 + top;

            // #ifdef H5
            if (!this.h5NoTopBar) {
                calcTop += 44;
            }
            // #endif
            let style = {
                top: calcTop + "px",
                ...this.moveBoxStyle,
            };
            return style;
        },
    },
    options: {
        styleIsolation: "shared",
        virtualHost: true,
    },

    watch: {
        list() {
            this.initData();
        },
    },
};
</script>

<style lang="scss" scoped>
.root {
    position: relative;

    .scrollView {
        height: 100%;
        // background: seagreen;
        overflow: auto;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .indexBox {
        z-index: 999;
        top: 50%;
        transform: translate(0, -50%);
        display: flex;
        position: absolute;
        flex-direction: column;
        right: 0;
        gap: 5rpx;

        .index {
            width: 35rpx;
            height: 35rpx;
            color: white;
            font-size: 26rpx;
            font-weight: bold;
            color: #606266;
            display: flex;
            align-items: center;
            border-radius: 50%;
            justify-content: center;
        }

        // .active {
        // 	background: #4293f7;
        // 	color: white;

        // }
    }

    .moveBox {
        z-index: 99;
        width: 100rpx;
        height: 100rpx;
        background: white;
        position: fixed;
        right: 60rpx;
        top: 0;
        transform: rotate(-45deg);
        border-radius: 100px 100px 0 100px;
        transition: all 0.2s;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
            transform: rotate(45deg);
            // color: white;
            font-size: 30rpx;
        }
    }

    .noShow {
    }

    .show {
        opacity: 1;
    }
}
</style>
