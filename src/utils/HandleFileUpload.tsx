// // import * as pdfjs from 'pdfjs-dist'

// import {ChangeEvent} from 'react'
export {}
// console.log('first')
// import mammoth from 'mammoth'
// // export const handleFileUpload = (file: any) => {
// //   return new Promise<string>(async (resolve, reject) => {
// //     let pdfText = ''

// //     const reader = new FileReader()

// //     reader.readAsArrayBuffer(file)

// //     reader.onload = async function () {
// //       const arrayBuffer = reader.result

// //       if (arrayBuffer && typeof arrayBuffer !== 'string') {
// //         try {
// //           const loadingTask = pdfjs.getDocument({data: arrayBuffer})
// //           const pdf = await loadingTask.promise

// //           const pdfContent: any = []

// //           for (let i = 1; i <= pdf.numPages; i++) {
// //             const page = await pdf.getPage(i)
// //             const pageContent = await page.getTextContent()
// //             const textContent = pageContent.items.map((item: any) => item.str).join(' ')
// //             pdfContent.push(textContent)
// //           }

// //           pdfText = pdfContent.join('\n')

// //           resolve(pdfText)
// //         } catch (error) {
// //           reject(error)
// //         }
// //       }
// //     }
// //   })
// // }
// import * as pdfjs from 'pdfjs-dist'
// import * as mammoth from 'mammoth'
// import 'pdfjs-dist/build/pdf.worker.min.js'
// export const handleFileUpload = (file: any) => {
//   return new Promise<string>(async (resolve, reject) => {
//     let pdfText = ''

//     const reader = new FileReader()

//     pdfjs.GlobalWorkerOptions.workerSrc = 'path_to_pdfjs/build/pdf.worker.min.js'

//     reader.readAsArrayBuffer(file)

//     reader.onload = async function () {
//       const arrayBuffer = reader.result

//       if (arrayBuffer && typeof arrayBuffer !== 'string') {
//         try {
//           const loadingTask = pdfjs.getDocument({data: arrayBuffer})
//           const pdf = await loadingTask.promise

//           const pdfContent: any = []

//           for (let i = 1; i <= pdf.numPages; i++) {
//             const page = await pdf.getPage(i)
//             const pageContent = await page.getTextContent()
//             const textContent = pageContent.items.map((item: any) => item.str).join(' ')
//             pdfContent.push(textContent)
//           }

//           pdfText = pdfContent.join('\n')

//           // // Use mammoth to convert plain text to HTML with formatting
//           // mammoth
//           //   .convertToHtml({arrayBuffer})
//           //   .then((result) => {
//           //     // result.value contains the HTML with formatting
//           //     resolve(result.value)
//           //     console.log(result)
//           //   })
//           //   .catch((error) => {
//           //     reject(error)
//           //   })
//         } catch (error) {
//           reject(error)
//         }
//       }
//     }
//   })
// }
// export const convertDocxToHtml = async (file) => {
//   // const reader = new FileReader()
//   mammoth
//     .convertToHtml({arrayBuffer: file.arrayBuffer()})
//     .then(function (result) {
//       var html = result.value
//       console.log(html) // The generated HTML
//       var messages = result.messages // Any messages, such as warnings during conversion
//     })
//     .catch(function (error) {
//       console.error(error)
//     })
// }
// export const handleFileUpload = (file: File) => {
//   console.log(file)

//   if (file) {
//     const reader = new FileReader()
//     reader.onload = async (e) => {
//       const arrayBuffer = e.target?.result as ArrayBuffer
//       const result = await mammoth.convertToHtml({arrayBuffer})
//       console.log(result.value)
//     }
//     reader.readAsArrayBuffer(file)
//   }
// }

// export const handleFileUpload2 = async (file: File) => {
//   if (file) {
//     const arrayBuffer = await file.arrayBuffer()
//     const result = await mammoth.convertToHtml({arrayBuffer})
//     return result.value
//   }
// }
