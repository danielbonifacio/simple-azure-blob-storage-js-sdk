export interface File {
  uri: String;
  type: String;
  length: Number;
}

export interface BlobStorageConnectionOptions {
  account: String;
  container: String;
  sas: String;
}

class AzureBlobStorage {
  private account: String;
  private container: String;
  private sas: String;

  constructor(props: BlobStorageConnectionOptions) {
    this.account = props.account;
    this.container = props.container;
    this.sas = props.sas;
  }

  public getSAS() {
    return this.sas;
  }

  public getAccount() {
    return this.account;
  }

  public getContainer() {
    return this.container;
  }

  /**
   * Return Blob URL formatted
   */
  private getBlockBlobUrl(
    account: String,
    container: String,
    blob: String,
    sas: String
  ) {
    return `https://${account}.blob.core.windows.net/${container}/${blob}${sas}`;
  }

  /**
   * Create (or update) a blob on container
   *
   * API reference:
   * https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
   */
  public async createBlockBlob(file: any, fileName: String) {
    const sas = this.getSAS();
    const account = this.getAccount();
    const container = this.getContainer();

    const url = this.getBlockBlobUrl(account, container, fileName, sas);
    const method = "PUT";

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", file.type);
    requestHeaders.set("Content-Length", file.length);
    requestHeaders.set("x-ms-blob-type", "BlockBlob");

    const res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: file
    });

    // the expected status is 201
    if (res.status === 201) {
      return fileName;
    } else {
      throw {
        message: `The response status wasn\'t the expected.\nExpected: 201\nReceived: ${res.status}`,
        response: res
      };
    }
  }
}

export default AzureBlobStorage;
