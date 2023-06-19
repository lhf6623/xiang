import { content_arr, top_arr, button_arr } from "../data/panelCon";
export default () => {
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
        {content_arr.map((item) => (
          <span w-25px h-25px text-center leading-25px class={item.cla}></span>
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
