import { arrayContains } from "../../utils/commonUtils";

export default class ConnectionTable {
  constructor() {
    this.table = [];
  }

  setTable = (table) => (this.table = table);

  findItemInTable = (item) => {
    let rowIndex = 0;
    let colIndex = 0;
    for (let index in this.table) {
      const row = this.table[index];
      if (arrayContains(row, item)) {
        rowIndex = parseInt(index);
        colIndex = row.indexOf(item);
        return { rowIndex, colIndex };
      }
    }
  };

  print = (pretty) => printConnectionTable(this.table, pretty);
}

export function extendArrayFromEnd(arr, numItems) {
  const tip = Array(numItems).fill(0);
  return arr.concat(tip);
}

export function arrayReplaceItemsByOtherFromEnd(src, other) {
  const srcLength = src.length;
  const otherLength = other.length;
  const diff = srcLength - otherLength;

  if (otherLength >= srcLength) return other;

  let out = src.slice(0, diff);
  return out.concat(other);
}

export function getTableRowLength(table) {
  if (table.length === 0) return 0;
  let rowLength = 0;
  const firstParentItem = table[0];
  if (Array.isArray(firstParentItem)) rowLength = table[0].length;
  else rowLength = table.length;
  return rowLength;
}

export function getTableRowsCount(table) {
  if (table.length === 0) return 0;
  let rowsCount = 0;
  const firstParentItem = table[0];
  if (Array.isArray(firstParentItem)) rowsCount = table.length;
  else rowsCount = 1;
  return rowsCount;
}

export function getChildrenConnectionTable(childrenIdList, parentId) {
  let out = [];
  const numChildren = childrenIdList.length;
  for (let index = 0; index < numChildren; index++) {
    const childId = childrenIdList[index];
    const p = index === 0 ? parentId : 0;
    const row = [p, childId];
    out.push(row);
  }
  return out;
}

export function extendParentTable(parentTable, childTable, colIndex, rowIndex) {
  let outTable = [];

  const numParentRows = getTableRowsCount(parentTable);
  const numChildRows = getTableRowsCount(childTable);

  const parentRowLength = getTableRowLength(parentTable);
  const childRowLength = getTableRowLength(childTable);

  const columnsToAdd = colIndex + childRowLength - parentRowLength;
  const extendsParentRow = columnsToAdd > 0;

  if (numParentRows === 0 || numChildRows === 0) return parentTable;

  for (let index = 0; index < numParentRows; index++) {
    const isTargetRow = index === rowIndex;
    const canAddRowNow = !isTargetRow || numChildRows === 0;

    let parentRow = parentTable[index];
    if (extendsParentRow) parentRow = extendArrayFromEnd(parentRow, columnsToAdd);

    if (canAddRowNow) {
      outTable.push(parentRow);
      continue;
    }

    const extendedChildTable = extendTableBasedOnRow(childTable, parentRow, colIndex);

    outTable = outTable.concat(extendedChildTable);
  }

  return outTable;
}

export function extendTableBasedOnRow(childTable, baseRow, colIndex) {
  let outTable = [];
  const rowTotalLength = baseRow.length;
  const numChildRows = getTableRowsCount(childTable);
  for (let childIndex = 0; childIndex < numChildRows; childIndex++) {
    let childRow = childTable[childIndex];
    const childRowLength = childRow.length;
    const colsToAdd = rowTotalLength - (childRowLength + colIndex);
    if (colsToAdd > 0) childRow = extendArrayFromEnd(childRow, colsToAdd);

    let row = [];
    if (childIndex === 0) row = baseRow;
    else row = Array(rowTotalLength).fill(0);

    row = arrayReplaceItemsByOtherFromEnd(row, childRow);
    outTable.push(row);
  }
  return outTable;
}

export function buildConnectionTable(children, getChildrenIdList, selfId, doReduce) {
  let resultTable = getChildrenConnectionTable(getChildrenIdList, selfId);
  if (resultTable.length === 0) return [];

  const colIndex = getTableRowLength(resultTable) - 1;
  let childIndexOffset = 0;

  for (const index in children) {
    const rowIndex = parseInt(index) + childIndexOffset;
    const child = children[index];
    const childTable = child.objBuildConnectionTable(doReduce);
    const numChildRows = getTableRowsCount(childTable);
    if (numChildRows === 0) continue;

    resultTable = extendParentTable(resultTable, childTable, colIndex, rowIndex);
    if (doReduce) resultTable = reduceTable(resultTable);

    childIndexOffset += numChildRows - 1;
  }

  return resultTable;
}

const inverseTable = (table) => table.reverse();

const canMergeRows = (a, b) => mergeRows(a, b) != null;

const rowGetNumNonZeroes = (r) => r.filter((i) => i !== 0).length;

function mergeRows(a, b) {
  const rowLen = a.length;
  let outRow = [];
  for (const i of a) outRow.push(i);

  for (let index = 0; index < rowLen; index++) {
    const b_item = b[index];
    if (!b_item === 0) outRow[index] = b_item;
  }

  const aNumVal = rowGetNumNonZeroes(a);
  const bNumVal = rowGetNumNonZeroes(b);
  const outNumVal = rowGetNumNonZeroes(outRow);

  const isMerged = outNumVal === aNumVal + bNumVal;

  if (isMerged) return outRow;
}

function tableGetDeepestMergingRowIndex(table, start_index) {
  const numRows = getTableRowsCount(table);
  const numRowsIter = numRows - 1;
  const mergeSrcRow = table[start_index];
  const iterStartIndex = start_index + 1;

  let result = null;

  let index = iterStartIndex;
  while (index < numRowsIter) {
    const row = table[index];
    if (canMergeRows(mergeSrcRow, row)) {
      result = index;
      index += 1;
    } else break;
  }
  return result;
}

function reduceTable(table) {
  let outTable = [];
  const inverse = inverseTable(table);
  const numRows = getTableRowsCount(table);
  let mergeTriggered = false;
  let index = 0;

  while (index < numRows) {
    const currentRow = inverse[index];
    const rowMergeIndex = tableGetDeepestMergingRowIndex(inverse, index);
    if (rowMergeIndex != null) {
      const mergeTarget = inverse[rowMergeIndex];
      const merged = mergeRows(currentRow, mergeTarget);

      const midTablePartStart = index + 1;
      const midTablePartEnd = index + rowMergeIndex;
      const midTablePart = inverse.slice(midTablePartStart, midTablePartEnd);

      const restTableStart = rowMergeIndex + 1;
      const restTable = inverse.slice(restTableStart);

      outTable = outTable.concat(midTablePart);
      outTable.push(merged);
      outTable = outTable.concat(restTable);

      mergeTriggered = true;
      break;
    }

    outTable.push(currentRow);
    index += 1;
  }

  const inverseOut = inverseTable(outTable);
  return mergeTriggered ? reduceTable(inverseOut) : inverseOut;
}

export function printConnectionTable(table, pretty) {
  if (table) {
    for (const row of table) {
      if (pretty) {
        let new_row = [];
        for (const item of row) {
          if (item === 0) new_row.push(item);
          else new_row.push(1);
        }
        console.log(new_row);
      } else console.log(row);
    }
  }
  console.log("--------------------------------");
}

/*

  so we can build such table and then simplify if gaps are huge

  this

  [1, 1, 1, 0, 0]
  [0, 0, 1, 1, 1]
  [0, 0, 0, 0, 1]
  [0, 0, 0, 0, 1]
  [0, 1, 1, 0, 0]
  [0, 1, 1, 0, 0]

  will became this

  [1, 1, 1, 0, 0]
  [0, 0, 1, 1, 1]
  [0, 1, 1, 0, 1]
  [0, 1, 1, 0, 1]

 */

/*
      Connection table
      
      for example there are 3 children
      result:
      
      [1, 1]
      [0, 1]
      [0, 1]

      iterate through children...

      1: firs child has two children:
      result:

      [1, 1, 1]
      [0, 0, 1]
      [0, 1, 0]
      [0, 1, 0]
      
      2: second child has three children:
      result:
      [1, 1, 1]
      [0, 0, 1]
      [0, 1, 1]
      [0, 0, 1]
      [0, 0, 1]
      [0, 1, 0]

      3: third child has one child
      result:
      [1, 1, 1]
      [0, 0, 1]
      [0, 1, 1]
      [0, 0, 1]
      [0, 0, 1]
      [0, 1, 1]

*/
