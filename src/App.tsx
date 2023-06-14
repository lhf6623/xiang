import PanelBox from "./components/PanelBox";
/* 仿照样式 https://www.xiangqiqipu.com/Category/View-34869.html */
function App() {
  return (
    <div px-4px flex flex-col h-full text-sm bg="#9CF" data-tauri-drag-region>
      <div w-full text-center p-2>
        兑子争先--王嘉良弃兵入杀
      </div>
      <div flex flex-1 h-292px>
        <div flex-1 shrink-0 data-tauri-drag-region box-1 w-230px>
          <PanelBox />
        </div>
        <div mx-3px w-108px box-1></div>
        <div w-148px box-1></div>
      </div>
      <div mt-6px h-18px shadow>
        <button un-leading>开始</button>
      </div>
    </div>
  );
}

export default App;
