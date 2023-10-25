// // import { jsPDF } from "jspdf";
// //
//
// //
// // export const makePDF = async ({ pdfName, src }: ExportPDFProps) => {
// //   // eslint-disable-next-line new-cap
// //   const doc = new jsPDF("p", "mm", "a4");
// //
// //   const blob = doc.output("blob");
// //
// //   console.log(blob);
// //   // doc.html(src, {
// //   //   callback: function (doc) {
// //   //     doc.save(`${pdfName}.pdf`);
// //   //   },
// //   // });
// //   console.log(src);
// // };
//
// import { type ReactNode, useRef } from "react";
// import { useReactToPrint } from "react-to-print";
//
// interface ExportPDFProps {
//   pdfName?: string;
//   src: ReactNode;
// }
//
// export const ExportPdfComponent = ({ src }: ExportPDFProps) => {
//   const componentRef = useRef(null);
//
//   function PrintPdf() {
//     const handlePrint = useReactToPrint({
//       content: () => componentRef.current,
//       documentTitle: "Visitor Pass",
//       onAfterPrint: () => {
//         console.log("Printed PDF successfully!");
//       },
//     });
//
//     return <div>{src}</div>;
//   }
// };
