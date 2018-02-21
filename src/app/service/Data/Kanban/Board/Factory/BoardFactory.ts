import { IBoard } from "../Model/IBoard";

export class BoardFactory {
  public generateGenericBoard
    (
    _boardId: string,
    _boardName: string,
    _boardType: string,
    _idleColumn: string,
    _directColumns: string[],
    _archiveColumn: string,
    _entityId: string,
    ): IBoard {
    var returnValue: IBoard;
    console.log("factory");

    returnValue = {
      boardId: _boardId,
      boardName: _boardName,
      boardType: _boardType,
      idleColumn: _idleColumn,
      directColumns: _directColumns,
      archiveColumn: _archiveColumn,
      entityId: _entityId
    }

    return returnValue;
  }
}
