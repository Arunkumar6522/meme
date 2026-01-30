import svgPaths from "./svg-p66a0eu2sh";
import { imgGroup } from "./svg-rtd88";

function Group() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[142px_48px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 142 48">
        <g id="Group">
          <path d={svgPaths.p1def7400} fill="#1a3c8c" id="Vector" />
          <path d={svgPaths.p3c36fe00} fill="#1a3c8c" id="Vector_2" />
          <path d={svgPaths.p1bc8c000} fill="#1a3c8c" id="Vector_3" />
          <path d={svgPaths.p551700} fill="#1a3c8c" id="Vector_4" />
          <path d={svgPaths.p3c46a900} fill="#1a3c8c" id="Vector_5" />
          <path d={svgPaths.p2af90000} fill="#1a3c8c" id="Vector_6" />
          <path d={svgPaths.p482c280} fill="#1a3c8c" id="Vector_7" />
          <path d={svgPaths.p2da1b540} fill="#1a3c8c" id="Vector_8" />
          <path d={svgPaths.p3cdf4f00} fill="#1a3c8c" id="Vector_9" />
          <path d={svgPaths.p2b7247f0} fill="#1a3c8c" id="Vector_10" />
          <path d={svgPaths.p137f3800} fill="#1a3c8c" id="Vector_11" />
          <path d={svgPaths.p26d48f00} fill="#1a3c8c" id="Vector_12" />
          <path d={svgPaths.p1f0e28c0} fill="#1a3c8c" id="Vector_13" />
          <path d={svgPaths.p3ffcc3f1} fill="#1a3c8c" id="Vector_14" />
          <path d={svgPaths.p687af00} fill="#1a3c8c" id="Vector_15" />
          <path d={svgPaths.p20a94600} fill="#1a3c8c" id="Vector_16" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Pm() {
  return (
    <div className="absolute h-[48px] left-[9px] overflow-clip top-0 w-[142px]" data-name="pm 1">
      <ClipPathGroup />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <Pm />
    </div>
  );
}