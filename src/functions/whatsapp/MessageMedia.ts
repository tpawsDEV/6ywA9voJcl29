/**
 * Media attached to a message
 * @param {string} mimetype MIME type of the attachment
 * @param {string} data Base64-encoded data of the file
 */
class MessageMedia {
  mimetype: string;
  data: string;
  name: string;
  
  constructor(mimetype: string, data: string, name: string) {
    /**
     * MIME type of the attachment
     * @type {string}
     */
    this.mimetype = mimetype;

    /**
     * Base64 encoded data that represents the file
     * @type {string}
     */
    this.data = data;


    this.name = name;
  }
}

export default MessageMedia;
