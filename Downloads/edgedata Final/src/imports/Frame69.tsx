import svgPaths from "./svg-6j2fciwtjw";

function Frame2() {
  return (
    <div className="h-[35px] relative shrink-0 w-[54px]">
      <div className="absolute inset-[-0.21%_0_-3.25%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 36.2121">
          <g id="Frame 55">
            <path d={svgPaths.p3e873560} fill="var(--fill-0, #0369A1)" id="Vector" />
            <path d={svgPaths.p3be67500} fill="var(--fill-0, #0369A1)" id="Vector_2" />
            <path d={svgPaths.p457500} fill="var(--fill-0, #0369A1)" id="Vector_3" />
            <path d={svgPaths.p2c448e30} fill="var(--fill-0, #0369A1)" id="Vector_4" />
            <path d={svgPaths.p3a952800} fill="var(--fill-0, white)" id="Vector_5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[17.645px] relative shrink-0 w-[85.502px]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.502 17.6453">
        <g id="Group">
          <path d={svgPaths.p10898a00} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p22aec300} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p13458580} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p38c1cec0} fill="var(--fill-0, white)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[0.07%] right-[0.13%] top-[calc(50%-0.05px)] translate-y-[-50%]" data-name="Frame">
      <Group />
    </div>
  );
}

function Asset() {
  return (
    <div className="absolute h-[17px] left-0 overflow-clip top-[2px] w-[86px]" data-name="Asset 3 2">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[14.099px] left-0 top-[22.51px] w-[65.32px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 65.3199 14.0993">
        <g id="Frame">
          <path d={svgPaths.pc33a500} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p1446890} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p3d927400} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.pb2e5780} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p22f47f00} fill="var(--fill-0, white)" id="Polygon 1" />
          <path d={svgPaths.p1c0c3e00} fill="var(--fill-0, white)" id="Polygon 2" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[37px] relative shrink-0 w-[95px]">
      <Asset />
      <Frame1 />
      <div className="absolute flex flex-col font-['Outfit:Bold',sans-serif] font-bold inset-[67.57%_0_-2.7%_67.37%] justify-center leading-[0] text-[#0369a1] text-[14px] text-center">
        <p className="leading-[normal]">360</p>
      </div>
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center relative size-full">
      <Frame2 />
      <Frame3 />
    </div>
  );
}