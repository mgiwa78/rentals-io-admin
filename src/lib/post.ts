import axios from 'axios'
import * as swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(swal.default)

const post = async (
  path: string,
  data: Object,
  authToken: string | null = null,
  isPrompt: boolean = false,
  prompt: string = ''
) => {
  try {
    const RESPONSE = await axios.post(process.env.REACT_APP_API_URL + path, data, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    })

    isPrompt &&
      MySwal.fire({
        text: prompt,
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Ok!',
        heightAuto: false,
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      })
    return RESPONSE.data
  } catch (error: any) {
    console.log(error)

    if (error?.response?.data?.message) {
      return MySwal.fire({
        text: error.response.data.message,
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Close!',
        heightAuto: false,
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      }).then(() => {})
    }
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

export default post
