import { createSignal } from "solid-js";
export default () => {
  const [showList, setShowList] = createSignal(true);
  function handelShowList() {
    setShowList(!showList());
  }
  return (
    <div mx-3px w-108px m-box-border flex flex-col>
      <div bg="#9DF" text-12px flex justify-between items-center px-1>
        <span>棋谱序列</span>
        <span onclick={handelShowList}>
          [<span hover:underline>{showList() ? "隐藏" : "显示"}</span>]
        </span>
      </div>
      <div flex-1 overflow-y-auto bg-white>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
        <p>111</p>
      </div>
      <div bg="#9DF" h-14px></div>
    </div>
  );
};
