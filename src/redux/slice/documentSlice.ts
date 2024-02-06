import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import User from '../../types/User'
import TDocument from '../../types/Document'

interface DocumentState {
  documentForEdit: TDocument | null
}

const initialState: DocumentState = {
  documentForEdit: null,
}

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocForEdit(state, action: PayloadAction<{document: TDocument | null}>) {
      state.documentForEdit = action.payload.document
    },
  },
})

export const {setDocForEdit} = documentSlice.actions
export default documentSlice.reducer
