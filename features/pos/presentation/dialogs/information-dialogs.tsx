import {
  ArrowRight,
  Clock,
  Cookie,
  Info,
  SignOut,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";
import { dateLabel, initials, time } from "../lib/format";

export function HelpDialog() {
  const { setDialog } = usePos();
  const steps = [
    {
      title: "01 · Racik pesanan",
      text: "Pilih menu, atur suhu, ukuran, gula, dan catatan. Gunakan ⌘/Ctrl + K untuk mencari.",
    },
    {
      title: "02 · Selesaikan pembayaran",
      text: "Gunakan voucher MEKAR10 (min. Rp50.000) atau KOPIHEMAT (min. Rp75.000). Pilih Tunai, QRIS, atau debit.",
    },
    {
      title: "03 · Kelola operasional",
      text: "Tahan pesanan, cetak struk/tiket, refund, ekspor CSV, dan tutup shift dari navigasi.",
    },
    {
      title: "Akun demo",
      text: "Pilih nama kasir dan gunakan PIN 1234. Sesi demo awal memiliki shift aktif dengan kas Rp300.000.",
    },
  ];
  return (
    <Modal
      title="Kenalan dengan Mekar POS"
      subtitle="Mockup interaktif berdasarkan PRD Phase 1."
      onClose={() => setDialog(null)}
    >
      <div className="space-y-5">
        {steps.map((step) => (
          <p key={step.title} className="text-xs leading-relaxed text-muted">
            <strong className="mb-1 block text-sm font-medium text-ink">
              {step.title}
            </strong>
            {step.text}
          </p>
        ))}
        <Notice>
          Data lokal; belum terhubung ke backend, inventory, payment gateway,
          atau perangkat kasir fisik. Simulasi kegagalan tersedia di Pengaturan.
        </Notice>
      </div>
    </Modal>
  );
}
export function NotificationsDialog() {
  const { store, navigate, setDialog } = usePos();
  return (
    <Modal
      title="Kabar dari meja kasir"
      subtitle="Informasi operasional untuk shift hari ini."
      onClose={() => setDialog(null)}
    >
      <div className="space-y-5">
        <div className="flex gap-3">
          <Info size={24} className="text-brand-ink" />
          <div>
            <strong className="text-xs font-medium">
              Selamat datang di mockup Mekar
            </strong>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Semua data di aplikasi ini adalah data demo dan tersimpan di
              browser.
            </p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-line pt-5">
          <Cookie size={24} className="text-brand-ink" />
          <div>
            <strong className="text-xs font-medium">
              Cinnamon Roll sedang habis
            </strong>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Menu ditandai tidak tersedia pada katalog. Data produk merupakan
              simulasi dari sistem inventory.
            </p>
          </div>
        </div>
        {store.held.length > 0 && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setDialog(null);
              navigate("Pesanan ditahan");
            }}
          >
            Lihat {store.held.length} pesanan ditahan
            <ArrowRight size={17} />
          </Button>
        )}
      </div>
    </Modal>
  );
}
export function SessionDialog() {
  const { store, service, commit, run, navigate, setDialog } = usePos();
  return (
    <Modal
      title="Sesi kasir"
      subtitle={`Masuk sebagai ${store.session?.name}`}
      onClose={() => setDialog(null)}
    >
      <div className="my-7 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-surface-alt text-lg font-semibold text-ink">
          {initials(store.session?.name ?? "?")}
        </span>
        <h3 className="mb-2 mt-4 text-lg font-medium">{store.session?.name}</h3>
        <p className="text-xs text-muted">
          Masuk sejak{" "}
          {store.session
            ? `${dateLabel(store.session.loginAt)} · ${time(store.session.loginAt)}`
            : ""}
        </p>
      </div>
      {store.shift ? (
        <div className="space-y-4">
          <Notice>
            Tutup shift aktif terlebih dahulu sebelum keluar dari akun kasir.
          </Notice>
          <Button
            className="w-full"
            onClick={() => {
              setDialog(null);
              navigate("Shift kasir");
            }}
          >
            <Clock size={18} />
            Kelola shift
            <ArrowRight size={17} />
          </Button>
        </div>
      ) : (
        <Button
          variant="danger"
          className="w-full"
          onClick={() =>
            run(() => {
              commit((s) => service.logout(s));
              setDialog(null);
            })
          }
        >
          <SignOut size={18} />
          Keluar dari akun
        </Button>
      )}
    </Modal>
  );
}
