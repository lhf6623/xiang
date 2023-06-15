import ViewBox from "./components/ViewBox";
import ControlBox from "./components/ControlBox";
import TitleBox from "./components/TitleBox";

/* 仿照样式 https://www.xiangqiqipu.com/Category/View-34869.html */
function App() {
  return (
    <div px-4px flex flex-col h-full text-sm bg="#9CF" select-none data-tauri-drag-region>
      <TitleBox title="兑子争先--王嘉良弃兵入杀" />
      <ViewBox />
      <ControlBox />
    </div>
  );
}

export default App;
