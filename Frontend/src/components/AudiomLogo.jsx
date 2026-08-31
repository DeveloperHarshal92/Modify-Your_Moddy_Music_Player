export const AudiomLogo = ({ size = "default" }) => {
  const isLarge = size === "large";
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${isLarge ? "w-10 h-10" : "w-8 h-8"} rounded-[4px] bg-[#ffffff] text-[#121212]`}>
      <div className="flex items-center justify-center gap-[2.5px] px-1.5">
        <span className="w-[2.5px] h-2.5 bg-[#121212] rounded-[1px] bar-bounce-1" />
        <span className="w-[2.5px] h-4.5 bg-[#121212] rounded-[1px] bar-bounce-2" />
        <span className="w-[2.5px] h-3.5 bg-[#121212] rounded-[1px] bar-bounce-3" />
        <span className="w-[2.5px] h-2 bg-[#121212] rounded-[1px] bar-bounce-4" />
      </div>
    </div>
  );
};

export default AudiomLogo;

