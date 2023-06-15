interface TitleProps {
  title: string;
}

export default (props: TitleProps) => {
  return (
    <div w-full text-center py-1 data-tauri-drag-region>
      {props.title}
    </div>
  );
};
