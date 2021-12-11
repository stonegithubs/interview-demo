class Web3Exception extends Error {
  message: string;
  code: number | string;

  constructor({ msg, code }: { msg: string, code: number | string }) {
    super(msg);
    this.message = msg;
    this.code = code;
  }
}

export default Web3Exception;
