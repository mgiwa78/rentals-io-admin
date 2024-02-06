import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const get = async (path: string, authToken = '') => {
  try {
    const RESPONSE = await axios.get(process.env.REACT_APP_API_URL + path, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    })

    return RESPONSE.data
  } catch (error: any) {
    switch (error.message) {
      case 'Network Error':
        MySwal.fire({
          text: 'Network Error',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Close!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {})
        break

      default:
        break
    }

    switch (error.response?.status) {
      case 401:
        MySwal.fire({
          text: 'Unauthorised',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {})
        break
      case 407:
        MySwal.fire({
          text: 'Athentication Required',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {})
        break
      case 403:
        MySwal.fire({
          text: 'Permission Denied',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {})
        break
      case 500:
        MySwal.fire({
          text: 'Internal server error',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {})
    }

    if (error.response?.data.errors) {
      MySwal.fire({
        icon: 'error',
        html:
          '<div class="text-left align-left">' +
          error.response.data.errors.map(
            (e: any) => `<b class="text-capitalize"> ${e.field} </b>: ${e.message}<br>`
          ) +
          '</div>',
        buttonsStyling: false,
        confirmButtonText: 'Ok!',
        heightAuto: false,
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      }).then(() => {})
    }
    if (error.response?.data.error) {
      MySwal.fire({
        text: error.response?.data.error,
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok!',
        heightAuto: false,
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      }).then(() => {})
    } else {
      MySwal.fire({
        text: error?.message,
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok!',
        heightAuto: false,
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      }).then(() => {})
    }
  }
}

export default get
