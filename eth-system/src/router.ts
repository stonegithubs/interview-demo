import Route from './route/routes';
import TradeRoute from './route/trade.route';
import UserRoute from './route/user.route';
import WalletRoute from './route/wallet.route';
import MerchantRoute from './route/merchant.route';
import ViewRoute from './route/view.route';
import WebhookRoute from './route/webhook.route';
import ToolRoute from './route/tool.route';
import EntryRoute from './route/entry.route';
import WithdrawEntryRoute from './route/withdraw.entry.route';
import ContractCurrencyRoute from './route/contract.currency.route';
import OwnerWithdrawEntryRoute from './route/owner.withdraw.entry.route';
import OwnerWithdrawConfigRoute from './route/owner.withdraw.config.route';

export const router: Route[] = [
  new TradeRoute(),
  new UserRoute(),
  new WalletRoute(),
  new MerchantRoute(),
  new ViewRoute(),
  new WebhookRoute(),
  new ToolRoute(),
  new EntryRoute(),
  new WithdrawEntryRoute(),
  new ContractCurrencyRoute(),
  new OwnerWithdrawEntryRoute(),
  new OwnerWithdrawConfigRoute(),
];
