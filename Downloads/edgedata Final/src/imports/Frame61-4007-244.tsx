import svgPaths from "./svg-b9hc562t65";

function Frame() {
  return (
    <div className="absolute h-[33.75px] left-0 top-0 w-[45px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 34">
        <g id="Frame 41">
          <path d={svgPaths.p26904b00} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p2ccc1a10} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p39ebc000} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p2cc33d00} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p37fc0900} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[0.01%] left-0 right-[4.2%] top-[-0.01%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 137 15">
        <g id="Group">
          <path d={svgPaths.p3b4b56f0} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p2cf21100} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p3870f880} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.pb71300} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p2126300} fill="var(--fill-0, white)" id="Vector_5" />
          <path d={svgPaths.p27759580} fill="var(--fill-0, white)" id="Vector_6" />
          <path d={svgPaths.p30a1ac0} fill="var(--fill-0, white)" id="Polygon 1" />
          <path d={svgPaths.p19200380} fill="var(--fill-0, white)" id="Vector_7" />
          <path d={svgPaths.p2df19700} fill="var(--fill-0, white)" id="Vector_8" />
        </g>
      </svg>
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute bottom-0 contents left-0 right-[4.2%] top-0" data-name="Layer 1">
      <Group />
    </div>
  );
}

function Asset() {
  return (
    <div className="h-[14.116px] overflow-clip relative shrink-0 w-[143px]" data-name="Asset 3 2">
      <Layer />
      <div className="absolute inset-[37.61%_8.52%_25.69%_88.78%]">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6">
            <path d={svgPaths.p126dc000} fill="var(--fill-0, white)" id="Polygon 1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center left-[57px] top-[0.88px] w-[143px]">
      <Asset />
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="relative size-full">
      <Frame />
      <Frame1 />
      <div className="absolute flex flex-col font-['Open_Sans:Bold',sans-serif] font-bold inset-[26.67%_3.08%_12.89%_86.34%] justify-center leading-[0] text-[12.903px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">360</p>
      </div>
    </div>
  );
}