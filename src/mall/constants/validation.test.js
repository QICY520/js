import { describe, it, expect } from 'vitest'
import { validatePassword, validatePhone, ADDRESS_PHONE_RULES } from './validation'
import { formatPayCountdown } from '@/mall/hooks/usePayCountdown'
import { buildLogisticsTimeline } from './logistics'
import { ORDER_STATUS } from './order'

const baseOrder = {
  id: 182,
  payTime: '2026/6/14 21:11:22',
  createTime: '2026/6/14 21:11:01',
}

describe('validatePassword', () => {
  it('拒绝空密码或过短密码', () => {
    expect(validatePassword('')).toBe('密码至少 6 位')
    expect(validatePassword('abc12')).toBe('密码至少 6 位')
  })

  it('要求同时包含字母和数字', () => {
    expect(validatePassword('abcdef')).toBe('密码需包含数字')
    expect(validatePassword('123456')).toBe('密码需包含字母')
  })

  it('合法密码返回 null', () => {
    expect(validatePassword('abc123')).toBeNull()
    expect(validatePassword('User2024')).toBeNull()
  })
})

describe('validatePhone', () => {
  it('校验中国大陆手机号', () => {
    expect(validatePhone('')).toBe('请输入手机号')
    expect(validatePhone('12345')).toBe('请输入正确的手机号')
    expect(validatePhone('13800138000')).toBeNull()
  })
})

describe('ADDRESS_PHONE_RULES', () => {
  it('包含必填与格式规则', () => {
    expect(ADDRESS_PHONE_RULES[0].required).toBe(true)
    expect(ADDRESS_PHONE_RULES[1].pattern.test('13800138000')).toBe(true)
    expect(ADDRESS_PHONE_RULES[1].pattern.test('12345')).toBe(false)
  })
})

describe('formatPayCountdown', () => {
  it('格式化为 mm:ss', () => {
    expect(formatPayCountdown(901)).toBe('15:01')
    expect(formatPayCountdown(59)).toBe('00:59')
    expect(formatPayCountdown(-3)).toBe('00:00')
  })
})

describe('buildLogisticsTimeline', () => {
  it('待发货仅展示备货提示，无快递轨迹', () => {
    const steps = buildLogisticsTimeline({ ...baseOrder, status: ORDER_STATUS.PENDING_SHIP })
    expect(steps).toHaveLength(1)
    expect(steps[0].status).toBe('待发货')
    expect(steps[0].detail).toContain('暂未')
  })

  it('待收货展示运输中轨迹，不含签收', () => {
    const steps = buildLogisticsTimeline({ ...baseOrder, status: ORDER_STATUS.PENDING_RECEIVE })
    expect(steps.some((s) => s.status === '派送中')).toBe(true)
    expect(steps.some((s) => s.status === '已签收')).toBe(false)
  })

  it('待评价及之后展示完整签收记录', () => {
    const steps = buildLogisticsTimeline({ ...baseOrder, status: ORDER_STATUS.PENDING_REVIEW })
    expect(steps.some((s) => s.status === '已签收')).toBe(true)
  })
})
