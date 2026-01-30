import svgPaths from "./svg-eas2cgy8w3";
import { imgFocusRipple } from "./svg-hixqq";

function IconAi() {
  return (
    <div className="relative shrink-0 size-[26.667px]" data-name="Icon/AI">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Icon/AI">
          <path d={svgPaths.p2d522070} fill="var(--fill-0, #387FF5)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SmallEyebrowTagLabelStyle() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10.667px] items-center px-[12px] py-[8px] relative rounded-[60px] shrink-0" data-name="Small eyebrow tag label/Style 1">
      <div aria-hidden="true" className="absolute border-[#b6bccd] border-[1.333px] border-solid inset-0 pointer-events-none rounded-[60px] shadow-[0px_0px_1.333px_0px_rgba(44,58,114,0.05),0px_2.667px_8px_0px_rgba(44,58,114,0.05),0px_13.333px_24px_0px_rgba(58,76,146,0.1)]" />
      <IconAi />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.6] not-italic relative shrink-0 text-[#1a3c8c] text-[21.333px] text-center text-nowrap whitespace-pre">Resilient Intelligence Engine</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[120px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute bg-clip-text font-['PT_Sans:Bold',sans-serif] leading-[60px] left-[576.3px] not-italic text-[64px] text-[rgba(0,0,0,0)] text-center top-[0.11px] translate-x-[-50%] w-[1050px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(rgb(3, 105, 161) 0%, rgb(26, 60, 140) 100%)" }}>
        The Resilient Platform for Manufacturing Data at the Edge
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[55.995px] relative shrink-0 w-[767.998px]" data-name="Paragraph">
      <div className="absolute font-['Open_Sans:Regular',sans-serif] leading-[28px] left-[383.66px] not-italic text-[#4a5565] text-[24px] text-center text-nowrap top-[-1px] translate-x-[-50%] whitespace-pre">
        <p className="mb-0">{`Securely connect, process, and synchronize industrial data from `}</p>
        <p>the factory floor to the cloud, guaranteed even during network outages.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[40px] items-center justify-center px-[20px] py-[40px] relative w-full">
          <SmallEyebrowTagLabelStyle />
          <Heading />
          <Paragraph />
        </div>
      </div>
    </div>
  );
}

function FocusRipple() {
  return (
    <div className="absolute inset-0 rounded-[4px]" data-name="focusRipple">
      <div className="absolute bg-white bottom-[38.1%] left-[calc(50%-0.5px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-96px_-27.5px] mask-size-[200px_55px] opacity-0 rounded-[100px] top-1/2 translate-x-[-50%] w-[7px]" data-name="focusRipple" style={{ maskImage: `url('${imgFocusRipple}')` }} />
    </div>
  );
}

function Base() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Base">
      <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[30px] relative shrink-0 text-[20px] text-center text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Request demo
      </p>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[55px] relative rounded-[60px] shadow-[0px_1px_18px_0px_rgba(0,0,0,0.12),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_3px_5px_-1px_rgba(0,0,0,0.2)] shrink-0 w-[200px]" data-name="Button 9">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[55px] items-center justify-center overflow-clip px-[40px] py-[10px] relative rounded-[inherit] w-[200px]">
        <FocusRipple />
        <Base />
      </div>
    </div>
  );
}

function FocusRipple1() {
  return (
    <div className="absolute inset-0 rounded-[4px]" data-name="focusRipple">
      <div className="absolute bg-[#e8f5ff] bottom-[38.1%] left-[calc(50%-0.5px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-96px_-27.5px] mask-size-[200px_55px] opacity-0 rounded-[100px] top-1/2 translate-x-[-50%] w-[7px]" data-name="focusRipple" style={{ maskImage: `url('${imgFocusRipple}')` }} />
    </div>
  );
}

function Base1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Base">
      <p className="bg-clip-text font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[30px] relative shrink-0 text-[20px] text-center text-nowrap whitespace-pre" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100" }}>
        Learn More
      </p>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[55px] relative rounded-[60px] shrink-0 w-[200px]" data-name="Button 10">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[55px] items-center justify-center overflow-clip px-[40px] py-[10px] relative rounded-[inherit] w-[200px]">
        <FocusRipple1 />
        <Base1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#5c9dff] border-solid inset-0 pointer-events-none rounded-[60px] shadow-[0px_1px_18px_0px_rgba(0,0,0,0.12),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_3px_5px_-1px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[58.947px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[15.995px] h-[58.947px] items-center justify-center pl-0 pr-[0.012px] py-0 relative w-full">
          <Button />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[30px] items-center left-[354px] top-[calc(50%-15.53px)] translate-y-[-50%] w-[1151.99px]">
      <Container />
      <Container1 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <Frame1 />
      <div className="absolute flex h-[701px] items-center justify-center left-[1192px] top-[-61px] w-[661px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[701px] relative w-[661px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 661 701">
              <path clipRule="evenodd" d={svgPaths.p336deb80} fill="url(#paint0_linear_3_353)" fillRule="evenodd" id="Vector" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_353" x1="651.028" x2="12.8181" y1="341.307" y2="341.307">
                  <stop offset="0.0182341" stopColor="white" stopOpacity="0" />
                  <stop offset="0.543269" stopColor="#608EF1" />
                  <stop offset="1" stopColor="#81A9FF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute h-[700px] left-0 top-[-61px] w-[652px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 652 700">
          <path clipRule="evenodd" d={svgPaths.p1d2ea800} fill="url(#paint0_linear_3_349)" fillRule="evenodd" id="Vector" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_349" x1="642.164" x2="12.6436" y1="340.82" y2="340.82">
              <stop offset="0.0182341" stopColor="white" stopOpacity="0" />
              <stop offset="0.543269" stopColor="#608EF1" />
              <stop offset="1" stopColor="#81A9FF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}