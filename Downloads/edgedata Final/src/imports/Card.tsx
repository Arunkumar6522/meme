import svgPaths from "./svg-fkzzhkeegh";

function Button() {
  return (
    <div className="absolute inset-[78.8%_11.61%_9.22%_11.9%] overflow-clip" data-name="Button">
      <div className="absolute bg-[#f9f2ff] inset-0 rounded-[26px]" data-name="Rectangle" />
      <p className="absolute font-['DMSans:Bold',sans-serif] leading-[normal] left-[30.93%] not-italic right-[30.54%] text-[#4e2d92] text-[14px] text-center text-nowrap top-[calc(50%-9px)] tracking-[-0.2333px]">Sign up for free</p>
    </div>
  );
}

function Check() {
  return (
    <div className="absolute inset-[15%_92.06%_20%_0]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
        <g id="check">
          <path d={svgPaths.p153f4200} fill="var(--fill-0, #4E2D92)" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[37.33%_31.85%_58.06%_11.9%] overflow-clip" data-name="Group">
      <Check />
      <p className="absolute font-['DMSans:Regular',sans-serif] leading-[normal] left-[14.29%] not-italic right-[0.53%] text-[15px] text-black text-nowrap top-[calc(50%-10px)]">Feature label goes here</p>
    </div>
  );
}

function Check1() {
  return (
    <div className="absolute inset-[15%_92.06%_20%_0]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
        <g id="check">
          <path d={svgPaths.p153f4200} fill="var(--fill-0, #4E2D92)" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[46.54%_31.85%_48.85%_11.9%] overflow-clip" data-name="Group">
      <Check1 />
      <p className="absolute font-['DMSans:Regular',sans-serif] leading-[normal] left-[14.29%] not-italic right-[0.53%] text-[15px] text-black text-nowrap top-[calc(50%-10px)]">Feature label goes here</p>
    </div>
  );
}

function Check2() {
  return (
    <div className="absolute inset-[15%_92.06%_20%_0]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
        <g id="check">
          <path d={svgPaths.p153f4200} fill="var(--fill-0, #4E2D92)" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[55.76%_31.85%_39.63%_11.9%] overflow-clip" data-name="Group">
      <Check2 />
      <p className="absolute font-['DMSans:Regular',sans-serif] leading-[normal] left-[14.29%] not-italic right-[0.53%] text-[15px] text-black text-nowrap top-[calc(50%-10px)]">Feature label goes here</p>
    </div>
  );
}

export default function Card() {
  return (
    <div className="relative size-full" data-name="Card">
      <div className="absolute bg-white inset-0 rounded-[20px] shadow-[0px_22px_24px_0px_rgba(213,207,177,0.33)]" data-name="Rectangle" />
      <Button />
      <p className="absolute font-['Circular_Std:Bold',sans-serif] leading-[normal] left-[12.8%] not-italic right-[63.1%] text-[40px] text-black text-center text-nowrap top-[calc(50%-177px)]">Free</p>
      <p className="absolute font-['DMSans:Regular',sans-serif] leading-[normal] left-[11.9%] not-italic opacity-40 right-[39.58%] text-[15px] text-black text-nowrap top-[calc(50%-115px)]">Try it as long as you like</p>
      <Group />
      <Group1 />
      <Group2 />
    </div>
  );
}