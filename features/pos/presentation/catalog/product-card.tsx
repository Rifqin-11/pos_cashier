import { Plus } from "@phosphor-icons/react";
import type { Product } from "../../domain/types";
import { ProductImage } from "../components/product-image";
import { money } from "../lib/format";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect(product: Product): void;
}) {
  return (
    <button
      aria-label={`Tambah ${product.name}`}
      disabled={!product.available}
      onClick={() => onSelect(product)}
      className="group overflow-hidden rounded-xl border border-line bg-surface p-2 text-left transition-colors hover:border-brand disabled:opacity-60"
    >
      <div className="relative aspect-[1.35] overflow-hidden rounded-lg bg-surface-alt">
        <ProductImage
          src={product.image}
          name={product.name}
          className={`size-full transition-transform motion-safe:group-hover:scale-105 ${!product.available ? "grayscale" : ""}`}
        />
        {product.popular && (
          <span className="absolute left-2 top-2 rounded bg-surface px-1.5 py-1 text-[8px] text-ink">
            Favorit
          </span>
        )}
        {!product.available && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-surface px-3 py-1.5 text-[10px]">
            Habis hari ini
          </span>
        )}
      </div>
      <div className="px-1 pb-1 pt-3">
        <small className="text-[8px] tracking-wider text-muted">
          {product.category === "Coffee"
            ? "ESPRESSO BASED"
            : product.category.toUpperCase()}
        </small>
        <h3 className="mt-1 text-xs font-semibold">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <strong className="text-xs font-medium">
            {money(product.price)}
          </strong>
          <span className="grid size-8 place-items-center rounded-full border border-brand/40 text-brand-ink group-hover:bg-brand group-hover:text-white">
            <Plus size={18} />
          </span>
        </div>
      </div>
    </button>
  );
}
