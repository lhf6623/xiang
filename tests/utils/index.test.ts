import { describe, it, expect } from 'vitest';
import { getRange, version_key } from '@/utils/index';

// ====== getRange ======

describe('getRange', () => {
  it('value 在范围内返回原值', () => {
    expect(getRange(5, 0, 10)).toBe(5);
  });

  it('value 小于 start 时返回 start', () => {
    expect(getRange(-3, 0, 10)).toBe(0);
  });

  it('value 大于 end 时返回 end', () => {
    expect(getRange(15, 0, 10)).toBe(10);
  });

  it('边界值 start 返回 start', () => {
    expect(getRange(0, 0, 10)).toBe(0);
  });

  it('边界值 end 返回 end', () => {
    expect(getRange(10, 0, 10)).toBe(10);
  });

  it('单参数时为 [0, start] 区间', () => {
    expect(getRange(5, 10)).toBe(5);
    expect(getRange(-1, 10)).toBe(0);
    expect(getRange(15, 10)).toBe(10);
  });

  it('单参数 0 时始终返回 0', () => {
    expect(getRange(0, 0)).toBe(0);
    expect(getRange(-1, 0)).toBe(0);
    expect(getRange(5, 0)).toBe(0);
  });

  it('start > end 时自动交换', () => {
    expect(getRange(5, 10, 0)).toBe(5);
    expect(getRange(-1, 10, 0)).toBe(0);
    expect(getRange(15, 10, 0)).toBe(10);
  });

  it('负数区间', () => {
    expect(getRange(-5, -10, -1)).toBe(-5);
    expect(getRange(-15, -10, -1)).toBe(-10);
    expect(getRange(0, -10, -1)).toBe(-1);
  });
});

// ====== version_key ======

describe('version_key', () => {
  it('应包含应用名称的大写形式', () => {
    expect(version_key).toContain('XIANG-APP');
  });

  it('应包含版本号', () => {
    // version 是 0.3.4，key 中应有版本号部分
    expect(version_key).toMatch(/XIANG-APP_\d+\.\d+\.\d+/);
  });

  it('应全为大写', () => {
    expect(version_key).toBe(version_key.toUpperCase());
  });
});
