import svgPaths from "./svg-t03neq8lal";

function Frame2() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[119px]">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#808080] text-[16px] text-center text-nowrap">
        <p className="leading-[24px]">10</p>
      </div>
      <div className="h-0 relative shrink-0 w-[24px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
            <line id="Line 3" stroke="var(--stroke-0, #808080)" x2="24" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Sora:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#808080] text-[16px] text-center text-nowrap">
        <p className="leading-[24px]">Blogs</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[530px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[64px] not-italic relative shrink-0 text-[64px] text-white tracking-[-1.28px] w-full">
        <span className="font-['Sora:Regular',sans-serif] font-normal">Explore</span>
        <span className="font-['Poppins:Medium',sans-serif]"> </span>
        <span className="font-['Playfair_Display:Medium_Italic',sans-serif] italic">Blogs</span>
      </p>
    </div>
  );
}

function AngleRightSolid() {
  return (
    <div className="relative shrink-0 size-[15.6px]" data-name="angle-right-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6 15.6">
        <g clipPath="url(#clip0_6041_2582)" id="angle-right-solid">
          <path d={svgPaths.p31385b80} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_6041_2582">
            <rect fill="white" height="15.6" width="15.6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ButtonRounded() {
  return (
    <div className="content-stretch flex gap-[10.4px] h-[55.678px] items-center justify-center px-[26px] py-[13px] relative rounded-[1000px] shrink-0 w-[161.2px]" data-name="Button Rounded">
      <div aria-hidden="true" className="absolute border-[#353535] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[1000px]" />
      <div className="flex flex-col font-['Sora:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[15.6px] text-center text-nowrap text-white">
        <p className="leading-[normal]">All Articles</p>
      </div>
      <AngleRightSolid />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
      <Frame />
      <ButtonRounded />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Frame1 />
    </div>
  );
}

function Text() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[349.32px] place-items-start relative" data-name="Text">
      <p className="[grid-area:1_/_1] font-['Sora:Regular',sans-serif] font-normal leading-[32px] ml-0 mt-0 relative text-[24px] text-white tracking-[-0.24px] w-[368px]">Visual Website Tips #5</p>
    </div>
  );
}

function Image() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-[2px] mt-[64px] place-items-start relative" data-name="Image">
      <div className="[grid-area:1_/_1] bg-[#c4c4c4] h-[245px] ml-0 mt-0 rounded-[20px] w-[368px]" data-name="image" />
    </div>
  );
}

function ClockSolid() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="clock-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="clock-solid">
          <path d={svgPaths.p3476e300} fill="var(--fill-0, #808080)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Time() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[8px] items-center ml-[268px] mt-[10px] relative" data-name="Time">
      <ClockSolid />
      <p className="font-['Sora:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#494949] text-[12px] text-nowrap text-right uppercase">15 days ago</p>
    </div>
  );
}

function Avatar() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar">
      <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[32px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #242424)" id="Ellipse 48" r="16" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] ml-[16.5px] mt-[11px] not-italic relative text-[14px] text-center text-nowrap text-white translate-x-[-50%] uppercase">LD</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="font-['Sora:Regular',sans-serif] font-normal grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 text-nowrap" data-name="Text">
      <div className="[grid-area:1_/_1] flex flex-col justify-center ml-0 mt-[22.5px] relative text-[#808080] text-[12px] translate-y-[-50%]">
        <p className="leading-[16px] text-nowrap">Admin</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col justify-center ml-0 mt-[5px] relative text-[14px] text-white translate-y-[-50%] uppercase">
        <p className="leading-[20px] text-nowrap">Ryan Nguyen</p>
      </div>
    </div>
  );
}

function Author() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[16px] items-center leading-[0] ml-[2px] mt-0 relative" data-name="Author">
      <Avatar />
      <Text1 />
    </div>
  );
}

function Component2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[926px] mt-0 place-items-start relative" data-name="3">
      <Text />
      <Image />
      <Time />
      <Author />
    </div>
  );
}

function Line() {
  return (
    <div className="[grid-area:1_/_1] h-[444px] ml-[416px] mt-0 relative w-0" data-name="Line">
      <div className="absolute inset-[0_-1px_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00002 444">
          <g id="Line">
            <line id="Line 22" stroke="var(--stroke-0, #2D2D2D)" x1="0.500022" x2="0.500003" y1="2.18556e-08" y2="444" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[349px] place-items-start relative" data-name="Text">
      <p className="[grid-area:1_/_1] font-['Sora:Regular',sans-serif] font-normal leading-[32px] ml-0 mt-0 relative text-[24px] text-white tracking-[-0.24px] w-[368px]">Common UX painpoints in Dashboard-related projects you must know</p>
    </div>
  );
}

function Image1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[64px] place-items-start relative" data-name="Image">
      <div className="[grid-area:1_/_1] bg-[#c4c4c4] h-[245px] ml-0 mt-0 rounded-[20px] w-[368px]" data-name="image" />
    </div>
  );
}

function ClockSolid1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="clock-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="clock-solid">
          <path d={svgPaths.p3476e300} fill="var(--fill-0, #808080)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Time1() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[8px] items-center justify-end ml-[273px] mt-[10px] relative" data-name="Time">
      <ClockSolid1 />
      <p className="font-['Sora:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#494949] text-[12px] text-nowrap text-right uppercase">5 days ago</p>
    </div>
  );
}

function Avatar1() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Avatar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Avatar">
          <circle cx="16" cy="16" fill="var(--fill-0, #C4C4C4)" id="Ellipse 48" r="16" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="font-['Sora:Regular',sans-serif] font-normal grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 text-nowrap" data-name="Text">
      <div className="[grid-area:1_/_1] flex flex-col justify-center ml-0 mt-[22.5px] relative text-[#808080] text-[12px] translate-y-[-50%]">
        <p className="leading-[16px] text-nowrap">Editor</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col justify-center ml-0 mt-[5px] relative text-[14px] text-white translate-y-[-50%] uppercase">
        <p className="leading-[20px] text-nowrap">M Moussa</p>
      </div>
    </div>
  );
}

function Author1() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[16px] items-center ml-0 mt-0 relative" data-name="Author">
      <Avatar1 />
      <Text3 />
    </div>
  );
}

function Component1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[464px] mt-0 place-items-start relative" data-name="2">
      <Line />
      <Text2 />
      <Image1 />
      <Time1 />
      <Author1 />
    </div>
  );
}

function Line1() {
  return (
    <div className="[grid-area:1_/_1] h-[444px] ml-[416px] mt-0 relative w-0" data-name="Line">
      <div className="absolute inset-[0_-1px_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00002 444">
          <g id="Line">
            <line id="Line 22" stroke="var(--stroke-0, #2D2D2D)" x1="0.500022" x2="0.500003" y1="2.18556e-08" y2="444" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[349px] place-items-start relative" data-name="Text">
      <p className="[grid-area:1_/_1] [text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Sora:Regular',sans-serif] font-normal leading-[32px] ml-0 mt-0 relative text-[24px] text-white tracking-[-0.24px] underline w-[368px]">We’re winner SOTY at CSS Award 2023</p>
    </div>
  );
}

function Image2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[64px] place-items-start relative" data-name="Image">
      <div className="[grid-area:1_/_1] bg-[#c4c4c4] h-[245px] ml-0 mt-0 rounded-[20px] w-[368px]" data-name="image" />
    </div>
  );
}

function ClockSolid2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="clock-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="clock-solid">
          <path d={svgPaths.p3476e300} fill="var(--fill-0, #808080)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Time2() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[8px] items-center ml-[256px] mt-[10px] relative" data-name="Time">
      <ClockSolid2 />
      <p className="font-['Sora:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#494949] text-[12px] text-nowrap text-right uppercase">12 hours ago</p>
    </div>
  );
}

function Avatar2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Avatar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Avatar">
          <circle cx="16" cy="16" fill="var(--fill-0, #C4C4C4)" id="Ellipse 48" r="16" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="font-['Sora:Regular',sans-serif] font-normal grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 text-nowrap" data-name="Text">
      <div className="[grid-area:1_/_1] flex flex-col justify-center ml-0 mt-[22.5px] relative text-[#808080] text-[12px] translate-y-[-50%]">
        <p className="leading-[16px] text-nowrap">Editor</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col justify-center ml-0 mt-[5px] relative text-[14px] text-white translate-y-[-50%] uppercase">
        <p className="leading-[20px] text-nowrap">M Moussa</p>
      </div>
    </div>
  );
}

function Author2() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[16px] items-center ml-0 mt-0 relative" data-name="Author">
      <Avatar2 />
      <Text5 />
    </div>
  );
}

function Component() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative" data-name="1">
      <Line1 />
      <Text4 />
      <Image2 />
      <Time2 />
      <Author2 />
    </div>
  );
}

function Posts() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Posts">
      <Component2 />
      <Component1 />
      <Component />
    </div>
  );
}

function AngleLeftSolid() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="angle-left-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="angle-left-solid">
          <path d={svgPaths.pe16df00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Dots() {
  return (
    <div className="h-[7px] relative shrink-0 w-[91px]" data-name="Dots">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 91 7">
        <g id="Dots">
          <circle cx="3.5" cy="3.5" fill="var(--fill-0, white)" id="Ellipse 1" r="3.5" />
          <circle cx="24.5" cy="3.5" fill="var(--fill-0, #999999)" id="Ellipse 2" r="3.5" />
          <circle cx="45.5" cy="3.5" fill="var(--fill-0, #999999)" id="Ellipse 3" r="3.5" />
          <circle cx="66.5" cy="3.5" fill="var(--fill-0, #999999)" id="Ellipse 4" r="3.5" />
          <circle cx="87.5" cy="3.5" fill="var(--fill-0, #999999)" id="Ellipse 5" r="3.5" />
        </g>
      </svg>
    </div>
  );
}

function AngleRightSolid1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="angle-right-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="angle-right-solid">
          <path d={svgPaths.p156e6680} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Pagination() {
  return (
    <div className="content-stretch flex gap-[24px] h-[36px] items-center justify-center px-[14px] py-0 relative rounded-[30px] shrink-0" data-name="Pagination">
      <div aria-hidden="true" className="absolute border border-[#2e2e2e] border-solid inset-0 pointer-events-none rounded-[30px]" />
      <AngleLeftSolid />
      <Dots />
      <AngleRightSolid1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-center relative shrink-0 w-full">
      <Posts />
      <Pagination />
    </div>
  );
}

export default function Blogs() {
  return (
    <div className="content-stretch flex flex-col gap-[100px] items-start px-0 py-[120px] relative size-full" data-name="Blogs">
      <Frame3 />
      <Frame4 />
    </div>
  );
}