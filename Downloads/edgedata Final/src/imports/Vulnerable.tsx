import svgPaths from "./svg-s0lkfmbjcp";

function Icon() {
  return (
    <div className="absolute left-[59.91px] size-[64px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Icon">
          <path d="M32 53.3333H32.0267" id="Vector" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p33b1c100} id="Vector_2" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p3da00100} id="Vector_3" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p2230f60} id="Vector_4" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p27454d00} id="Vector_5" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p1ff4ec00} id="Vector_6" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          <path d={svgPaths.p9889e80} id="Vector_7" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[28px] left-0 top-[72px] w-[183.813px]" data-name="Paragraph">
      <p className="absolute font-['Montserrat:Medium',sans-serif] leading-[28px] left-[92.5px] not-italic text-[#ffa2a2] text-[20px] text-center text-nowrap top-px translate-x-[-50%] whitespace-pre">Vulnerable to Failure</p>
    </div>
  );
}

function CloudCard() {
  return (
    <div className="h-[100px] relative shrink-0 w-[183.813px]" data-name="CloudCard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[100px] relative w-[183.813px]">
        <Icon />
        <Paragraph />
      </div>
    </div>
  );
}

export default function Vulnerable() {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] relative rounded-[24.324px] size-full" data-name="vulnerable">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex items-center justify-center pl-0 pr-[0.016px] py-0 relative size-full">
          <CloudCard />
        </div>
      </div>
    </div>
  );
}