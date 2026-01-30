import svgPaths from "./svg-6hl4qbgsqf";

function Group() {
  return (
    <div className="absolute contents inset-[8.23%_9.45%_9.47%_2.48%]" data-name="Group">
      <div className="absolute inset-[8.23%_9.45%_9.47%_2.48%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.0808 24.3734">
          <path d={svgPaths.p334ae740} fill="var(--fill-0, #43ABFF)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function IconAi() {
  return (
    <div className="h-[29.614px] overflow-clip relative shrink-0 w-full" data-name="IconAi">
      <Group />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Container">
      <IconAi />
    </div>
  );
}