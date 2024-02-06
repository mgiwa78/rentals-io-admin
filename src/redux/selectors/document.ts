import {RootState} from '../store'

export const selectDocumentState = (state: RootState) => state.document

export const selectDocumentForEdit = (state: RootState) =>
  selectDocumentState(state).documentForEdit
