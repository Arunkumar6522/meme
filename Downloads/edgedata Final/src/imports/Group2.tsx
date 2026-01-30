import svgPaths from "./svg-lhcvns2c3d";

function Group() {
  return (
    <div className="absolute bottom-[0.3%] left-0 right-0 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 82 73">
        <g id="Group">
          <path d={svgPaths.p37d575c0} fill="var(--fill-0, #0083CA)" id="Vector" />
          <path d={svgPaths.p127f77e0} fill="var(--fill-0, #0083CA)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[73px] overflow-clip relative shrink-0 w-[82px]" data-name="Icon">
      <Group />
    </div>
  );
}

export default function Group1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative size-full" data-name="Group2">
      <Icon />
    </div>
  );
}