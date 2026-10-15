import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { IconArrowRight } from "./Icons";

// Real text (not baked into an image) so it scales, translates and is read by screen readers.
const SLIDES = [
  {
    bg: "bg-[#025624]",
    title: (
      <>
        Enjoy good food
        <br />
        at a <span className="text-[#ffde59]">better</span> price
      </>
    ),
    sub: "Discover quality surplus food from businesses near you today.",
    titleColor: "text-white",
    subColor: "text-[#d7ecd9]",
    image: "/food/hero-jollof.jpg",
    imageClass: "object-cover object-left",
    fade: "from-[#025624]",
    dark: true,
  },
  {
    bg: "bg-[#e3f5ea]",
    title: (
      <>
        Eat well,
        <br />
        spend less
      </>
    ),
    sub: "Rescue tonight's surplus meals at up to half price.",
    titleColor: "text-[#0f5c2e]",
    subColor: "text-[#3a4a3a]",
    image: "/food/afang-soup-garri.jpg",
    imageClass: "object-cover",
    fade: "from-[#e3f5ea]",
    dark: false,
  },
];

export function HeroBanner() {
  const { navigate } = useApp();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="ReFood highlights"
      className="relative overflow-hidden rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
    >
      <div className="grid">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            aria-hidden={i !== idx}
            className={`col-start-1 row-start-1 relative flex min-h-[168px] sm:min-h-[220px] lg:min-h-[276px] ${s.bg} transition-opacity duration-700 ${
              i === idx ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Food photo on the right */}
            <div className="absolute inset-y-0 right-0 w-[42%] sm:w-[45%]">
              <img src={s.image} alt="" className={`w-full h-full ${s.imageClass}`} loading={i === 0 ? "eager" : "lazy"} />
              <div className={`absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r ${s.fade} to-transparent`} />
            </div>

            {/* Text on the left */}
            <div className="relative z-10 w-[62%] sm:w-[58%] flex flex-col justify-center p-4 sm:p-7 lg:p-10">
              <h2
                className={`${s.titleColor} font-extrabold tracking-[-0.03em] leading-[1.02] text-[24px] sm:text-[36px] lg:text-[52px]`}
              >
                {s.title}
              </h2>
              <p className={`${s.subColor} mt-2 sm:mt-3 text-[12px] sm:text-[15px] leading-snug max-w-[34ch]`}>{s.sub}</p>
              <button
                onClick={() => navigate("browse")}
                tabIndex={i === idx ? 0 : -1}
                className="mt-3 sm:mt-5 self-start inline-flex items-center gap-1.5 bg-[#ffde59] hover:bg-[#ffd633] text-[#0f2815] font-bold text-[12px] sm:text-[14px] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition active:scale-[0.98] cursor-pointer"
              >
                Browse surplus <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === idx}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              SLIDES[idx].dark
                ? i === idx ? "w-6 bg-white shadow" : "w-2 bg-white/60 hover:bg-white/90"
                : i === idx ? "w-6 bg-[#0f5c2e]" : "w-2 bg-[#0f5c2e]/30 hover:bg-[#0f5c2e]/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
