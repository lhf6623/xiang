import { defineComponent, computed } from "vue";
import { NSwitch, NSpace, NSlider, NIconWrapper, NIcon } from "naive-ui";
import { useAppStore } from "/@/store/modules/xiang";
import { useMirrorStore } from "/@/store/modules/mirror";
import { Moon, MoonOutline, SunnyOutline, Sunny } from "@vicons/ionicons5";
import { useMirror } from "/@mirror/MirrorHook";
import { SettingType } from "/#/Type";

export default defineComponent({
  name: "SettingList",
  setup() {
    const store = useAppStore();

    const getIcon = computed(() => {
      let { bgOpacity } = store.setting;
      if (bgOpacity < 25) return Moon;
      if (bgOpacity >= 25 && bgOpacity < 50) return MoonOutline;
      if (bgOpacity >= 50 && bgOpacity < 75) return SunnyOutline;
      return Sunny;
    });

    return () => (
      <NSpace vertical={true}>
        <p class="flex flex-col justify-between items-center">
          <span>透明度</span>
          <NSlider
            step={1}
            tooltip={false}
            v-model={[store.setting.bgOpacity, "value"]}
            onUpdateValue={(value: number) => {
              store.setting.bgOpacity = value;
            }}
            v-slots={{
              thumb: () => (
                <NIconWrapper size={18} border-radius={12}>
                  <NIcon size={14} component={getIcon.value} />
                </NIconWrapper>
              ),
            }}
          />
        </p>
        <p class="flex justify-between items-center">
          <span>提示</span>
          <NSwitch
            size="small"
            v-slots={{
              checked: () => "开",
              unchecked: () => "关",
            }}
            v-model={[store.setting.tips, "value"]}
            onUpdateValue={(value: boolean) => {
              store.setting.tips = value;
            }}
          />
        </p>
        <p class="flex justify-between items-center">
          <span>方向</span>
          <NSwitch
            size="small"
            v-slots={{
              checked: () => "顺",
              unchecked: () => "逆",
            }}
            checked-value="rotate(0deg)  translateZ(0)"
            unchecked-value="rotate(180deg)  translateZ(0)"
            v-model={[store.setting.transformStyle, "value"]}
            onUpdateValue={(value: SettingType["transformStyle"]) => {
              store.setting.transformStyle = value;
            }}
          />
        </p>
      </NSpace>
    );
  },
});