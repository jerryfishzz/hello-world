export interface IColumn {
  columnId: string;
  columnName: string;
  columnEntityId: string;  // Id of the column which holds this column
  cardOnly: boolean;  // True for simple columns that can only hold cards, false for other possibilities: complex columns that holds other columns, or initial columns that can switch between simple and complex columns.
  directCards: string[];  // Array of the direct child cards of the column
  subColumns: string[];  // Array of the direct child columns of the column
  boardEntityId: string;  // Id of the board which holds this column
  boardEntityType: string;  // Type of the board which holds this column
}
