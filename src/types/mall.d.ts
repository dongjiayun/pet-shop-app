declare interface Product{
    productId?: number,
    productName?: string,
    coverImgUrl?: string,
    salePrice?: number,
    saleCount?: number
}

declare interface Sku {
    productId?: number;
    productIdVersion?: number;
    skuNo?: string;
    skuName?: string;
    salePrice?: number;
    unitPrice?: number;
    skuImgLink?: string;
    combined?: boolean;
    stockQty?: number;
    stockStatus?: number;
    restrict?: boolean;
    subscribe?: boolean;
    purchasedCount?: number;
    specPairs?: Array<any>;
}

declare interface ProductDetail{
    productId?: number,
    attrs?:{
        [key:string]:string
    },
    bannerImgUrls?:Array<string>,
    discountTags?:Array<string>,
    imgDetails?:string,
    isPreSale?:boolean,
    multiSpec?:boolean,
    product?:number,
    productName ?:string,
    productType?:number,
    referenced?:boolean,
    salePrice?:number,
    skuInfos?:Array<Sku>,
    specAttrVos:Array<any>,
    status ?:number,
    tagList ?:Array<string>,
    versionId?:number,
    preSalePolicy?:{
        shippingTimeType?:string,
        afterPaidDays?:number
    }
}

declare interface Address {
    id?: number;
    name: string;
    phoneNo: string;
    province: string;
    city: string;
    area: string;
    detailAddress: string;
    fullAddress: string;
    zipCode?: string;
    defaultAddress: boolean;
}

declare type AddressList = Address[]

declare interface Area {
    id: number;
    name: string;
    code: string;
    children?: AreaList
}

declare type AreaList = Area[]

/**
 * OrderConfirmInfoVo，订单确认页展示信息
 */
declare interface OrderConfirmInfoVo {
    /**
     * 运费
     */
    freightFee: number;
    /**
     * 赠品券优惠金额
     */
    giftCouponDiscountPrice: number;
    /**
     * 订单待支付积分（积分商品适用该参数）
     */
    orderTotalPoints?: number;
    /**
     * 订单待支付金额
     */
    orderTotalPrice: number;
    receiveAddress?: Address;
    /**
     * sku订单商品详细信息
     */
    skuOrderDetailList: SkuOrderDetailVo[];
    /**
     * 商品总价
     */
    skuTotalPrice: number;
}

/**
 * SkuOrderDetailVo，sku订单商品详细信息
 */
declare interface SkuOrderDetailVo {
    /**
     * 活动id
     */
    activityId?: string;
    /**
     * 售后单id
     */
    afterSaleId?: number;
    /**
     * 售后单号
     */
    afterSaleOrderNo?: string;
    /**
     * 是否组合sku
     */
    combined: boolean;
    /**
     * 券id
     */
    couponId?: string;
    /**
     * sku优惠金额
     */
    discountPrice: number;
    /**
     * sku商品封面图片url
     */
    imgLink: string;
    /**
     * 购买数量
     */
    num: number;
    /**
     * 订单号
     */
    orderNo: string;
    /**
     * sku商品原价
     */
    originPrice: number;
    /**
     * sku实付金额
     */
    paidPrice: number;
    /**
     * 商品id
     */
    productId: number;
    /**
     * 商品版本
     */
    productVersion: number;
    /**
     * sku售价
     */
    salePrice: number;
    /**
     * sku商品名称
     */
    skuName: string;
    /**
     * sku编号
     */
    skuNo: string;
    /**
     * sku规格，逗号分隔
     */
    specs?: string;
}

/**
 * OrderBriefVo，订单列表信息
 */
declare interface OrderBriefVo {
    /**
     * 下单时间
     */
    createOrderTime: string;
    /**
     * 运费
     */
    freightPrice: number;
    /**
     * 是否预售单
     */
    isPreSale: boolean;
    /**
     * 订单编号
     */
    orderNo: string;
    /**
     * 订单状态：1-待付款、2-待发货、3-待收货、4-已完成、99-已取消
     */
    orderStatus: number;
    /**
     * 订单类型，1-普通订单、2-活动订单、3-兑换单、4-虚拟商品订单、5-赠品单、6-预售单、7-自提单、8-积分全额兑订单、9-积分超值抵订单
     */
    orderType: number;
    /**
     * （预售单）计划发货时间
     */
    planShippingTime?: string;
    /**
     * 确认收货时间
     */
    receiveTime?: string;
    /**
     * 订单sku商品信息列表
     */
    skuOrderDetailList: SkuOrderDetailVo[];
    /**
     * 订单过期时间
     */
    timeoutTime: string;
    /**
     * 订单实付积分（仅适用积分商品订单）
     */
    totalPoints?: number;
    /**
     * 订单合计金额
     */
    totalPrice: number;
}

/**
 * PabOrderDetailVo，平安银行-订单详细信息
 */
declare interface PabOrderDetailVo {
    /**
     * 自动确认收货时间
     */
    autoReceiveTime?: string;
    /**
     * 下单时间
     */
    createTime: string;
    /**
     * 发货时间
     */
    deliveryTime?: string;
    /**
     * 订单优惠金额
     */
    discountPrice?: number;
    /**
     * 运费
     */
    freightFee: number;
    /**
     * 订单号
     */
    orderNo: string;
    /**
     * 订单状态：1-待付款、2-待发货、3-待收货、4-已完成、99-已取消
     */
    orderStatus: number;
    /**
     * 订单类型：1-普通单、2-活动单、3-兑换单、4-虚拟商品单
     */
    orderType: number;
    /**
     * 支付时间
     */
    paidTime?: string;
    /**
     * 支付方式
     */
    payType?: string;
    receiverInfo: OrderReceiverInfoVo;
    /**
     * 订单备注
     */
    remark: string;
    /**
     * sku订单商品详细信息
     */
    skuOrderDetailList: SkuOrderDetailVo[];
    /**
     * 商品合计金额
     */
    skuTotalPrice: number;
    /**
     * 订单过期时间
     */
    timeoutTime: string;
    /**
     * 订单合计金额
     */
    totalPrice: number;
}

/**
 * OrderReceiverInfoVo，订单收货人基本信息
 */
declare interface OrderReceiverInfoVo {
    /**
     * 完整收货地址
     */
    fullAddress: string;
    /**
     * 收货地址id
     */
    name: string;
    /**
     * 收货地址id
     */
    phoneNo: string;
}

/**
 * ExpressInfoVo，查询订单快递包裹信息返回
 */
declare interface ExpressInfoVo {
    /**
     * 快递公司编码
     */
    express?: string;
    /**
     * 快递公司编码
     */
    expressName?: string;
    /**
     * 快递单号
     */
    expressNo?: string;
}
