import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  Notice,
  QuantityControl,
  SegmentedControl,
} from "@/components/ui/primitives";
import { unitPrice } from "../../domain/order";
import type { Item } from "../../domain/types";
import { ProductImage } from "../components/product-image";
import { money } from "../lib/format";
import { usePos } from "../pos-provider";

export function ModifierDialog({
  initial,
  existing,
}: {
  initial: Item;
  existing: boolean;
}) {
  const { service, commit, setEditing, setToast } = usePos();
  const [item, setItem] = useState(initial);
  const [error, setError] = useState("");
  const product = service.dependencies.products.find(
    (p) => p.id === item.productId,
  )!;
  const update = (patch: Partial<Item>) =>
    setItem((value) => ({ ...value, ...patch }));
  const save = () => {
    try {
      commit((s) => service.saveItem(s, item, existing));
      setEditing(null);
      setToast(
        existing
          ? "Menu berhasil diperbarui."
          : `${item.name} ditambahkan ke pesanan.`,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Item tidak dapat disimpan.",
      );
    }
  };
  return (
    <Modal
      title={existing ? "Sesuaikan pesanan" : "Seduh sesuai selera"}
      subtitle="Karena setiap orang punya favoritnya sendiri."
      onClose={() => setEditing(null)}
    >
      <div className="mb-5 flex items-center gap-4 border-b border-line pb-5">
        <ProductImage
          src={item.image}
          name={item.name}
          className="size-22 shrink-0 rounded-xl"
        />
        <div>
          <h3 className="text-base font-semibold">{item.name}</h3>
          <p className="my-2 text-[11px] leading-relaxed text-muted">
            {product.description}
          </p>
          <strong className="text-sm text-brand-ink">
            {money(item.price)}
          </strong>
        </div>
      </div>
      <div className="space-y-4">
        {product.category === "Pastry & Bites" ||
        product.category === "Ricebowl" ||
        product.category === "Noodle" ? (
          <FieldGroup label="Penyajian">
            <SegmentedControl
              value={item.temperature}
              options={["Hangat", "Tanpa dipanaskan"]}
              onChange={(temperature) => update({ temperature })}
            />
          </FieldGroup>
        ) : (
          <>
            <FieldGroup label="Suhu">
              <SegmentedControl
                value={item.temperature}
                options={["Iced", "Hot"]}
                onChange={(temperature) => update({ temperature })}
              />
            </FieldGroup>
            <FieldGroup label="Ukuran (Large +Rp5.000)">
              <SegmentedControl
                value={item.size}
                options={["Regular", "Large"]}
                onChange={(size) => update({ size })}
              />
            </FieldGroup>
            <FieldGroup label="Tingkat gula">
              <SegmentedControl
                value={item.sugar}
                options={["Normal", "Less sugar", "No sugar"]}
                onChange={(sugar) => update({ sugar })}
              />
            </FieldGroup>
            {product.category === "Coffee" && (
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={item.extra}
                  onChange={(e) => update({ extra: e.target.checked })}
                />
                <span className="flex-1">Extra espresso shot</span>
                <span>+Rp6.000</span>
              </label>
            )}
          </>
        )}
        <Field label="Catatan item (opsional)">
          <Textarea
            rows={2}
            maxLength={200}
            placeholder="Contoh: es sedikit, susu dipisah…"
            value={item.note}
            onChange={(e) => update({ note: e.target.value })}
          />
        </Field>
        {error && <Notice error>{error}</Notice>}
        <div className="flex items-center justify-between gap-3">
          <QuantityControl
            value={item.quantity}
            minimum={1}
            decrease={() => update({ quantity: item.quantity - 1 })}
            increase={() => update({ quantity: item.quantity + 1 })}
          />
          <Button onClick={save}>
            {existing ? "Simpan" : "Tambah"} ·{" "}
            {money(unitPrice(item) * item.quantity)}
            <Plus size={17} />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
