import PanelBox from "./PanelBox";
import RecordBox from "./RecordBox";
import ExplainBox from "./ExplainBox";
export default () => {
  return (
    <div flex flex-1 h-292px shrink-0 data-tauri-drag-region>
      <PanelBox />
      <RecordBox />
      <ExplainBox />
    </div>
  );
};
