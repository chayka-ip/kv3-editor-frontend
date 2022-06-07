export default class ItemSelection {
  constructor() {
    this.selectedId = null;
  }

  setSelection = (_id) => (this.selectedId = _id);
  clearSelection = () => this.setSelection(null);
  getSelected = () => this.selectedId;
  clone = () => ({ ...this });
}
