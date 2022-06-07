export default class GenericContainer {
  constructor({ itemKeyName }) {
    this.items = [];
    this.itemKeyName = itemKeyName;
  }

  addItem = (item) => this.items.push(item);
  removeItem = (item) => {
    const index = this.getIndexOfItem(item);
    if (index > -1) {
      let items = [...this.items];
      items.splice(index, 1);
      this.items = items;
    }
  };

  addArrayOfItems = (arr) => {
    for (const item of arr) this.addItem(item);
  };

  removeItemByKey = (key) => {
    const item = this.getItemByKey(key);
    this.removeItem(item);
  };

  getItemByKey = (key) => {
    for (const item of this.items) {
      if (item[this.itemKeyName] === key) return item;
    }
  };

  getListOfExistigItemsByKey = (KeyList) => {
    let out = [];
    for (const key of KeyList) {
      const item = this.getItemByKey(key);
      if (item) out.push(item);
    }
    return out;
  };
  getIndexOfItem = (item) => {
    return this.items.indexOf(item);
  };

  updteItem = (item) => {
    let items = [...this.items];
    const index = this.getIndexOfItem(item);
    items.splice(index, 1, item);
    this.items = items;
  };

  itemCount = () => this.items.length;

  doesItemExist = (key) => this.getItemByKey(key) != null;

  erase = () => (this.items = []);

  clone = () => {
    return { ...this };
  };

  getItemsAsArray = () => {
    return this.items;
  };
}
