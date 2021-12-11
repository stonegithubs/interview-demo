class BalanceNotEnough extends Error {
  message: string;

  constructor({ msg }: { msg: string }) {
    super(msg);
    this.message = msg;
  }
}

export default BalanceNotEnough;
