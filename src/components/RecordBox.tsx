import { createSignal } from "solid-js";
export default () => {
  const [showList, setShowList] = createSignal(true);
  const [list, setList] = createSignal(
    Array(30)
      .fill(0)
      .map((item) => 111)
  );
  function handelShowList() {
    setShowList(!showList());
  }

  return (
    <div mx-3px w-108px m-border flex flex-col>
      <div bg="#9DF" text-12px m-flex-between px-1>
        <span>棋谱序列</span>
        <span onclick={handelShowList}>
          [<span hover:underline>{showList() ? "隐藏" : "显示"}</span>]
        </span>
      </div>
      <div flex-1 m-scroll bg-white p-1px>
        <p m-active>====111====</p>
        {list().map((item) => (
          <p>{item}</p>
        ))}
      </div>
      <div bg="#9DF" h-14px></div>
    </div>
  );
};
