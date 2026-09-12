import { NotePencil, X } from "@phosphor-icons/react";
import { IconButton } from "@/components/ui/button";
import { QuantityControl } from "@/components/ui/primitives";
import { unitPrice } from "../../domain/order";
import type { Item } from "../../domain/types";
import { ProductImage } from "../components/product-image";
import { money } from "../lib/format";

export function CartItem({
  item,
  onEdit,
  onRemove,
  onQuantity,
}: {
  item: Item;
  onEdit(): void;
  onRemove(): void;
  onQuantity(amount: number): void;
}) {
  return (
    <article className="flex gap-2.5 border-b border-dashed border-line py-4">
      <ProductImage
        src={item.image}
        name={item.name}
        className="h-14 w-13 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-semibold">{item.name}</h4>
          <IconButton
            aria-label={`Hapus ${item.name}`}
            onClick={onRemove}
            className="size-6 min-h-6"
          >
            <X size={14} />
          </IconButton>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 py-1 text-[10px] text-muted hover:underline"
        >
          {item.temperature} · {item.size}
          {item.extra ? " · Extra shot" : ""}
          <NotePencil size={12} />
        </button>
        {item.note && (
          <p className="my-1 text-[10px] break-words text-muted">{item.note}</p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <strong className="text-xs font-medium">
            {money(unitPrice(item) * item.quantity)}
          </strong>
          <QuantityControl
            name={item.name}
            value={item.quantity}
            decrease={() => onQuantity(-1)}
            increase={() => onQuantity(1)}
          />
        </div>
      </div>
    </article>
  );
}
