import svgPaths from "./svg-ak19c5cf75";

function Text() {
  return (
    <div className="absolute contents left-0 not-italic text-[#12141d] top-[80px]" data-name="text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[34px] left-0 text-[24px] text-nowrap top-[80px]">Multiple Modern Layouts</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 opacity-70 text-[16px] top-[129px] w-[311px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page quickly.</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-0 size-[40px] top-0" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="icon">
          <path d={svgPaths.pca2e200} fill="var(--fill-0, #008EFF)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p12373300} fill="var(--fill-0, #008EFF)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Feature() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Feature 1">
      <Text />
      <Icon />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute contents left-[431px] not-italic text-[#12141d] top-[80px]" data-name="text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[34px] left-[431px] text-[24px] text-nowrap top-[80px]">Built with TailwindCSS</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[431px] opacity-70 text-[16px] top-[129px] w-[311px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page quickly.</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[431px] size-[40px] top-0" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="icon">
          <path d={svgPaths.p1f4ed780} fill="var(--fill-0, #FABB18)" id="Vector" />
          <path d={svgPaths.p5ecc380} fill="var(--fill-0, #FABB18)" id="Vector_2" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}

function Feature1Copy() {
  return (
    <div className="absolute contents left-[431px] top-0" data-name="Feature 1 Copy">
      <Text1 />
      <Icon1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute contents left-[862px] not-italic text-[#12141d] top-[80px]" data-name="text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[34px] left-[862px] text-[24px] text-nowrap top-[80px]">Fully Responsive</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[862px] opacity-70 text-[16px] top-[129px] w-[311px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page quickly.</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute h-[40px] left-[862px] top-0 w-[39.999px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39.9993 39.9999">
        <g id="icon">
          <path d={svgPaths.p1cdbcc00} fill="var(--fill-0, #45C646)" id="Vector" />
          <path d={svgPaths.p11b910f0} fill="var(--fill-0, #45C646)" id="Vector_2" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}

function Feature1Copy1() {
  return (
    <div className="absolute contents left-[862px] top-0" data-name="Feature 1 Copy 2">
      <Text2 />
      <Icon2 />
    </div>
  );
}

export default function Content() {
  return (
    <div className="relative size-full" data-name="content">
      <Feature />
      <Feature1Copy />
      <Feature1Copy1 />
    </div>
  );
}