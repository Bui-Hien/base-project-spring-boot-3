import { PostStatus } from "../../LocalConstants";
import AuditableDto from "./AuditableDto";

export default class PostDto extends AuditableDto {
  constructor () {
    super ();
    this.title = null;
    this.content = null;
    this.status = PostStatus.DRAFT.value;
    this.author = null;
  }
}