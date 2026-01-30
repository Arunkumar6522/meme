import imgUntitled1 from "figma:asset/ae2c6ae10a58894dc277772c61af473635d893fb.png";
import imgLogo from "figma:asset/1856cf340a7c392cdf18bf57ac0d4dc1c0a20fb2.png";
import imgWhatsAppImage20240803At83137Pm from "figma:asset/2fce9173f6b867e8b782eb45139cbfd9dcde182c.png";
import imgUnnamed from "figma:asset/f176e29ca4eb5f4dc0b1a9429fa0798e5b29027e.png";
import imgLogo1 from "figma:asset/72b9440800b937c8fc7e616bb92f99c0cb068f2a.png";

function Heading() {
  return (
    <div className="h-[84px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Black',sans-serif] leading-[84px] left-[792.29px] not-italic text-[#1a3c8c] text-[56px] text-center text-nowrap top-[2.44px] tracking-[-1.12px] translate-x-[-50%] whitespace-pre">Trusted by Innovators</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[34px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[34px] left-[791.99px] not-italic text-[#4a5565] text-[20px] text-center text-nowrap top-[-2.44px] translate-x-[-50%] whitespace-pre">Powering the next generation of connected manufacturing leaders.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Paragraph />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Heading />
      <Frame />
    </div>
  );
}

function CompaniesSlide() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[45.283px] h-[83.321px] items-center justify-center ml-0 mt-0 overflow-x-auto overflow-y-clip relative w-[1435.47px]" data-name="companies slide">
      <div className="h-[71.334px] relative shrink-0 w-[229.132px]" data-name="Untitled-1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[123.52%] left-0 max-w-none top-[-23.5%] w-full" src={imgUntitled1} />
        </div>
      </div>
      <div className="h-[68.555px] relative shrink-0 w-[231.849px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
      <div className="h-[82.146px] relative shrink-0 w-[194.717px]" data-name="WhatsApp Image 2024-08-03 at 8.31.37 PM">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgWhatsAppImage20240803At83137Pm} />
      </div>
      <div className="h-[72.453px] relative shrink-0 w-[144.906px]" data-name="unnamed">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUnnamed} />
      </div>
      <div className="h-[72.391px] relative shrink-0 w-[236.377px]" data-name="logo (1)">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo1} />
      </div>
      <div className="h-[71.334px] relative shrink-0 w-[229.132px]" data-name="Untitled-1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[123.52%] left-0 max-w-none top-[-23.5%] w-full" src={imgUntitled1} />
        </div>
      </div>
      <div className="h-[68.555px] relative shrink-0 w-[231.849px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
      <div className="h-[82.146px] relative shrink-0 w-[194.717px]" data-name="WhatsApp Image 2024-08-03 at 8.31.37 PM">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgWhatsAppImage20240803At83137Pm} />
      </div>
      <div className="h-[72.453px] relative shrink-0 w-[144.906px]" data-name="unnamed">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUnnamed} />
      </div>
      <div className="h-[72.391px] relative shrink-0 w-[236.377px]" data-name="logo (1)">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo1} />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[calc(50%-717.74px)] mt-0 place-items-start relative" data-name="Logo">
      <CompaniesSlide />
    </div>
  );
}

function LogoPartners() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Logo Partners">
      <Logo />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[30px] items-start relative size-full">
      <Frame2 />
      <LogoPartners />
    </div>
  );
}