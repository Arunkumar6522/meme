import svgPaths from "./svg-bikwhalqnc";
import { imgFocusRipple } from "./svg-kn8va";

function Frame2() {
  return (
    <div className="absolute h-[1080px] left-0 top-0 w-[1920px]">
      <div className="absolute h-[99px] left-[50px] top-[176px] w-[260px]" data-name="image 11" />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute content-stretch flex h-[90px] items-center left-0 px-[30.941px] py-[15.471px] rounded-[60px] top-0 w-[540px]" data-name="Input">
      <div aria-hidden="true" className="absolute border-[#757d83] border-[1.934px] border-solid inset-0 pointer-events-none rounded-[60px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[90px] relative shrink-0 w-full">
      <Input />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[90px] items-start left-0 top-0 w-[540px]">
      <Frame />
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative shrink-0 size-[26px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="Frame 1000004583">
          <path d={svgPaths.p3a307bd2} fill="var(--fill-0, #000E19)" id="mail" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[15px] h-[90px] items-center ml-0 mt-0 px-[31px] py-[30px] relative w-[540px]">
      <Frame1 />
      <Frame15 />
      <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#000e19] text-[18px] w-[441px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">admin@example.com</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Frame5 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-px items-center justify-center leading-[0] left-0 top-0 w-[540px]">
      <Group />
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[1.6] relative shrink-0 text-[16px] w-[478px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-0">{`Incorrect email or password. Please try again. `}</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute left-[31.36px] size-[26px] top-[30.07px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="Frame 1000004564">
          <path d={svgPaths.p1915f580} fill="var(--fill-0, #000E19)" id="lock" />
        </g>
      </svg>
    </div>
  );
}

function Eye() {
  return (
    <div className="absolute left-[484.07px] size-[20px] top-[33.07px]" data-name="Eye">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Eye">
          <path d={svgPaths.p53b5880} fill="var(--fill-0, #000E19)" id="Vector (Stroke)" />
          <path d={svgPaths.p35021680} fill="var(--fill-0, #000E19)" id="Vector (Stroke)_2" />
        </g>
      </svg>
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute border-[#000e19] border-[1.934px] border-solid h-[90px] left-0 rounded-[60px] top-0 w-[540px]" data-name="Input">
      <Frame4 />
      <div className="absolute flex flex-col font-['Open_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] left-[70.07px] text-[#000e19] text-[18px] top-[calc(50%+0.5px)] translate-y-[-50%] w-[401px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Admin@123</p>
      </div>
      <Eye />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute h-[122px] left-0 top-[127px] w-[540px]">
      <Input1 />
      <div className="absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[37px] text-[16px] top-[104px] translate-y-[-50%] w-[494px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[1.6]">{`Incorrect email or password. Please try again. `}</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[475px] left-1/2 top-[21px] translate-x-[-50%] w-[540px]">
      <Frame9 />
      <Frame10 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute h-[33px] left-1/2 top-0 translate-x-[-50%] w-[500px]">
      <div className="absolute flex flex-col font-['Open_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] left-[235px] text-[#1a3c8c] text-[20px] text-nowrap top-[16px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[1.6] whitespace-pre">OR</p>
      </div>
      <div className="absolute h-0 left-0 top-[17px] w-[210px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1.93px]" style={{ "--stroke-0": "rgba(117, 125, 131, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 210 2">
            <line id="Line 3" stroke="var(--stroke-0, #757D83)" strokeWidth="1.93" x2="210" y1="0.965" y2="0.965" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[290px] top-[17px] w-[210px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1.93px]" style={{ "--stroke-0": "rgba(117, 125, 131, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 210 2">
            <line id="Line 3" stroke="var(--stroke-0, #757D83)" strokeWidth="1.93" x2="210" y1="0.965" y2="0.965" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function InputComponent8MicrosoftSvgrepoCom() {
  return (
    <div className="absolute left-[22px] size-[43px] top-[22px]" data-name="Input/Component 8/microsoft_svgrepo.com">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 43">
        <g id="Input/Component 8/microsoft_svgrepo.com">
          <path d={svgPaths.p25631200} fill="var(--fill-0, #FEBA08)" id="Vector" />
          <path d={svgPaths.p282d2700} fill="var(--fill-0, #43ABFF)" id="Vector_2" />
          <path d={svgPaths.p2e619000} fill="var(--fill-0, #80BC06)" id="Vector_3" />
          <path d={svgPaths.p2f19eb00} fill="var(--fill-0, #F25325)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white relative rounded-[45px] shadow-[0px_4px_20.8px_0px_rgba(0,0,0,0.25)] shrink-0 size-[87px]" data-name="Input">
      <InputComponent8MicrosoftSvgrepoCom />
      <div className="absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-[142.5px] not-italic opacity-0 text-[#000e19] text-[16px] text-center top-[43.5px] translate-x-[-50%] translate-y-[-50%] w-[149px]">
        <p className="leading-[normal]">Continue with Microsoft</p>
      </div>
    </div>
  );
}

function DeviconGoogle() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[43px]" data-name="devicon:google">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 43">
        <g clipPath="url(#clip0_4009_464)" id="devicon:google">
          <path d={svgPaths.p212f0300} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pb45e900} fill="var(--fill-0, #E33629)" id="Vector_2" />
          <path d={svgPaths.pb0e3900} fill="var(--fill-0, #F8BD00)" id="Vector_3" />
          <path d={svgPaths.pfbab500} fill="var(--fill-0, #587DBD)" id="Vector_4" />
          <path d={svgPaths.pc501400} fill="var(--fill-0, #319F43)" id="Vector_5" />
        </g>
        <defs>
          <clipPath id="clip0_4009_464">
            <rect fill="white" height="43" width="43" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <DeviconGoogle />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex items-center left-[22px] top-[22px]">
      <Group2 />
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white relative rounded-[45px] shadow-[0px_4px_20.8px_0px_rgba(0,0,0,0.25)] shrink-0 size-[87px]" data-name="Input">
      <Frame8 />
      <div className="absolute flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] left-[142.5px] not-italic opacity-0 text-[#000e19] text-[16px] text-center top-[43.5px] translate-x-[-50%] translate-y-[-50%] w-[149px]">
        <p className="leading-[normal]">Continue with Microsoft</p>
      </div>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white relative rounded-[45px] shadow-[0px_4px_20.8px_0px_rgba(0,0,0,0.25)] shrink-0 size-[87px]" data-name="Input">
      <div className="absolute left-[22px] size-[43px] top-[22px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 43">
          <path d={svgPaths.p2a801c00} fill="var(--fill-0, #007DC1)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-[142.5px] not-italic opacity-0 text-[#000e19] text-[16px] text-center top-[43.5px] translate-x-[-50%] translate-y-[-50%] w-[149px]">
        <p className="leading-[normal]">Continue with Microsoft</p>
      </div>
    </div>
  );
}

function DribbbleLightPreview() {
  return (
    <div className="absolute contents inset-0" data-name="Dribbble-Light-Preview">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 43">
        <g id="icons">
          <path clipRule="evenodd" d={svgPaths.p385ceb80} fill="var(--fill-0, #000E19)" fillRule="evenodd" id="github-[#142]" />
        </g>
      </svg>
    </div>
  );
}

function Page() {
  return (
    <div className="absolute contents inset-0" data-name="Page-1">
      <DribbbleLightPreview />
    </div>
  );
}

function Github142SvgrepoCom() {
  return (
    <div className="absolute left-[22px] overflow-clip size-[43px] top-[22px]" data-name="github-142-svgrepo-com 1">
      <Page />
    </div>
  );
}

function Input5() {
  return (
    <div className="bg-white relative rounded-[45px] shadow-[0px_4px_20.8px_0px_rgba(0,0,0,0.25)] shrink-0 size-[87px]" data-name="Input">
      <Github142SvgrepoCom />
      <div className="absolute flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] left-[142.5px] not-italic opacity-0 text-[#000e19] text-[16px] text-center top-[43.5px] translate-x-[-50%] translate-y-[-50%] w-[149px]">
        <p className="leading-[normal]">Continue with Microsoft</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex gap-[23px] items-center justify-center left-[calc(50%-0.5px)] top-[43px] translate-x-[-50%] w-[541px]">
      <Input2 />
      <Input3 />
      <Input4 />
      <Input5 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute h-[152px] left-1/2 top-[414px] translate-x-[-50%] w-[500px]">
      <Frame6 />
      <Frame14 />
    </div>
  );
}

function FocusRipple() {
  return (
    <div className="absolute inset-0 rounded-[4px]" data-name="focusRipple">
      <div className="absolute bg-white bottom-[38.1%] left-[calc(50%-0.5px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-266px_-40px] mask-size-[540px_80px] opacity-0 rounded-[100px] top-1/2 translate-x-[-50%] w-[7px]" data-name="focusRipple" style={{ maskImage: `url('${imgFocusRipple}')` }} />
    </div>
  );
}

function Base() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Base">
      <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[30px] relative shrink-0 text-[24px] text-center text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sign In
      </p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#43abff] content-stretch flex flex-col h-[80px] items-center justify-center overflow-clip px-[40px] py-[10px] relative rounded-[60px] shadow-[0px_1px_18px_0px_rgba(0,0,0,0.12),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_3px_5px_-1px_rgba(0,0,0,0.2)] shrink-0 w-[540px]" data-name="Button 2">
      <FocusRipple />
      <Base />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col h-[90px] items-center justify-center relative shrink-0 w-full">
      <Button />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] items-end justify-center left-1/2 top-[269px] translate-x-[-50%] w-[540px]">
      <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1a3c8c] text-[20px] text-right w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[1.6]">Forgot password?</p>
      </div>
      <Frame11 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bottom-[0.86%] right-[33px] top-[13.54%] w-[722px]">
      <Frame3 />
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function BlackFullSvg() {
  return (
    <div className="absolute h-[205px] left-[7px] overflow-clip top-0 w-[234.477px]" data-name="BLACK FULL SVG 1">
      <div className="absolute inset-[28.24%_29.66%_43.79%_49.4%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(3, 105, 161, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 58">
            <path d={svgPaths.p3daf3900} fill="var(--fill-0, #0369A1)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[39.25%_50.8%_54.87%_30.34%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(3, 105, 161, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 13">
            <path d={svgPaths.p1e11b500} fill="var(--fill-0, #0369A1)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[50.31%_50.29%_43.84%_30.34%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(3, 105, 161, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 12">
            <path d={svgPaths.p3737cc00} fill="var(--fill-0, #0369A1)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[28.24%_50.8%_65.88%_39.77%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(3, 105, 161, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 13">
            <path d={svgPaths.p1c9c6900} fill="var(--fill-0, #0369A1)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.5%_86.18%_28.4%_6.54%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 17">
            <path d={svgPaths.p10fc4e00} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.5%_59.24%_28.4%_33.49%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 17">
            <path d={svgPaths.p28114f00} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.53%_67.47%_28.4%_24.47%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 17">
            <path d={svgPaths.p24e99e80} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.53%_76.34%_28.38%_15.01%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 17">
            <path d={svgPaths.p388cd100} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.56%_47.76%_28.43%_43.67%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 17">
            <path d={svgPaths.p22190200} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.56%_39.87%_28.43%_52.17%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 17">
            <path d={svgPaths.p3871e080} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.56%_24.86%_28.43%_67.2%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 17">
            <path d={svgPaths.p3df39400} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.56%_32.19%_28.43%_59.93%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 17">
            <path d={svgPaths.p27f05f00} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[23.5%_62.78%_68.8%_30.32%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 16">
            <path d={svgPaths.p31a25a00} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.08%_28%_30.9%_70.42%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 7">
            <path d={svgPaths.p28209700} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.23%_42.99%_30.75%_55.4%]" data-name="Vector">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 14, 25, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 7">
            <path d={svgPaths.p68450f0} fill="var(--fill-0, #000E19)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold inset-[59.31%_4.8%_25.08%_77.71%] leading-[normal] text-[23.448px] text-center text-nowrap text-sky-700 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        360
      </p>
    </div>
  );
}

function Desktop() {
  return (
    <div className="absolute bg-white inset-[17.87%_3.54%_17.87%_2.6%] rounded-[60px] shadow-[25px_20px_70px_-27px_rgba(0,0,0,0.27)]" data-name="Desktop - 3">
      <p className="absolute font-['PT_Sans:Bold',sans-serif] leading-[1.2] not-italic right-[616.5px] text-[#1a3c8c] text-[36px] text-center text-nowrap top-[calc(50%-306px)] translate-x-[50%] whitespace-pre">Sign in</p>
      <Frame7 />
      <BlackFullSvg />
    </div>
  );
}

function Frame22() {
  return <div className="absolute h-[716px] left-0 top-[-61px] w-[672px]" />;
}

function Frame21() {
  return (
    <div className="absolute h-[609px] left-[-1px] overflow-clip top-[-1px] w-[679px]">
      <Frame22 />
    </div>
  );
}

function Frame19() {
  return <div className="absolute h-[554px] left-[-2px] top-[-4px] w-[271px]" />;
}

function Frame18() {
  return <div className="absolute h-[278px] left-[27px] top-[330px] w-[548px]" />;
}

function Indicator() {
  return (
    <div className="absolute content-stretch flex gap-[8px] inset-[calc(92.35%-1px)_calc(3.98%-1px)_calc(4.93%-1px)_calc(81.32%-1px)] items-start" data-name="indicator">
      <div className="bg-white h-[16px] rounded-[16px] shrink-0 w-[48px]" />
      <div className="bg-[#e8f5ff] opacity-60 rounded-[16px] shrink-0 size-[16px]" />
      <div className="bg-[#e8f5ff] opacity-60 rounded-[16px] shrink-0 size-[16px]" />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute h-[492px] left-[-1px] top-[51px] w-[653.001px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 653 492">
        <g id="Frame 1000004612">
          <g id="1"></g>
        </g>
      </svg>
    </div>
  );
}

function Effects() {
  return (
    <div className="absolute contents left-[-2px] top-[50px]" data-name="Effects">
      <Frame17 />
    </div>
  );
}

function Frame20() {
  return <div className="absolute h-[604px] left-[-1px] top-[-6px] w-[476px]" />;
}

function Effects1() {
  return (
    <div className="absolute h-[613px] left-[-150px] top-0 w-[675.201px]" data-name="Effects">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 676 613">
        <g id="Effects">
          <g id="3">
            <mask fill="white" id="path-1-inside-1_4009_420">
              <path d={svgPaths.p77e2600} />
            </mask>
            <g filter="url(#filter0_i_4009_420)">
              <path d={svgPaths.p77e2600} fill="var(--fill-0, white)" fillOpacity="0.05" />
            </g>
            <path d={svgPaths.p237f6780} fill="var(--stroke-0, white)" fillOpacity="0.1" mask="url(#path-1-inside-1_4009_420)" />
          </g>
          <path d={svgPaths.pf52d780} fill="var(--fill-0, white)" fillOpacity="0.08" id="2" />
          <path d={svgPaths.p13991000} fill="var(--fill-0, white)" fillOpacity="0.08" id="1" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="633" id="filter0_i_4009_420" width="525.201" x="150" y="3.05176e-05">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="20" />
            <feGaussianBlur stdDeviation="29.8" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.19 0" />
            <feBlend in2="shape" mode="normal" result="effect1_innerShadow_4009_420" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute h-[588px] left-0 top-0 w-[653px]">
      <Effects1 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute h-[588px] left-[-1px] overflow-clip rounded-[60px] top-[-1px] w-[653px]">
      <Frame24 />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[588px] left-[calc(25%+198.5px)] rounded-[60px] top-[calc(50%+27px)] translate-x-[-50%] translate-y-[-50%] w-[653px]" data-name="Component 8">
      <Frame21 />
      <Frame19 />
      <Frame18 />
      <Indicator />
      <Effects />
      <Frame20 />
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] left-[calc(11.64%-1px)] right-[calc(11.79%-1px)] text-[#1a3c8c] text-[36px] top-[49px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Empower Your Data, Power Your Decisions
      </p>
      <Frame23 />
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] left-[calc(11.64%-1px)] right-[calc(11.79%-1px)] text-[32px] text-[rgba(0,34,112,0.65)] top-[199px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        EdgeData 360 is your complete solution for building, managing, and monitoring intelligent data pipelines. Connect, transform, and analyze your data in real time, all from a single, unified platform.
      </p>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_20px_59.6px_0px_inset_rgba(255,255,255,0.19)]" />
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] items-start leading-[normal] left-[352px] top-[138px] w-[653px]">
      <p className="font-['PT_Sans:Bold',sans-serif] min-w-full not-italic relative shrink-0 text-[#f2f2f2] text-[48px] w-[min-content]">Welcome back!</p>
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold relative shrink-0 text-[#dcebff] text-[32px] w-[601px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Access your pipelines and insights
      </p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[305px] top-1/2 translate-y-[-50%]">
      <div className="absolute bg-[#43abff] inset-[8.33%_868px_8.33%_305px] rounded-[60px] shadow-[21px_14px_29.1px_-7px_rgba(0,0,0,0.27)]" data-name="FRAME" />
      <Component />
      <Frame16 />
    </div>
  );
}

export default function FinalLoginPage() {
  return (
    <div className="bg-[#f2f2f2] relative size-full" data-name="Final Login Page">
      <Frame2 />
      <Desktop />
      <Group1 />
    </div>
  );
}