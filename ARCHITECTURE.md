# Mekar POS architecture

## Layers

```text
app/page.tsx                         Next.js route
components/ui/                       Shared Tailwind UI primitives
features/pos/
  composition.ts                     Dependency wiring
  domain/                            Entities and pure business rules
  application/
    ports.ts                         Interfaces for external dependencies
    pos-service.ts                   Order, payment, refund, shift, session use cases
  infrastructure/                    Browser adapters and demo fixtures
  presentation/
    pos-app.tsx                      Client composition entry
    pos-provider.tsx                 React state and persistence coordination
    pos-shell.tsx                    Full-viewport layout and navigation
    catalog/, cart/, pages/          Feature views
    dialogs/, receipt/               Forms and receipt rendering
    components/, lib/                POS-specific UI and formatters
```

Domain code imports only domain types. Application code depends on domain rules
and interfaces declared in `ports.ts`, not React or browser APIs. Infrastructure
implements those interfaces. `composition.ts` injects the browser implementations
into `PosService`; `pos-app.tsx` creates one service instance for the mounted app.

## State and persistence

`PosProvider` owns the shared snapshot, navigation, and active dialog. Individual
forms own their input and validation-feedback state. Business mutations go through
`PosService`, then `commit` persists the resulting snapshot before publishing it
to React. Checkout persists before reporting success and uses an in-flight guard
to prevent concurrent duplicate submissions.

The storage key remains `mekar-pos-demo-v1`, retaining compatibility with previous
mockup data. Browser storage, preferences, printing, payment simulation, and CSV
downloads are isolated in `infrastructure/browser-adapters.ts`.

For API integration, implement `StoreRepository`, `PaymentProcessor`, and the
other ports and wire them at the composition root. If persistence becomes async,
make the repository and commit contracts async as part of that integration.

## Styling and reusable UI

Components use Tailwind v4 utility classes and semantic tokens (`bg-surface`,
`text-ink`, `border-line`, etc.). `app/globals.css` contains only theme tokens,
base accessibility styles, reduced-motion rules, and document-wide print styles.
Dark mode is scoped by `data-theme`.

Reusable primitives include Button, IconButton, Field, FieldGroup, Input, Select,
Textarea, Modal, Panel, Badge, Notice, DetailRow, QuantityControl, Toggle, and
SegmentedControl. Use Field for a single input and FieldGroup for grouped controls.

The outer layout is viewport-sized and does not scroll. The main content region
and cart item list have independent scrolling; cart totals and payment actions
stay visible.

## Verification

```sh
npm run lint
npm run build
```

Browser regression checks during this refactor covered modifiers, vouchers,
hold/resume, cash/QRIS/debit, failed-payment retry, duplicate prevention, refund,
CSV export, printer errors, logout/login, shifts, desktop/mobile layout, and
light/dark accessibility. These checks were run through a temporary Playwright
script; they are not currently installed as a repository test suite.

## Demo scope

PIN: `1234`. The initial session has an active shift with Rp300.000 opening cash.
All payments, devices, authentication, and product availability are mock behavior.
No production authentication or remote transaction processing is implemented.
