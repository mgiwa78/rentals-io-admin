import axios from 'axios'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const put = async (
  path: string,
  data: Object,
  authToken: string | null,
  isPrompt: boolean = true,
  promt?: string | null
) => {
  try {
    console.log(data)
    const RESPONSE = await axios.put(process.env.REACT_APP_API_URL + path, data, {
      headers: {
        _method: 'put',
        Authorization: 'Bearer ' + authToken,
      },
    })

    if (RESPONSE) {
      isPrompt &&
        MySwal.fire({
          text: `${promt}`,
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Ok!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {})
    }
    return RESPONSE.data
  } catch (error: any) {
    console.log(error)

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
      case 409:
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

    if (error.message) {
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
    } else if (error.response?.data.errors) {
      if (error.response?.data.errors) {
        return MySwal.fire({
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
    } else if (error.response.data.error) {
      if (error.response.data.error) {
        return MySwal.fire({
          text: error.response.data.error,
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        }).then(() => {})
      }
    } else {
      return MySwal.fire({
        text: error.message,
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

export default put
