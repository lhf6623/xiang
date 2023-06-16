export default () => {
  return (
    <div h-30px flex items-center relative shrink-0 data-tauri-drag-region>
      <button m-button mr-2px>
        开局
      </button>
      <button m-button mr-2px>
        后退
      </button>
      <button m-button mr-2px>
        前进
      </button>
      <button m-button mr-2px>
        终局
      </button>
      <span text-xs inline-block px-12px text-blue-900>
        0/29
      </span>
      <button m-button mr-2px>
        自动
      </button>
      <button m-button mr-2px>
        旋转
      </button>
      <button m-button mr-2px>
        对称
      </button>
      <button m-button mr-2px>
        保存
      </button>
      <button m-button mr-2px>
        研究
      </button>
      <button m-button absolute right-0 text="#FF0000" px-3>
        棋谱搜索
      </button>
    </div>
  );
};
