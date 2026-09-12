import { usePos } from "../pos-provider";
import { ModifierDialog } from "./modifier-dialog";
import { PaymentDialog } from "./payment-dialog";
import { VoucherDialog } from "./voucher-dialog";
import { CancelOrderDialog, OrderNoteDialog } from "./order-dialogs";
import { ReceiptDialog } from "./receipt-dialog";
import { RefundDialog } from "./refund-dialog";
import {
  HelpDialog,
  NotificationsDialog,
  SessionDialog,
} from "./information-dialogs";

export function DialogHost() {
  const { editing, dialog } = usePos();
  if (editing)
    return (
      <ModifierDialog
        key={editing.item.id}
        initial={editing.item}
        existing={editing.existing}
      />
    );
  switch (dialog) {
    case "payment":
      return <PaymentDialog />;
    case "voucher":
      return <VoucherDialog />;
    case "cancel":
      return <CancelOrderDialog />;
    case "note":
      return <OrderNoteDialog />;
    case "receipt":
      return <ReceiptDialog />;
    case "refund":
      return <RefundDialog />;
    case "help":
      return <HelpDialog />;
    case "notifications":
      return <NotificationsDialog />;
    case "logout":
      return <SessionDialog />;
    default:
      return null;
  }
}
