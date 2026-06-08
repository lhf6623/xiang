import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { ref } from 'vue';

// ---- mocks (vitest hoists these above imports) ----

vi.mock('@/composables/useGameMsg', () => ({
  useGameMsg: () => ({
    eventMsg: ref({ text: '', cls: '' }),
  }),
}));

const mockStore = {
  record_index: 0,
  record: { length: 3 },
  theme: 'light' as const,
  refreshGame: vi.fn(),
  readRecord: vi.fn(),
  toggleTheme: vi.fn(),
};

vi.mock('@/stores/app', () => ({
  useAppStore: () => mockStore,
  store: createPinia(),
}));

// imports after mocks
import { NumberList, GameMessage, Control, Active } from '@/components/BoardParts';

// ====== NumberList ======

describe('NumberList', () => {
  it('渲染字符串列表', () => {
    const wrapper = mount(NumberList, {
      props: { list: ['一', '二', '三'] },
    });

    const items = wrapper.findAll('li');
    expect(items).toHaveLength(3);
    expect(items[0].text()).toBe('一');
    expect(items[2].text()).toBe('三');
  });

  it('渲染数字列表', () => {
    const wrapper = mount(NumberList, {
      props: { list: [1, 2, 3, 4, 5] },
    });
    expect(wrapper.findAll('li')).toHaveLength(5);
  });

  it('空列表不渲染 li', () => {
    const wrapper = mount(NumberList, { props: { list: [] } });
    expect(wrapper.findAll('li')).toHaveLength(0);
  });

  it('默认 props 为空列表', () => {
    const wrapper = mount(NumberList);
    expect(wrapper.findAll('li')).toHaveLength(0);
  });
});

// ====== Active ======

describe('Active', () => {
  it('渲染 4 个角标并包含传入的 cls', () => {
    const wrapper = mount(Active, { props: { cls: 'border-red-500' } });

    const items = wrapper.findAll('li');
    expect(items).toHaveLength(4);
    items.forEach((li) => {
      expect(li.classes()).toContain('border-red-500');
    });
  });

  it('不同 cls 正常应用', () => {
    const wrapper = mount(Active, { props: { cls: 'border-blue-400' } });
    wrapper.findAll('li').forEach((li) => {
      expect(li.classes()).toContain('border-blue-400');
    });
  });
});

// ====== GameMessage ======

describe('GameMessage', () => {
  it('渲染 span 元素', () => {
    const wrapper = mount(GameMessage);
    expect(wrapper.find('span').exists()).toBe(true);
  });

  it('初始消息为空', () => {
    const wrapper = mount(GameMessage);
    expect(wrapper.find('span').text()).toBe('');
  });
});

// ====== Control ======

describe('Control', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('渲染四个按钮', () => {
    const wrapper = mount(Control);
    expect(wrapper.findAll('button')).toHaveLength(4);
  });

  it('"重新开始"按钮点击调用 refreshGame', async () => {
    const wrapper = mount(Control);
    await wrapper.findAll('button')[0].trigger('click');
    expect(mockStore.refreshGame).toHaveBeenCalled();
  });

  it('"上一步"按钮点击调用 readRecord(-1)', async () => {
    const wrapper = mount(Control);
    await wrapper.findAll('button')[1].trigger('click');
    expect(mockStore.readRecord).toHaveBeenCalledWith(-1);
  });

  it('"下一步"按钮点击调用 readRecord(1)', async () => {
    const wrapper = mount(Control);
    await wrapper.findAll('button')[2].trigger('click');
    expect(mockStore.readRecord).toHaveBeenCalledWith(1);
  });

  it('主题按钮点击调用 toggleTheme', async () => {
    const wrapper = mount(Control);
    await wrapper.findAll('button')[3].trigger('click');
    expect(mockStore.toggleTheme).toHaveBeenCalled();
  });

  it('显示主题 emoji（light → ☀️）', () => {
    mockStore.theme = 'light';
    const wrapper = mount(Control);
    expect(wrapper.findAll('button')[3].text()).toBe('☀️');
  });
});
