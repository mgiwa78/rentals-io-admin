import {KTIcon} from '../../../_metronic/helpers'
import User from '../../../types/User'
import useUserManagement from '../hooks/userManagement'
// import {useListView} from '../core/ListViewProvider'

const UserEditModalHeader = ({state}: {state: any}) => {
  // const {setItemIdForUpdate} = useListView()
  const {setItemIdForUpdate, itemIdForUpdate, selectUser, RemoveUser} = state

  const handleModalUpdate = () => {
    setItemIdForUpdate(undefined)
    RemoveUser()
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'> {itemIdForUpdate ? 'Update User' : 'Add User'}</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => handleModalUpdate()}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export {UserEditModalHeader}
