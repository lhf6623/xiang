import { createSignal } from "solid-js";
export default () => {
  const [showList, setShowList] = createSignal(true);
  const [active, setActive] = createSignal(-1);
  const [list, setList] = createSignal(
    Array(30)
      .fill(0)
      .map((item) => 111)
  );
  function handelShowList() {
    setShowList(!showList());
  }

  return (
    <div mx-2px w-108px m-border flex flex-col>
      <div bg="#9DF" text-12px m-flex-between px-1>
        <span>棋谱序列</span>
        <span onclick={handelShowList}>
          [<span m-hover-text>{showList() ? "隐藏" : "显示"}</span>]
        </span>
      </div>
      <div flex-1 m-scroll-y bg-white p-1px>
        <p class={`${active() == -1 ? 'm-active':''}`}  onClick={() => setActive(-1)}>====111=====</p>
        {list().map((item, index) => (
          <p class={`${active() == index ? 'm-active':''}`} onClick={() => setActive(index)}>{item}</p>
        ))}
      </div>
      <div bg="#9DF" h-14px></div>
    </div>
  );
};
