export default () => {
  return (
    <div h-30px flex items-center shadow shrink-0 relative>
      <button button-box mr-2px>
        开局
      </button>
      <button button-box mr-2px>
        后退
      </button>
      <button button-box mr-2px>
        前进
      </button>
      <button button-box mr-2px>
        终局
      </button>
      <span text-xs inline-block px-12px text-blue-900>
        0/29
      </span>
      <button button-box mr-2px>
        自动
      </button>
      <button button-box mr-2px>
        旋转
      </button>
      <button button-box mr-2px>
        对称
      </button>
      <button button-box mr-2px>
        保存
      </button>
      <button button-box mr-2px>
        研究
      </button>
      <button button-box absolute right-0 text-red font-bold px-3>
        棋谱搜索
      </button>
    </div>
  );
};
