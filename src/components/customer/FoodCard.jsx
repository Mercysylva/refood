import { useApp } from "../../context/AppContext";
import { formatNaira, getListingPrice, getListingOriginalPrice } from "../../utils/formatters";
import { IconHeart, IconMapPin, IconTrash2, IconPlus, IconMinus, IconClock } from "../common/Icons";

// "Today, 5:00 PM to 7:00 PM" becomes "Today, 5 to 7 PM" so it fits on a small card.
function shortPickup(w = "") {
  const t = w.replace(/:00/g, "");
  const m = t.match(/^(.*?)(\d[\d:]*) ?(AM|PM) to (\d[\d:]*) ?(AM|PM)$/i);
  if (m && m[3].toUpperCase() === m[5].toUpperCase()) return `${m[1]}${m[2]} to ${m[4]} ${m[5]}`;
  return t;
}

export function FoodCard({ listing }) {
  const { toggleFavorite, favorites, navigate, addToCart, updateCartQty, cart } = useApp();
  const salePrice = getListingPrice(listing);
  const wasPrice = getListingOriginalPrice(listing);
  const discount = wasPrice > 0 ? Math.round((1 - salePrice / wasPrice) * 100) : 0;
  const fav = favorites.includes(listing.id);
  const cartItem = cart.find(c => c.listingId === listing.id);
  const cartQty = cartItem ? cartItem.qty : 0;
  const atMax = cartQty >= listing.quantity;
  const soldOut = listing.status === "sold_out" || listing.quantity <= 0;

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-[#eef3ec] shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition flex flex-col p-2">
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f7f8f6]">
        <img
          src={listing.image}
          alt={listing.name}
          className="w-full h-full object-cover cursor-pointer hover:scale-102 transition duration-300"
          onClick={() => navigate("foodDetail", { id: listing.id })}
        />
        {discount >= 10 && (
          <span className="absolute top-2 left-2 bg-[#0f7a3b] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow">
            {discount}% off
          </span>
        )}
        {!soldOut && listing.quantity > 0 && listing.quantity <= 3 && (
          <span className="absolute top-2 right-2 bg-[#ffde59] text-[#0f2815] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow">
            Only {listing.quantity} left
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] grid place-items-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md">Sold out</span>
          </div>
        )}
      </div>
      <div className="px-1.5 pt-1.5 pb-1 flex flex-col flex-1">
        <p className="text-[10px] font-medium text-[#5a6b5a] truncate flex items-center gap-1">
          <IconMapPin size={12} className="shrink-0" />{listing.location}
        </p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <p className="font-extrabold text-[16px] text-[#0f2815] whitespace-nowrap">{formatNaira(salePrice)}</p>
          <p className="text-[11px] line-through text-[#6b7d6b]">{formatNaira(wasPrice)}</p>
        </div>
        <p
          className="mt-0.5 font-semibold sm:font-bold text-[12.5px] leading-snug text-[#0f2815] line-clamp-2 cursor-pointer hover:text-[#0f7a3b] transition"
          onClick={() => navigate("foodDetail", { id: listing.id })}
        >
          {listing.name}
        </p>
        {listing.pickupWindow && (
          <p className="mt-1 text-[10.5px] font-semibold text-[#0f7a3b] truncate flex items-center gap-1">
            <IconClock size={12} className="shrink-0" />Pickup {shortPickup(listing.pickupWindow).replace(/^Today,/, "today,")}
          </p>
        )}
        <div className="mt-auto pt-2.5 flex gap-1.5 sm:gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); }}
            title={fav ? "Remove from favourites" : "Save to favourites"}
            aria-label={fav ? "Remove from favourites" : "Save to favourites"}
            className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full grid place-items-center transition active:scale-90 cursor-pointer border ${fav ? "bg-red-500 border-red-500 text-white" : "bg-white border-[#d6e2d6] text-[#0f2815] hover:border-red-300 hover:text-red-500"}`}
          >
            <IconHeart filled={fav} size={18} />
          </button>
          {!soldOut ? (
            cartQty > 0 ? (
              <div
                className="flex-1 min-w-0 h-10 sm:h-11 rounded-full bg-[#eef6ec] border border-[#c8e0c8] flex items-center justify-between px-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => updateCartQty(listing.id, cartQty - 1)}
                  aria-label={cartQty === 1 ? "Remove from cart" : "Remove one"}
                  title={cartQty === 1 ? "Remove from cart" : "Remove one"}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white text-[#0f7a3b] grid place-items-center shadow-sm active:scale-90 transition cursor-pointer"
                >
                  {cartQty === 1 ? <IconTrash2 size={15} /> : <IconMinus size={15} />}
                </button>
                <span className="text-[11px] sm:text-[12.5px] font-extrabold text-[#0f7a3b] whitespace-nowrap" aria-live="polite">
                  {cartQty}<span className="sr-only sm:not-sr-only"> in cart</span>
                </span>
                <button
                  onClick={() => addToCart(listing.id, 1)}
                  disabled={atMax}
                  aria-label="Add one more"
                  title={atMax ? "No more available" : "Add one more"}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0f7a3b] text-white grid place-items-center active:scale-90 transition cursor-pointer disabled:bg-[#c8e0c8] disabled:cursor-not-allowed"
                >
                  <IconPlus size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(listing.id, 1); }}
                title="Add to cart"
                className="flex-1 min-w-0 h-10 sm:h-11 px-2 rounded-full text-[12px] sm:text-[13px] font-bold truncate transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 bg-[#0f2815] hover:bg-black text-white"
              >
                Add to cart
              </button>
            )
          ) : (
            <div className="flex-1 min-w-0 h-10 sm:h-11 px-2 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#f7f8f6] text-[#5a6b5a] grid place-items-center truncate">
              Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
