import PanelBox from "./components/PanelBox";
/* 仿照样式 https://www.xiangqiqipu.com/Category/View-34869.html */
function App() {
  return (
    <div px-4px flex flex-col h-full text-sm bg="#9CF" data-tauri-drag-region>
      <div w-full text-center py-1>
        aaaa
      </div>
      <div flex flex-1 h-292px shrink-0>
        <div flex-1 shrink-0 data-tauri-drag-region m-box-border w-230px>
          <PanelBox />
        </div>
        <div mx-3px w-108px m-box-border data-tauri-drag-region></div>
        <div w-148px m-box-border></div>
      </div>
      <div h-28px flex items-center shadow shrink-0 relative>
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
    </div>
  );
}

export default App;
