/** 地址表单校验 */
export const ADDRESS_RULES = {
  name: { required: true, minLength: 2, maxLength: 20, message: '收货人姓名 2-20 位' },
  phone: { required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
  detail: { required: true, minLength: 5, maxLength: 120, message: '详细地址 5-120 位' },
}

/** 默认种子地址 */
export const SEED_ADDRESSES = [
  {
    id: 1,
    name: '张三',
    phone: '13888888888',
    tag: '家',
    region: '上海市 浦东新区',
    detail: '张江路 88 号 LUMIÈRE 公寓 3 栋 1201',
    isDefault: true,
  },
  {
    id: 2,
    name: '李四',
    phone: '13999999999',
    tag: '公司',
    region: '北京市 朝阳区',
    detail: '望京 SOHO T3 座 15 层 1502',
    isDefault: false,
  },
  {
    id: 3,
    name: '王五',
    phone: '13777777777',
    tag: '学校',
    region: '杭州市 西湖区',
    detail: '浙大路 38 号 浙江大学玉泉校区 7 舍 301',
    isDefault: false,
  },
]

/** 地址标签色板 */
export const ADDRESS_TAG_COLORS = {
  '家': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  '公司': { bg: 'bg-sea-50', text: 'text-sea-600', border: 'border-sea-200' },
  '学校': { bg: 'bg-olive-50', text: 'text-olive-600', border: 'border-olive-200' },
  '其他': { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200' },
}

export const ADDRESS_TAGS = ['家', '公司', '学校', '其他']
