export const checkTypeByFileName = (fileName) => {
  const fileType = fileName.split('.').pop().toLowerCase();
  const excelTypes = ['xls', 'xlsx', 'xlsm', 'xlsb'];
  const documentTypes = ['doc', 'docx', 'docm', 'dotx', 'dotm'];
  const pdfTypes = ['pdf', 'pod'];
  const zipTypes = ['zip', 'rar', '7z', 'tar', 'gzip', 'tar.gz']
  const isExcel = excelTypes.includes(fileType);
  const isDocument = documentTypes.includes(fileType);
  const isPdf = pdfTypes.includes(fileType);
  const isZip = zipTypes.includes(fileType);
  const isUnknown =
    isExcel === false
    && isDocument === false
    && isPdf === false
    && isZip === false 
    ? true : false

  return { isExcel, isDocument, isPdf,isZip, isUnknown };
}