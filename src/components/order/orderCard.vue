<template>
<div class="orderCard m-16" @click.stop="showModalBg = false">
  <u-skeleton rows="6" title :loading="loading" :rowsWidth="['100%']"
    :rowsHeight="['30px', '20px', '40px', '22px', '32px', '40px']">
    <template v-if="listLength">
      <div v-for="(_item, _i) in list" :key="_i" class="rounded-base pt-24 mb-16 bg-white">
        <div class="flex mx-16 justify-between pb-12 mb-16 border-0 border-b-1 border-black-88">
          <div>
            <div class="flex items-center">
              <div class="mr-8 text-small text-lg text-lightblack text-nowrap">
                订单号: {{ _item.id }}
              </div>
              <img @click="copy(_item.id)" class="w-20 h-20" :src="getStaticFilePath('order/copy.png')" alt="" />
            </div>
          </div>
          <div class="text-bigRed text-lg text-medium text-nowrap">
            {{ getStatus(_item.orderStatus) }}
          </div>
        </div>

        <div class="body">
          <!-- 跟拍方式 价格 -->
          <div class="flex px-16">
            <div class="flex-1">
              <div class="flex leading-18 text-medium justify-between">
                <div
                  class="w-fit-content mb-12 rounded-x text-center bg-lightyellow-10 text-lightblack text-xs text-medium py-3 px-6">
                  {{ _item.spuDescribe }}
                </div>
                <div class="ml-16 text-base text-lightblack-20">399元起</div>
              </div>
            </div>
          </div>

          <!-- 时间地点摄影师备注 -->
          <div class="px-16 pt-16 bg-lightgray mt-4">
            <div v-show="_val" v-for="(_val, _key, _index) in _item.orderInfomation" :key="_index"
              class="flex text-medium pb-4">
              <div class="w-40 text-lightblack text-xs mr-12 text-overflow">
                {{ _key }}
              </div>
              <div class="text-lightblack-50 text-xs flex-1">
                {{ _val }}
                <span v-if="_key === '摄影师'" class="text-blue ml-10" @click="makeCall(_item.id)">联系摄影师</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="pb-24 bg-lightgray flex items-end px-16" :class="{
          'flex  justify-between items-end': _item.orderStatus !== 0,
        }">
          <div v-if="
            _item.orderStatus === 1 ||
            _item.orderStatus === 2 ||
            _item.orderStatus === 3 ||
            _item.orderStatus === 100
          " class="text-lightblack-50 text-base text-medium leading-20">
            <div class="text-nowrap" @click.stop="more(_i)">更多操作</div>

            <!-- 显示提示区域   内容 -->
            <div v-if="_item.showMore" class="info-panel-content">
              <!-- 显示提示框区域  三角区域 -->
              <div class="info-panel-triple"></div>
              <div class="px-16 pt-12 pb-6 leading-20" v-if="refundStatus.includes(_item.orderStatus)">
                <button class="contact-btn text-lightblack-20 text-xs" @click="navigateToRefund(_item.id, _i)">
                  申请退款
                </button>
              </div>
              <div v-if="_item.orderStatus === 100" class="px-16 leading-20 pb-12 pt-6">
                <button @click="issueInvoice(_i)" open-type="contact" class="text-lightblack-20 text-xs contact-btn">
                  开具发票
                </button>
              </div>
            </div>
          </div>
          <div class="flex-col items-end w-full text-base">
            <div class="text-right mb-12 pt-16 text-base leading-20 text-lightblack text-medium">
              实付款 <span class="ml-8">¥ {{ _item.orderAmt / 100 }}</span>
            </div>
            <div class="flex items-center" v-if="_item.orderStatus === 0">
              <!-- <div
                  v-if="_item.orderStatus === 0"
                  class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed"
                  @click.stop="useCode(_item)"
                >
                  取消订单
                </div> -->
              <div class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed ml-8" @click.stop="pay(_item)">
                去支付
              </div>
            </div>
            <div class="flex items-center" v-if="_item.orderStatus === 1">
              <!-- <div
                  class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed"
                >
                  撤销订单
                </div> -->
              <div class="text-bigRed">待摄影师确认订单</div>
            </div>
            <div v-if="_item.orderStatus === 2" @click.stop="useCode(_item)"
              class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed">
              点击验券(出示二维码)
            </div>
            <div class="text-bigRed" v-if="_item.orderStatus === 3">
              摄影师传图中
            </div>
            <div @click="refinePhotoClick(_item.id, _item.photoNum)" v-if="_item.orderStatus === 4"
              class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed">
              去选图（精修）
            </div>
            <div v-if="_item.orderStatus === 5" class="text-bigRed">
              摄影师修图中
            </div>
            <div v-if="_item.orderStatus === 20" class="text-bigRed">
              后台正处理中
            </div>
            <div @click="confirmOrderClick(_item.photographerId, _item.id)" v-if="_item.orderStatus === 6"
              class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed">
              查看精修图并确认交付
            </div>
            <div @click="toEvaluate(_item.photographerId, _item.id)" v-if="_item.orderStatus === 7"
              class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed">
              去评价
            </div>
            <div @click="viewBaseImageClick(_item.id)" v-if="_item.orderStatus === 100"
              class="px-12 py-4 rounded-xs text-bigRed border-1 border-bigRed">
              下载照片
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="mt-40">
      <empty v-if="currentIndex === 4" :isSuccess="false" :content="contentD"></empty>
      <empty v-else :isSuccess="false" :content="contentEmpty"></empty>
    </div>
  </u-skeleton>

  <div v-if="showModalBg" class="showModalBg">
    <img class="modalImg" :src="getStaticFilePath('order/modalbg.png')" alt="" />
    <div class="showModalContent flex">
      <div class="text-lg leading-22 text-lightblack-10 text-bold mb-16">
        确认码
      </div>
      <!-- 二维码 -->
      <div>
        <canvas id="qrcode" canvas-id="qrcode" style="width: 180px; height: 180px"></canvas>
      </div>
      <div class="text-xs text-lightblack-45 leading-15 text-medium mt-16">
        {{ remark }}
      </div>

      <img class="w-286 h-1 mt-32" :src="getStaticFilePath('packageHome/assets/line.png')" alt="" />
      <!-- 跟拍信息 -->
      <div class="mt-32 px-16 w-full">
        <div class="flex leading-18 text-medium justify-between items-center mx-20">
          <div
            class="w-fit-content rounded-x text-center bg-lightyellow-10 text-lightblack text-xs text-medium py-3 px-6">
            {{ qrcodeData.spuDescribe }}
          </div>
          <div class="ml-16 text-base text-lightblack-20">
            ¥399起
          </div>
        </div>
        <!--
          <div class="mt-8 text-xs text-lightblack-50 text-medium">
            {{ qrcodeData }}
          </div> -->
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from "vue";
import UQRCode from "uqrcodejs";
import empty from "@/componets/empty.vue";
import { submitPayOrders, getTmpPhone, getQrCode } from "@/utils/orderApi/api";

export default Vue.extend({
  components: { empty },
  props: {
    currentIndex: {
      type: Number,
      default: 0,
    },
    orderData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    orderData: {
      handler(value, oldValue) {
        this.getList(value, oldValue);
      },
    },
  },
  data() {
    return {
      listLength: true,
      loading: true,
      showModalBg: false,
      qrcodeData: {},
      remark: "出示此券码给摄影师确认订单",
      list: [],
      codeImg: "",
      contentD: "摄影师还在传图中，请您耐心等待，有问题请联系客服",
      refundStatus: [...Array.from({ length: 7 }).keys()].map(key => key + 1)
    };
  },
  computed: {
    contentEmpty() {
      return uni.getStorageSync("token")
        ? `您还没有${this.getCurrent(this.currentIndex)}订单哦`
        : "去登录";
    },
  },
  methods: {
    copy(_id) {
      wx.setClipboardData({
        data: _id,
        success(res) {
          console.log("成功复制代码");
        },
        fail(err) {
          console.error("复制失败", err);
        },
      });
    },
    pay(_item) {
      const _par = {
        id: _item.id,
        channelCode: "yeepay_wx_lite_ofl",
        openId: uni.getStorageSync("openid"),
      };

      setTimeout(async () => {
        const _paydata = await submitPayOrders(_par);

        if (!_paydata.data) {
          uni.showToast({
            title: _paydata.msg,
            icon: "none",
          });
          return;
        }
        this.$pingpp.createPayment(
          _paydata.data.charges.data[0],
          function (res, err) {
            if (res === "success") {
              this.getList();
            } else if (res === "fail") {
              uni.showToast({
                title: "支付失败",
                icon: "error",
              });
            } else if (res === "cancel") {
              uni.showToast({
                title: "支付取消",
                icon: "error",
              });
            }
          }
        );
      }, 500);
    },
    async canvas(_id) {
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = _id;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = 180;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext("qrcode", this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();
    },
    async getList(value, oldValue) {
      if (!oldValue?.length && value?.length) this.loading = true;

      if (this.currentIndex === 0) {
        this.list = this.orderData.filter((_item) => {
          return _item.orderStatus === 0;
        });
      } else if (this.currentIndex === 1) {
        this.list = this.orderData.filter((_item) => {
          return _item.orderStatus === 1;
        });
      } else if (this.currentIndex === 2) {
        this.list = this.orderData.filter((_item) => {
          return (
            _item.orderStatus === 2 ||
            _item.orderStatus === 3 ||
            _item.orderStatus === 4 ||
            _item.orderStatus === 5 ||
            _item.orderStatus === 6 ||
            _item.orderStatus === 7 ||
            _item.orderStatus === 20
          );
        });
      } else if (this.currentIndex === 3) {
        this.list = this.orderData.filter((_item) => {
          return (
            _item.orderStatus === 100 ||
            _item.orderStatus === 10 ||
            _item.orderStatus === 30
          );
        });
      } else if (this.currentIndex === -1) {
        this.list = this.orderData;
      }

      const _this = this;
      this.list.forEach(async (ele) => {
        _this.$set(ele, "showMore", false);
        var dateObj = new Date(ele.appointmentStartTime);
        var year = dateObj.getFullYear();
        var month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // JavaScript中月份从0开始计算，所以需要加1
        var day = dateObj.getDate().toString().padStart(2, "0");
        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes().toString().padStart(2, "0");
        _this.$set(ele, "orderInfomation", {
          时间:
            year +
            "." +
            month +
            "." +
            day +
            "  " +
            hours +
            ":" +
            minutes +
            "-" +
            (hours + 2) +
            ":" +
            minutes,
          备注: ele.remark,
          摄影师: ele.photographerName + "  " + ele.photographerPhone || "",
          地点: ele.location,
        });
      });

      this.listLength = this.list.length > 0 ? true : false;

      setTimeout(() => {
        if (!oldValue?.length && value?.length) this.loading = false
      }, 1000);
    },
    getStatus(_status) {
      let orderStatus = "";
      switch (_status) {
        case 0:
          orderStatus = "待支付";
          break;
        case 1:
          orderStatus = "待确认";
          break;
        case _status >= 2 && _status <= 7 ? _status : -1:
          orderStatus = "进行中";
          break;
        case 100:
          orderStatus = "已完成";
          break;
        case 10:
          orderStatus = "已取消";
          break;
        case 20:
          orderStatus = "后台处理中";
          break;
        case 30:
          orderStatus = "已退款";
          break;
        default:
          orderStatus = "";
          break;
      }
      return orderStatus;
    },
    refinePhotoClick(_id, _photoNum) {
      uni.navigateTo({
        url: `/packageOrder/refinePhoto?orderId=${_id}&photoNum=${_photoNum}`,
      });
    },
    confirmOrderClick(_photographId, _id) {
      uni.navigateTo({
        url: `/packageOrder/confirmOrder?photographId=${_photographId}&orderId=${_id}`,
      });
    },
    viewBaseImageClick(_id) {
      uni.navigateTo({
        url: `/packageOrder/index?orderId=${_id}`,
      });
    },
    async makeCall(_id) {
      console.log("🚀 ~ makeCall ~ _id:", _id);
      const _data = await getTmpPhone(_id);
      console.log("🚀 ~ makeCall ~ _data:", _data.data);
      const _phone = _data?.data;

      if (!_phone) return this.callFailed();

      uni.makePhoneCall({
        phoneNumber: _phone,
        success: () => {
          console.log("拨打电话成功！");
        },
        fail: () => this.callFailed(),
      });
    },
    callFailed() {
      uni.$u.toast(`获取手机号失败，请联系客服。`)
    },
    more(_i) {
      this.list.forEach((item, index) => {
        if (_i === index) {
          item.showMore = !item.showMore;
        } else {
          item.showMore = false;
        }
      });
    },
    /**
     * 跳转到退款页面
     * @param {string} orderId 订单id
     * @param {number} index 索引
     */
    navigateToRefund(orderId, index) {
      this.list[index].showMore = false;
      uni.navigateTo({
        url: `/packageOrder/refund?&orderId=${orderId}`,
      })
    },
    issueInvoice() { },
    toEvaluate(_photographId, _id) {
      uni.navigateTo({
        url: `/packageOrder/evaluate?photographId=${_photographId}&orderId=${_id}`,
      });
    },
    async useCode(_item) {
      this.showModalBg = true;
      this.qrcodeData = _item;
      const _data = await getQrCode(_item.id);
      console.log("🚀 ~ useCode ~ _data:", _data);
      this.canvas(_data.data);
    },
    getCurrent(_current) {
      let _val = " ";
      switch (_current) {
        case -1:
          _val = "";
          break;
        case 0:
          _val = "待支付";
          break;
        case 1:
          _val = "待确认";
          break;
        case 2:
          _val = "进行中";
          break;
        case 3:
          _val = "已完成";
          break;

        default:
          break;
      }
      return _val;
    },
  },
});
</script>

<style scoped>
.photo-img {
  width: 72px;
  height: 90px;
}

.info-panel-triple {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom-color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -16px;
}

.info-panel-content {
  box-shadow: 0px 8px 22px 0px #0000001f;
  left: 16px;
  display: inline-block;
  position: absolute;
  margin-top: 12px;
  background-color: #fff;
  text-align: left;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 550;
}

.showModalBg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.showModalContent {
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modalImg {
  min-width: 320px;
  height: 420px;
}

.maxw-218 {
  max-width: 218px;
}
</style>
../../../libs/dist/pingpp
