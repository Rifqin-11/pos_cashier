import { useState } from "react";
import { ArrowRight, Flower, Info } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Notice } from "@/components/ui/primitives";
import { usePos } from "../pos-provider";

export function LoginPage() {
  const { service, commit, navigate, setToast } = usePos();
  const [name, setName] = useState("Alya Putri");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="grid h-dvh place-items-center overflow-auto bg-canvas p-6">
      <form
        className="w-full max-w-md space-y-5 rounded-2xl border border-line bg-surface p-8"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            commit((s) => service.login(s, name, pin));
            navigate("Shift kasir");
            setToast(`Selamat datang kembali, ${name}.`);
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "Tidak dapat masuk.",
            );
          }
        }}
      >
        <Flower size={44} weight="fill" className="text-brand-ink" />
        <span className="block text-2xl font-semibold tracking-tight text-brand-ink">
          mekar coffee
        </span>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight">
          Hari baru,
          <br />
          cerita baru.
        </h1>
        <p className="text-xs text-muted">
          Masuk untuk mulai menyajikan yang terbaik.
        </p>
        <Field label="Nama kasir">
          <Select value={name} onChange={(e) => setName(e.target.value)}>
            <option>Alya Putri</option>
            <option>Raka Pratama</option>
            <option>Nadia Sari</option>
          </Select>
        </Field>
        <Field label="PIN kasir">
          <Input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="4 digit PIN"
          />
        </Field>
        {error && <Notice error>{error}</Notice>}
        <Button type="submit" className="w-full">
          Masuk ke kasir
          <ArrowRight size={18} />
        </Button>
        <p className="flex items-center justify-center gap-2 text-[11px] text-muted">
          <Info size={16} />
          Akun demo · PIN: <strong>1234</strong>
        </p>
      </form>
    </main>
  );
}
