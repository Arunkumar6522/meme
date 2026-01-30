import svgPaths from "./svg-hggi7o8if2";

function Icon() {
  return (
    <div className="h-[64px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 59 59">
            <path d={svgPaths.p3c6d9e00} id="Vector" stroke="var(--stroke-0, #05DF72)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
            <path d={svgPaths.p3c136880} id="Vector" stroke="var(--stroke-0, #05DF72)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[64px] items-start pl-[59.141px] pr-[59.156px] py-0 relative w-full">
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Montserrat:Medium',sans-serif] leading-[28px] left-[91px] not-italic text-[#7bf1a8] text-[20px] text-center text-nowrap top-px translate-x-[-50%] whitespace-pre">Enterprise Reliability</p>
    </div>
  );
}

function EdgeCard() {
  return (
    <div className="h-[100px] relative shrink-0 w-[182.297px]" data-name="EdgeCard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[100px] items-start relative w-[182.297px]">
        <Container />
        <Paragraph />
      </div>
    </div>
  );
}

export default function EnterPriseReliable() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[24.324px] size-full" data-name="enter prise reliable" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(153.922deg, rgba(89, 22, 139, 0) 0%, rgba(13, 84, 43, 0) 100%)" }}>
      <EdgeCard />
    </div>
  );
}