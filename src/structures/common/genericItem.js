import { nanoid } from "nanoid";

export default class GenericItem {
  constructor() {
    this._id = nanoid();
  }

  setId = (id) => this._id = id
}
