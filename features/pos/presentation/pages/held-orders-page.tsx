import { ArrowRight, Pause, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Badge,
  EmptyState,
  Panel,
  SectionHeading,
} from "@/components/ui/primitives";
import { usePos } from "../pos-provider";
import { money, orderCode } from "../lib/format";

export function HeldOrdersPage() {
  const { store, service, run, commit, navigate } = usePos();
  return (
    <>
      <SectionHeading
        title="Pesanan ditahan"
        description="Jeda sebentar. Lanjutkan saat pelanggan siap."
      >
        <Badge>{store.held.length} pesanan</Badge>
      </SectionHeading>
      {store.held.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {store.held.map((order) => (
            <Panel key={order.id}>
              <div className="flex items-center justify-between">
                <Badge>
                  <Pause size={12} />
                  Ditahan
                </Badge>
                <strong className="text-xs">{orderCode(order.id)}</strong>
              </div>
              <h2 className="mt-5 text-xl font-semibold">
                {order.customer || "Pelanggan"}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {order.type}
                {order.table ? ` · Meja ${order.table}` : ""}
              </p>
              <div className="my-4 space-y-2 border-b border-dashed border-line pb-4 text-xs">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.quantity}× {item.name}
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <strong>{money(service.totals(store, order).total)}</strong>
                <Button
                  onClick={() =>
                    run(() => {
                      commit((s) => service.resume(s, order.id));
                      navigate("Kasir");
                    }, "Pesanan dilanjutkan.")
                  }
                >
                  Lanjutkan
                  <ArrowRight size={16} />
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Pause size={32} />}
          title="Semua pesanan sedang berjalan"
          description="Pesanan yang ditahan akan muncul di sini. Gunakan tombol Tahan di keranjang."
        >
          <Button onClick={() => navigate("Kasir")}>
            Buat pesanan
            <Plus size={16} />
          </Button>
        </EmptyState>
      )}
    </>
  );
}
