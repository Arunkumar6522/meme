import svgPaths from "./svg-o4h069mbzk";
import { imgRectangle } from "./svg-eqtau";

function Group() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Group">
      <div className="absolute flex h-[522px] items-center justify-center left-0 top-0 w-[587px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[522px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-336.75px_-40px] mask-size-[751px_482px] w-[587px]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle}')` }} />
        </div>
      </div>
    </div>
  );
}

function Sapiens() {
  return (
    <div className="absolute contents left-[312.75px] top-[38px]" data-name="sapiens (9)">
      <Group />
    </div>
  );
}

function Rectangle() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#4e2d92] h-[434px] left-0 rounded-[20px] shadow-[0px_22px_24px_0px_rgba(78,45,146,0.43)] top-0 w-[703px]" data-name="Rectangle" />
      <Sapiens />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[40px] overflow-clip relative shrink-0 w-[143px]" data-name="Button">
      <div className="absolute bg-[#361c6c] inset-0 rounded-[26px]" data-name="Rectangle" />
      <p className="absolute font-['DMSans:Bold',sans-serif] leading-[normal] left-[20.63%] not-italic right-[19.93%] text-[10px] text-center text-nowrap text-white top-[calc(50%-6px)] tracking-[0.6667px]">RECOMMENDED</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-start flex flex-wrap gap-[11px_299px] items-start relative shrink-0 w-[623px]">
      <p className="font-['Circular_Std:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[40px] text-nowrap text-white">Unlimited</p>
      <Button />
      <p className="font-['DMSans:Regular',sans-serif] leading-[normal] not-italic opacity-40 relative shrink-0 text-[15px] text-nowrap text-white">Limtless possibilites</p>
    </div>
  );
}

function Check() {
  return (
    <div className="absolute inset-[15%_92.06%_20%_0]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
        <g id="check">
          <path d={svgPaths.p153f4200} fill="var(--fill-0, white)" id="Path" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-[189px]" data-name="Group">
      <Check />
      <p className="absolute font-['DMSans:Regular',sans-serif] leading-[normal] left-[14.29%] not-italic right-[0.53%] text-[15px] text-nowrap text-white top-[calc(50%-10px)]">Feature label goes here</p>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="relative size-full">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[25px] items-start p-[40px] relative size-full">
          <Rectangle />
          <Frame />
          {[...Array(4).keys()].map((_, i) => (
            <Group1 key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}