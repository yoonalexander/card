type FlowerGraphicProps = {
  className?: string;
};

export default function FlowerGraphic({ className = "" }: FlowerGraphicProps) {
  return (
    <svg
      className={`flower-graphic${className ? ` ${className}` : ""}`}
      viewBox="-34 -38 68 100"
      aria-hidden="true"
    >
      <path className="secret-lily-stem" d="M0 17 C-3 31 2 46-2 61" />
      <path className="secret-lily-leaf" d="M-1 43 C-20 30-25 48-3 52Z" />
      <g className="secret-lily-head">
        {Array.from({ length: 6 }, (_, index) => (
          <ellipse
            key={index}
            cx="0"
            cy="-11"
            rx="7"
            ry="16"
            transform={`rotate(${index * 60})`}
          />
        ))}
        <circle className="secret-lily-center" cx="0" cy="0" r="6.5" />
      </g>
    </svg>
  );
}
