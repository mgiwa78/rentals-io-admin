export default (error: any) => {
  if (error.reponse?.data.message) {
    // throw new Error(error.reponse.data.message)
  }
}
