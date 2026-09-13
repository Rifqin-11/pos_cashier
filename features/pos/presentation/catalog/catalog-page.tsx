import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BowlFood,
  Coffee,
  Cookie,
  ForkKnife,
  GridFour,
  MagnifyingGlass,
  SlidersHorizontal,
  TeaBag,
  X,
} from "@phosphor-icons/react";
import { Button, IconButton } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/primitives";
import type { Category, Product } from "../../domain/types";
import { usePos } from "../pos-provider";
import { ProductCard } from "./product-card";

const categories = [
  {
    name: "Coffee",
    description: "Espresso dan kopi susu.",
    icon: Coffee,
  },
  {
    name: "Tea",
    description: "Seduhan yang menenangkan.",
    icon: TeaBag,
  },
  {
    name: "Pastry & Bites",
    description: "Teman untuk setiap cangkir.",
    icon: Cookie,
  },
  {
    name: "Ricebowl",
    description: "Mangkuk hangat dan mengenyangkan.",
    icon: BowlFood,
  },
  {
    name: "Noodle",
    description: "Mie hangat, bumbu berani.",
    icon: ForkKnife,
  },
] as const;
export function CatalogPage() {
  const { store, service, setEditing, run, navigate } = usePos();
  const [category, setCategory] = useState<Category>("Semua menu");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onFocus = () => search.current?.focus();
    window.addEventListener("pos:search", onFocus);
    return () => window.removeEventListener("pos:search", onFocus);
  }, []);
  const { products } = service.dependencies;
  const filtered = products
    .filter(
      (p) =>
        (category === "Semua menu" || p.category === category) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : Number(!!b.popular) - Number(!!a.popular),
    );
  function onSelect(product: Product) {
    if (!store.shift) {
      navigate("Shift kasir");
      return;
    }
    run(() =>
      setEditing({ item: service.newItem(store, product), existing: false }),
    );
  }
  const clear = () => {
    setCategory("Semua menu");
    setQuery("");
  };
  return (
    <>
      <h1 className="sr-only">Kasir</h1>
      <div className="mb-5 flex gap-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-control-line bg-surface px-3 focus-within:outline-2 focus-within:outline-brand">
          <MagnifyingGlass size={19} className="text-muted" />
          <input
            ref={search}
            aria-label="Cari menu"
            placeholder="Cari kopi, minuman, atau makanan…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-[11px] outline-none placeholder:text-muted"
          />
          {query ? (
            <IconButton
              aria-label="Hapus pencarian"
              onClick={() => setQuery("")}
            >
              <X size={14} />
            </IconButton>
          ) : (
            <kbd className="hidden rounded bg-surface-alt px-1.5 text-[10px] text-muted lg:block">
              ⌘ K
            </kbd>
          )}
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3">
          <SlidersHorizontal size={18} />
          <Select
            aria-label="Urutkan menu"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="max-w-28 border-0 px-0 text-[10px]"
          >
            <option value="recommended">Rekomendasi</option>
            <option value="price-low">Harga terendah</option>
            <option value="price-high">Harga tertinggi</option>
          </Select>
        </label>
      </div>
      <div
        data-testid="category-rail"
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:-mx-7 md:px-7"
      >
        {categories.map(({ name, description, icon: Icon }) => {
          const active = category === name;
          return (
            <button
              key={name}
              aria-pressed={category === name}
              onClick={() =>
                setCategory(category === name ? "Semua menu" : name)
              }
              className={`relative flex min-h-30 w-[178px] shrink-0 snap-start flex-col items-start overflow-hidden rounded-xl border border-transparent p-3 text-left transition-colors duration-200 md:min-h-33 md:w-[210px] md:p-4 ${active ? "bg-category-active text-white" : "bg-surface text-ink hover:bg-category-hover"}`}
            >
              <span className="relative z-1 flex items-center gap-1 rounded-full border border-current/30 px-2 py-0.5 text-[8px]">
                {products.filter((p) => p.category === name).length} menu
                <ArrowUpRight size={11} />
              </span>
              <Icon
                size={84}
                weight="duotone"
                className="absolute -right-1 top-8 -rotate-12 opacity-25"
              />
              <strong className="relative mt-6 text-sm font-semibold tracking-tight lg:text-xl">
                {name}
              </strong>
              <small className="relative mt-1 hidden text-[9px] lg:block">
                {description}
              </small>
            </button>
          );
        })}
      </div>
      <div className="mb-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">{category}</h2>
          <span className="border-l border-line pl-3 text-[10px] text-muted">
            {filtered.length} menu tersedia
          </span>
        </div>
        <button
          onClick={clear}
          className="flex items-center gap-1.5 rounded-md bg-brand-soft px-2 py-1.5 text-[10px] text-brand-ink"
        >
          <GridFour size={14} />
          Semua menu
        </button>
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-2 gap-3 min-[1024px]:grid-cols-3 min-[1200px]:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<MagnifyingGlass size={32} />}
          title="Menu tidak ditemukan"
          description="Coba kata kunci lain atau lihat semua menu."
        >
          <Button variant="secondary" onClick={clear}>
            Tampilkan semua
          </Button>
        </EmptyState>
      )}
      <footer className="flex items-center justify-between gap-3 py-6 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <Coffee size={14} />
          Diracik dengan hati, disajikan dengan hangat.
        </span>
        <span className="hidden xl:block">
          {products.length} menu · Data demo
        </span>
      </footer>
    </>
  );
}
