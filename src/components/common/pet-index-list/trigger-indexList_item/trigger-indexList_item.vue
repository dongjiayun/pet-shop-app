<template>
    <view class="lineBox">
        <view class="lineHeadBox">
            <!-- 头部可不传 -->
            <view class="lineHead" v-if="!$slots.lineHead">
                {{ item.name }}
            </view>
            <slot name="lineHead" />
        </view>
        <view class="lineBodyBox">
            <slot name="lineBody" />
        </view>
    </view>
</template>

<script>
import props from "./props";
export default {
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            top: 0,
            height: 0,
        };
    },
    options: {
        styleIsolation: "shared",
        virtualHost: true,
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
    },
    created() {
        // #ifndef VUE3
        // #ifdef  MP
        // 小程序 v2 层级不同
        this.$parent.$parent.children.push(this);
        return;
        // #endif
        // #endif

        // #ifdef APP-PLUS || MP
        this.$parent.children.push(this);
        // #endif

        // #ifdef H5
        this.$parent.$parent.$parent.children.push(this);
        // #endif
    },
    mounted() {
        this.$nextTick(async () => {
            let res = await this.getDomInfo(`.lineBox`);
            this.height = res.height;
            this.top = res.top;
        });
    },
};
</script>

<style lang="scss" scoped>
.lineBox {
    width: 100%;

    .lineHeadBox {
        position: sticky;
        top: 0;
        // background: w;
        z-index: 99;
        padding: 10rpx 0;
        background: #ffecf5;

        .lineHead {
            padding: 0 20rpx;
            box-sizing: border-box;
        }
    }
}
</style>
