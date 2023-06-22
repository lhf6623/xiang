import { content_arr, top_arr, button_arr } from "../data/panelCon";
import { piece_obj } from "../data/pieceCon";
import { createMemo } from "solid-js";
export default () => {
  const list = createMemo(() => {
    return content_arr.map((item, index) => {
      return {
        ...(piece_obj[`${index}`] ?? {}),
        ...item,
      };
    });
  });
  // w-230 h-290
  return (
    <div flex shrink-0 flex-col items-center m-border w-232px bg="#eed3b3">
      <div w-225px>
        {top_arr.map((item) => (
          <span w-25px inline-block text-center>
            {item}
          </span>
        ))}
      </div>
      <div w-225px flex-1 flex flex-wrap relative class="m-after-panel">
        {list().map((item) => (
          <p w-25px h-25px text-center leading-25px class={item.cla}>
            <span class="loc"></span>
            <span class={`piece ${item.type}`} data-name={item.text}></span>
          </p>
        ))}
      </div>
      <div w-225px>
        {button_arr.map((item) => (
          <span w-25px inline-block text-center>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
