import { IColumn } from "../Model/IColumn";

export class ColumnFactory {
  public generateGenericColumn
    (
    _columnId: string,
    _columnName: string,
    _columnEntityId: string,
    _cardOnly: boolean,
    _groupColumn: boolean,
    _directCards: string[],
    _subColumns: string[],
    _boardEntityId: string,
    _boardEntityType: string
    ): IColumn {
    var returnValue: IColumn;

    returnValue = {
      columnId: _columnId,
      columnName: _columnName,
      columnEntityId: _columnEntityId,
      cardOnly: _cardOnly,
      groupColumn: _groupColumn,
      directCards: _directCards,
      subColumns: _subColumns,
      boardEntityId: _boardEntityId,
      boardEntityType: _boardEntityType
    }

    return returnValue;
  }
}
