class HttpException extends Error {
  status: number;
  message: string;
  code: number | string;

  constructor({ status = 400, msg, code }: { status?: number, msg: string, code: number | string }) {
    super(msg);
    this.status = status;
    this.message = msg;
    this.code = code;
  }
}

export default HttpException;
