<template>
  <div class="create">
    <div class="form">
      <div class="form-item">
        <span class="label">发票类型</span>
        <div class="radio-group">
          <div class="radio" :class="{ active: form.type === 1 }" @click="form.type = 1">个人</div>
          <div class="radio" :class="{ active: form.type === 2 }" @click="form.type = 2">企业</div>
        </div>
      </div>
      <div class="form-item">
        <span class="label">发票抬头</span>
        <input type="text" v-model="form.title" placeholder="请输入发票抬头" class="input" />
      </div>
      <div class="form-item">
        <span class="label">税号</span>
        <input type="text" v-model="form.taxNumber" :placeholder="form.type === 1 ? '请输入纳税人身份证号' : '请输入纳税人识别号'" class="input" :class="{ 'error': taxNumberError }" />
      </div> 
      <div class="form-item">
        <span class="label">已确认订单</span>
        <div class="order-list">
          <div v-for="(order, index) in orders" :key="order.id" class="order-item">
            <span class="order-number">{{ order.orderId }}</span>
            <span class="order-amount">¥{{ order.itemAmount }}</span>
            <div class="delete-btn" @click="handleDeleteOrder(index)">删除</div>
          </div>
        </div>
      </div>
      <div class="form-item">
        <span class="label">发票金额</span>
        <div class="input">¥ {{ form.amount }}</div>
      </div>
      <div class="form-item">
        <span class="label">邮箱</span>
        <input type="email" v-model="form.email" placeholder="请输入邮箱" class="input" :class="{ 'error': emailError }" />
      </div>
      <div class="form-item">
        <span class="label">地址（选填）</span>
        <input type="text" v-model="form.address" placeholder="请输入地址" class="input" />
      </div>
      <div class="form-item">
        <span class="label">手机号（选填）</span>
        <input type="tel" v-model="form.mobile" placeholder="请输入手机号" class="input" />
      </div>
      <div class="form-item">
        <span class="label">开户行（选填）</span>
        <input type="text" v-model="form.bankName" placeholder="请输入开户行" class="input" />
      </div>
      <div class="form-item">
        <span class="label">银行账号（选填）</span>
        <input type="text" v-model="form.bankAccountNo" placeholder="请输入银行账号" class="input" />
      </div>
      <div class="form-item">
        <span class="label">备注（选填）</span>
        <input type="text" v-model="form.remark" placeholder="请输入备注" class="input" />
      </div>
    </div>
    <div class="submit" @click="handleSubmit">
      <div class="submit-btn">提交</div>
    </div>
    <div class="submit-blank">
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/hooks/useNotification';
import { createInvoice } from '@/api/order';

const { message } = useNotification();

const orders = ref<any>([]);
const invoiceAmount = ref(0);

const handleDeleteOrder = (index: number) => {
  if (orders.value.length <= 1) {
    message({ title: '至少需要保留一个订单' });
    return;
  }
  orders.value.splice(index, 1);
  calculateTotalAmount();
};

const calculateTotalAmount = () => {
  const total = orders.value.reduce((sum: any, order: any) => sum + order.itemAmount, 0);
  form.value.amount = total.toString();
  invoiceAmount.value = total;
};

onLoad((options: any) => {
  if (options.orders) {
    orders.value = JSON.parse(decodeURIComponent(options.orders));
    calculateTotalAmount();
  }
  if (options.invoiceAmount) {
    invoiceAmount.value = parseFloat(options.invoiceAmount);
    form.value.amount = options.invoiceAmount;
  }
  console.log(orders.value, invoiceAmount.value);
});

const form = ref({
  title: '',
  type: 1, // 1: 个人, 2: 企业
  taxNumber: '',
  amount: '',
  email: '',
  address: '',
  mobile: '',
  bankName: '',
  bankAccountNo: '',
  remark: ''
});

const emailError = ref(false);
const taxNumberError = ref(false);

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateIdCard = (idCard: string) => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
};

const validateSocialCreditCode = (code: string) => {
  const socialCreditCodeRegex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
  return socialCreditCodeRegex.test(code);
};

const handleSubmit = async () => {
  emailError.value = false;
  taxNumberError.value = false;

  if (!form.value.title) {
    message({ title: '请输入发票抬头' });
    return;
  }

  if (!form.value.email || !validateEmail(form.value.email)) {
    emailError.value = true;
    message({ title: '请输入正确的邮箱地址' });
    return;
  }

  if (!form.value.taxNumber) {
    taxNumberError.value = true;
    message({ title: form.value.type === 1 ? '请输入纳税人身份证号' : '请输入纳税人识别号' });
    return;
  }

  if (form.value.type === 1 && !validateIdCard(form.value.taxNumber)) {
    taxNumberError.value = true;
    message({ title: '请输入正确的身份证号' });
    return;
  }

  if (form.value.type === 2 && !validateSocialCreditCode(form.value.taxNumber)) {
    taxNumberError.value = true;
    message({ title: '请输入正确的统一社会信用代码' });
    return;
  }

  if (!form.value.amount) {
    message({ title: '请输入发票金额' });
    return;
  }

  try {
    // 转换订单金额为分单位
    const convertedOrders = orders.value.map((order: any) => ({
      ...order,
      itemAmount: order.itemAmount * 100
    }));
    
    const invoiceData = {
      orders: convertedOrders,
      invoiceType: form.value.type,
      invoiceTitle: form.value.title,
      taxNumber: form.value.taxNumber,
      invoiceAmount: parseFloat(form.value.amount) * 100, // 金额单位：分
      email: form.value.email,
      address: form.value.address,
      mobile: form.value.mobile,
      bankName: form.value.bankName,
      bankAccountNo: form.value.bankAccountNo,
      remark: form.value.remark
    };

    await createInvoice(invoiceData);
    message({ title: '开具发票成功' });
    uni.navigateBack();
  } catch (error) {
    message({ title: '开具发票失败，请重试' });
  }
};
</script>

<style lang="scss" scoped>
.create {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #f6f6f6;
  padding: 32rpx;
  box-sizing: border-box;

  .form {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 32rpx;

    &-item {
      margin-bottom: 32rpx;

      .label {
        display: block;
        font-size: 28rpx;
        margin-bottom: 16rpx;
      }

      .input {
        display: flex;
        align-items: center;
        width: 100%;
        height: 80rpx;
        border-radius: 12rpx;
        background-color: #f6f6f6;
        padding: 0 24rpx;
        box-sizing: border-box;
        font-size: 28rpx;

        &.error {
          border: 2rpx solid #ba2636;
        }
      }

      .radio-group {
        display: flex;
        gap: 24rpx;

        .radio {
          flex: 1;
          height: 80rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12rpx;
          background-color: #f6f6f6;
          font-size: 28rpx;
          color: rgba(40, 40, 40, 0.5);

          &.active {
            background-color: #ba2636;
            color: #fff;
          }
        }
      }
    }
  }

  .submit {
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 160rpx;
    background-color: #fff;
    color: #fff;
    font-size: 32rpx;
    border-radius: 12rpx;
    margin-top: 32rpx;
    border-top: 2rpx solid #eaedf1 !important;

    &-blank {
      width: 100%;
      height: 160rpx;
    }

    &-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
      width: 400rpx;
      height: 80rpx;
      background-color: #000;
      color: #fff;
    }
  }
}

.order-list {
  .order-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background-color: #f6f6f6;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    font-size: 28rpx;

    .order-number {
      flex: 1;
      color: #282828;
    }

    .order-amount {
      margin: 0 20rpx;
      color: #ba2636;
    }

    .delete-btn {
      padding: 8rpx 16rpx;
      color: #ba2636;
      border: 2rpx solid #ba2636;
      border-radius: 8rpx;
      font-size: 24rpx;
    }
  }
}
</style>