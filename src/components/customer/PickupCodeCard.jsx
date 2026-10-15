import { getPickupCode } from "../../utils/formatters";

// The code customers show at the counter (or to the rider). Large and easy to read.
export function PickupCodeCard({ order, businessName, compact = false }) {
  if (!order) return null;
  const isPickup = order.fulfillment !== "delivery";
  const code = getPickupCode(order);
  return (
    <div className={`rounded-2xl bg-[#0f2815] text-white ${compact ? "p-3.5" : "p-5"}`}>
      <p className="text-[12px] font-bold text-[#b9d9bf]">{isPickup ? "Your pickup code" : "Your delivery code"}</p>
      <div className={`mt-2 flex gap-1.5 ${compact ? "" : "justify-center sm:justify-start"}`} aria-label={`Code ${code.split("").join(" ")}`}>
        {code.split("").map((d, i) => (
          <span
            key={i}
            className={`${compact ? "w-8 h-10 text-[18px]" : "w-10 h-12 sm:w-11 sm:h-13 text-[22px]"} grid place-items-center rounded-lg bg-white text-[#0f2815] font-extrabold`}
          >
            {d}
          </span>
        ))}
      </div>
      <p className="mt-2.5 text-[12px] text-[#d7ecd9]">
        {isPickup
          ? `Show this at ${businessName || "the counter"} when you collect your food.`
          : "Share this with your rider when your food arrives."}
      </p>
    </div>
  );
}
