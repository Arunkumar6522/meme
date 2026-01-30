function Container() {
  return <div className="absolute bg-[rgba(56,127,245,0.1)] h-[601.943px] left-[-0.5px] top-[0.22px] w-[1816.22px]" data-name="Container" />;
}

function Heading() {
  return (
    <div className="absolute h-[108.97px] left-0 top-0 w-[1297.3px]" data-name="Heading 2">
      <p className="absolute font-['DM_Sans:Bold',sans-serif] font-bold leading-[108.973px] left-[647.94px] text-[90.811px] text-center text-nowrap text-white top-[-0.54px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Ready to End Data Gaps?
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[103.784px] left-0 opacity-90 top-[147.89px] w-[1297.3px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[51.892px] left-[649px] not-italic text-[32.432px] text-center text-white top-[-3.78px] translate-x-[-50%] w-[1234.05px]">Join leading manufacturers who have eliminated data loss and accelerated their digital transformation with EdgeData.</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white h-[90.811px] left-[414.32px] rounded-[3.6275e+07px] shadow-[0px_32.432px_40.541px_-8.108px_rgba(0,0,0,0.1),0px_12.973px_16.216px_-9.73px_rgba(0,0,0,0.1)] top-[303.56px] w-[468.632px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[38.919px] left-[64.87px] not-italic text-[#387ff5] text-[25.946px] text-nowrap top-[23.24px] whitespace-pre">Request a Personalized Demo</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[394.375px] left-[258.96px] top-[104.01px] w-[1297.3px]" data-name="Container">
      <Heading />
      <Paragraph />
      <Button />
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-gradient-to-b from-[#387ff5] h-[601.943px] overflow-clip relative rounded-[38.919px] shrink-0 to-[#2d6ad4] w-full" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

export default function CtaSection() {
  return (
    <div className="bg-white relative size-full" data-name="CTASection">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start px-[51.892px] py-0 relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}